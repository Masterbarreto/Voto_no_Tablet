const supabase = require('../../api/config/supabase');
const { candidatoSchema } = require('../utils/validation');
const { registrarAuditoria } = require('../utils/helpers');

// Listar todos os candidatos com filtros e paginação
const listarCandidatos = async (req, res) => {
    const { page = 1, limit = 10, search, eleicao_id, status } = req.query;
    const offset = (page - 1) * limit;

    try {
        let query = supabase.from('candidatos').select('*, eleicoes(titulo, status)', { count: 'exact' });

        if (search) {
            query = query.or(`nome.ilike.%${search}%,numero.ilike.%${search}%`);
        }
        if (eleicao_id) {
            query = query.eq('eleicao_id', eleicao_id);
        }
        if (status) {
            query = query.eq('eleicoes.status', status);
        }

        query = query.range(offset, offset + limit - 1).order('nome', { ascending: true });

        const { data, error, count } = await query;

        if (error) {
            return res.status(500).json({ status: 'erro', message: 'Erro ao listar candidatos: ' + error.message });
        }

        res.status(200).json({
            status: 'sucesso',
            message: 'Candidatos listados com sucesso',
            data: {
                candidatos: data,
                pagination: {
                    totalItems: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'erro', message: 'Erro interno do servidor: ' + err.message });
    }
};

// Obter um candidato específico
const obterCandidato = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase.from('candidatos').select('*, eleicoes(titulo)').eq('id', id).single();

        if (error || !data) {
            return res.status(404).json({ status: 'erro', message: 'Candidato não encontrado' });
        }

        res.status(200).json({ status: 'sucesso', message: 'Candidato encontrado', data });
    } catch (err) {
        res.status(500).json({ status: 'erro', message: 'Erro interno do servidor: ' + err.message });
    }
};

// Criar um novo candidato
const criarCandidato = async (req, res) => {
    const { error, value } = candidatoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'erro', message: `Dados inválidos: ${error.details[0].message}` });
    }

    const { nome, numero, eleicao_id } = value;
    const partido = value.partido || 'Independente';
    const foto_url = value.foto_url || null;


    try {
        // Verificar se já existe um candidato com o mesmo número na mesma eleição
        const { data: existente, error: erroExistente } = await supabase
            .from('candidatos')
            .select('id')
            .eq('numero', numero)
            .eq('eleicao_id', eleicao_id)
            .single();

        if (existente) {
            return res.status(409).json({ status: 'erro', message: 'Já existe um candidato com este número nesta eleição.' });
        }

        const { data, error: insertError } = await supabase
            .from('candidatos')
            .insert([{ nome, numero, partido, eleicao_id, foto_url }])
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ status: 'erro', message: 'Erro ao criar candidato: ' + insertError.message });
        }

        await registrarAuditoria(req.user.id, 'criação', 'candidatos', data.id, null, data, req.ip);

        res.status(201).json({ status: 'sucesso', message: 'Candidato criado com sucesso', data });
    } catch (err) {
        res.status(500).json({ status: 'erro', message: 'Erro interno do servidor: ' + err.message });
    }
};


// Atualizar um candidato
const atualizarCandidato = async (req, res) => {
    const { id } = req.params;
    const { error, value } = candidatoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'erro', message: `Dados inválidos: ${error.details[0].message}` });
    }

    try {
        const { data: dadosAntigos } = await supabase.from('candidatos').select().eq('id', id).single();
        if (!dadosAntigos) return res.status(404).json({ status: 'erro', message: 'Candidato não encontrado' });

        const { data, error: updateError } = await supabase.from('candidatos').update(value).eq('id', id).select().single();

        if (updateError) {
            return res.status(500).json({ status: 'erro', message: 'Erro ao atualizar candidato: ' + updateError.message });
        }

        await registrarAuditoria(req.user.id, 'atualização', 'candidatos', id, dadosAntigos, data, req.ip);

        res.status(200).json({ status: 'sucesso', message: 'Candidato atualizado com sucesso', data });
    } catch (err) {
        res.status(500).json({ status: 'erro', message: 'Erro interno do servidor: ' + err.message });
    }
};

// Excluir um candidato
const excluirCandidato = async (req, res) => {
    const { id } = req.params;

    try {
        const { data: dadosAntigos, error: findError } = await supabase.from('candidatos').select().eq('id', id).single();
        if (findError || !dadosAntigos) {
            return res.status(404).json({ status: 'erro', message: 'Candidato não encontrado' });
        }

        const { error: deleteError } = await supabase.from('candidatos').delete().eq('id', id);

        if (deleteError) {
            return res.status(500).json({ status: 'erro', message: 'Erro ao excluir candidato: ' + deleteError.message });
        }

        await registrarAuditoria(req.user.id, 'exclusão', 'candidatos', id, dadosAntigos, null, req.ip);

        res.status(200).json({ status: 'sucesso', message: 'Candidato excluído com sucesso' });
    } catch (err) {
        res.status(500).json({ status: 'erro', message: 'Erro interno do servidor: ' + err.message });
    }
};

module.exports = {
    listarCandidatos,
    obterCandidato,
    criarCandidato,
    atualizarCandidato,
    excluirCandidato,
};

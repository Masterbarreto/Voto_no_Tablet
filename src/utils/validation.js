const Joi = require('joi');

const idSchema = Joi.string().uuid().required();

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
});

const usuarioSchema = Joi.object({
    nome: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    tipo: Joi.string().valid('admin', 'operador').optional(),
});

const urnaSchema = Joi.object({
    numero: Joi.string().required(),
    localizacao: Joi.string().required(),
    status: Joi.string().valid('ativa', 'inativa', 'manutencao').optional(),
    ip_address: Joi.string().ip().optional(),
    eleicao_id: Joi.string().uuid().optional(),
});

const eleicaoSchema = Joi.object({
    titulo: Joi.string().required(),
    descricao: Joi.string().optional().allow(''),
    data_inicio: Joi.date().iso().required(),
    data_fim: Joi.date().iso().greater(Joi.ref('data_inicio')).required(),
    status: Joi.string().valid('criada', 'ativa', 'finalizada', 'cancelada').optional(),
});

const candidatoSchema = Joi.object({
    nome: Joi.string().required(),
    numero: Joi.string().required(),
    partido: Joi.string().optional().allow(''),
    eleicao_id: Joi.string().uuid().required(),
    foto_url: Joi.string().uri().optional().allow(''),
});


const eleitorSchema = Joi.object({
    nome: Joi.string().required(),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    matricula: Joi.string().required(),
});


const votoSchema = Joi.object({
    eleitor_matricula: Joi.string().required(),
    candidato_id: Joi.string().required(), // Pode ser UUID, 'NULO' ou 'BRANCO'
    eleicao_id: Joi.string().uuid().required(),
    urna_id: Joi.string().uuid().optional(),
});

const validarEleitorSchema = Joi.object({
    matricula: Joi.string().required(),
});


module.exports = {
    idSchema,
    loginSchema,
    usuarioSchema,
    urnaSchema,
    eleicaoSchema,
    candidatoSchema,
    eleitorSchema,
    votoSchema,
    validarEleitorSchema
};

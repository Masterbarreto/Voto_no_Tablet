'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Candidate {
  id: string;
  numero: string;
  nome: string;
  partido: string;
  foto_url?: string;
}

interface Election {
  id: string;
  titulo: string;
  status: string;
}

export default function ManualVotePage() {
  const [candidateNumber, setCandidateNumber] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeElection, setActiveElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Carregar eleição ativa e candidatos ao montar componente
  useEffect(() => {
    const loadElectionData = async () => {
      try {
        setLoading(true);
        
        // A API busca automaticamente a eleição ativa quando não passamos eleicao_id
        const response = await fetch('/api/urna-votacao/candidatos');
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'sucesso') {
          setCandidates(data.data || []);
          
          // Se houver candidatos, significa que há uma eleição ativa
          if (data.data && data.data.length > 0) {
            // Podemos pegar o eleicao_id do primeiro candidato ou fazer uma chamada separada
            // Por agora, vamos considerar que a eleição está ativa
            setActiveElection({
              id: 'auto', // A API gerencia automaticamente
              titulo: 'Eleição Ativa',
              status: 'ativa'
            });
          } else {
            setError('Nenhuma eleição ativa encontrada ou sem candidatos');
          }
        } else {
          setError(data.message || 'Erro ao carregar dados da eleição');
        }
      } catch (error) {
        console.error('Erro ao carregar eleição:', error);
        setError('Erro ao conectar com o servidor. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadElectionData();
  }, []);

  // Validar número do candidato quando digitado
  useEffect(() => {
    if (candidateNumber.length > 0) {
      const candidate = candidates.find(c => c.numero === candidateNumber);
      if (candidate) {
        setSelectedCandidate(candidate);
        setError('');
      } else if (candidateNumber.length >= 2) {
        setSelectedCandidate(null);
        setError('Número inválido');
      } else {
        setSelectedCandidate(null);
        setError('');
      }
    } else {
      setSelectedCandidate(null);
      setError('');
    }
  }, [candidateNumber, candidates]);

  // Função de confirmação
  const handleConfirm = useCallback(() => {
    if (selectedCandidate && activeElection) {
      // Redirecionar para página de confirmação com os dados do candidato
      const voteData = {
        candidate: selectedCandidate,
        election: activeElection
      };
      
      // Armazenar temporariamente no sessionStorage
      sessionStorage.setItem('voteData', JSON.stringify(voteData));
      router.push('/vote/confirm');
    } else if (candidateNumber.length > 0) {
      setError('Número inválido. Tente novamente.');
    } else {
      setError('Digite um número para votar.');
    }
  }, [selectedCandidate, activeElection, candidateNumber, router]);

  // Handler do teclado
  useEffect(() => {
    const handlePhysicalKeypad = (event: KeyboardEvent) => {
      // Evitar ação se estiver carregando
      if (loading) return;
      
      if (/[0-9]/.test(event.key) && candidateNumber.length < 3) {
        setCandidateNumber(prev => prev + event.key);
      } else if (event.key === 'Backspace') {
        setCandidateNumber(prev => prev.slice(0, -1));
        setError('');
      } else if (event.key === 'Enter') {
        handleConfirm();
      } else if (event.key === 'Escape') {
        setCandidateNumber('');
        setSelectedCandidate(null);
        setError('');
      }
    };

    window.addEventListener('keydown', handlePhysicalKeypad);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeypad);
    };
  }, [candidateNumber, handleConfirm, loading]);

  // Exibir loading
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p>Carregando eleição...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Exibir erro se não há eleição ativa
  if (!activeElection || candidates.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-red-600">Eleição Indisponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-600">{error || 'Nenhuma eleição ativa encontrada'}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tentar Novamente
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-3xl">SEU VOTO PARA</CardTitle>
            <CardDescription className="text-center text-xl">{activeElection.titulo}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <p className="text-lg font-medium">Número:</p>
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value={candidateNumber[0] || ''} 
                    className="w-12 h-16 text-4xl text-center font-bold" 
                  />
                  <Input 
                    readOnly 
                    value={candidateNumber[1] || ''} 
                    className="w-12 h-16 text-4xl text-center font-bold" 
                  />
                  <Input 
                    readOnly 
                    value={candidateNumber[2] || ''} 
                    className="w-12 h-16 text-4xl text-center font-bold" 
                  />
                </div>
              </div>

              {/* Mostrar candidato selecionado */}
              {selectedCandidate && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800">{selectedCandidate.nome}</h3>
                  <p className="text-green-600">Partido: {selectedCandidate.partido}</p>
                  <p className="text-sm text-green-600">Número: {selectedCandidate.numero}</p>
                </div>
              )}

              {/* Mostrar erro */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Instruções */}
              <div className="mt-6 text-sm text-muted-foreground space-y-1">
                <p>Digite o número do candidato</p>
                <p>Aperte a tecla <span className="font-bold text-orange-500">LARANJA</span> (Backspace) para CORRIGIR</p>
                <p>Aperte a tecla <span className="font-bold text-green-600">VERDE</span> (Enter) para CONFIRMAR</p>
                <p>Aperte <span className="font-bold">ESC</span> para LIMPAR</p>
              </div>

              {/* Candidatos disponíveis */}
              {candidates.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Candidatos disponíveis:</h4>
                  <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                    {candidates.map(candidate => (
                      <div key={candidate.id} className="flex justify-between">
                        <span className="font-mono">{candidate.numero}</span>
                        <span className="truncate ml-2">{candidate.nome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
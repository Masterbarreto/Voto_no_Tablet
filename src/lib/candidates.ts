
export interface Candidate {
  id: string;
  name: string;
  party: string;
  photoUrl: string;
  photoHint: string;
}

// Numbers are now strings to match the input from the keypad
export const candidates: Candidate[] = [
  {
    id: '12',
    name: 'Eleonora Silva',
    party: 'Partido da Inovação',
    photoUrl: 'https://picsum.photos/seed/1/400/400',
    photoHint: 'woman portrait'
  },
  {
    id: '25',
    name: 'Ricardo Mendes',
    party: 'Aliança Progressista',
    photoUrl: 'https://picsum.photos/seed/2/400/400',
    photoHint: 'man portrait'
  },
  {
    id: '31',
    name: 'Júlia Andrade',
    party: 'Frente Democrática',
    photoUrl: 'https://picsum.photos/seed/3/400/400',
    photoHint: 'woman face'
  },
  {
    id: '45',
    name: 'Marcos Batista',
    party: 'União Nacional',
    photoUrl: 'https://picsum.photos/seed/4/400/400',
    photoHint: 'man face'
  },
];

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((candidate) => candidate.id === id);
}

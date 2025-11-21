// src/components/TagBar/tagData.ts

export const TAG_SEGMENTS = {
  /* ======  TEMPORAL  ====== */
  temporal: [
    'De dia',
    'De noite',
    'Amanhã',
    'Acontecendo hoje',
    'Acontecendo agora',
    'Nos próximos 3 dias',
    'Neste fim de semana',
    'Próximo sábado',
    'Próximo domingo',
    'Horário feliz',
    'Pôr do sol',
    'Depois das 23h'
  ],

  /* ======  ESTILO DE EVENTO  ====== */
  estilo: [
    'Open bar',
    'Open food',
    'Festa temática',
    'Festa de rua',
    'Bloco de rua',
    'Rolezinho',
    'Luau',
    'Microlive',
    'Show acústico',
    'DJ set',
    'Karaokê',
    'Quiz night',
    'Stand-up',
    'Jam session',
    'Casa de festa',
    'Pool party',
    'Rooftop',
    'Terrace party'
  ],

  /* ======  CULTURA & ARTE EFÊMERA  ====== */
  cultura: [
    'Expo pop-up',
    'Galeria temporária',
    'Cinema ao ar livre',
    'Poetry slam',
    'Contação de histórias',
    'Workshop de arte',
    'Performance de rua',
    'Live painting',
    'Batalha de MC',
    'Slam de poesia'
  ],

  /* ======  GASTRONOMIA CRIATIVA  ====== */
  gastronomia: [
    'Food truck',
    'Praça de alimentação',
    'Degustação',
    'Menu secreto',
    'Combo happy hour',
    'Petisco artesanal',
    'Cozinha de rua',
    'Pop-up bar',
    'Cerveja artesanal',
    'Drink exclusivo',
    'Mixologia',
    'Cocktail de autor',
    'Rodízio de drinks',
    'Tasting night'
  ],

  /* ======  MÚSICA AO VIVO  ====== */
  musica: [
    'Música ao vivo',
    'Banda cover',
    'MPB acústica',
    'Samba de raiz',
    'Rock independente',
    'Pop local',
    'Funk carioca',
    'Pagode de mesa',
    'Forró pé de serra',
    'Electronic night',
    'House session',
    'Techno underground'
  ],

  /* ======  AMBIENTE  ====== */
  ambiente: [
    'Ao ar livre',
    'Pé na areia',
    'Vista para o mar',
    'Rooftop',
    'Jardim suspenso',
    'Pátio interno',
    'Mezanino',
    'Subsolo',
    'Luz de néon',
    'Iluminação natural',
    'Decoração temática',
    'Lounge',
    'Dance floor',
    'Palco improvisado'
  ],

  /* ======  PERKS & CONVENIÊNCIAS  ====== */
  perks: [
    'Entrada franca',
    'Lista VIP',
    'Desconto antecipado',
    'Happy hour extendido',
    'Open bar limitado',
    'Primeira bebida grátis',
    'PIX cashback',
    'Estacionamento grátis',
    'Bike rack',
    'Pet friendly',
    'Acessível',
    'Banheiro unissex',
    'Wi-Fi liberado',
    'Carga de celular'
  ],

  /* ======  PÚBLICO-ALVO  ====== */
  publico: [
    'Para casais',
    'Para solteiros',
    'Grupos de amigos',
    'After work',
    'Universitários',
    'Turu bom',
    'LGBTQ+ friendly',
    '+18',
    '+21',
    'Casal + single',
    'Sem filhos',
    'Criativo',
    'Nômade digital'
  ],

  /* ======  VIBE / ATMOSFERA  ====== */
  vibe: [
    'Descontraído',
    'Alto astral',
    'Intimista',
    'Animado',
    'Brega chic',
    'Vintage',
    'Urbano',
    'Tropical',
    'Épico',
    'Surpreendente',
    'Inesperado',
    'Fotogênico',
    'Instagramável'
  ],

  promocoes: [
  'Pague 1 leve 2',
  'Happy Hour em dobro',
  'Desconto surpresa',
  'Promoção relâmpago',
  'Combo festa',
  'Entrada gratuita',
  'Primeira rodada grátis',
  'Desconto antecipado',
  'Lista VIP aberta',
  'Brinde exclusivo'
  ]
};



/* 1. same random order on every reload */
const shuffleFixed = <T,>(arr: T[]): T[] => {
  // simple 32-bit seedable PRNG
  let s = 0x6f4a7d9b;
  const rand = () => (s = Math.imul(s, 0x85ebca6b) + 0x1b873593) >>> 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand() % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export const ALL_TAGS = shuffleFixed([...new Set(Object.values(TAG_SEGMENTS).flat())]);

/* 2. alphabetical (existing) */
export const ALL_TAGS_ALPHABETIC = [...ALL_TAGS].sort((a, b) => a.localeCompare(b));
import React, { useEffect, useMemo, useState } from "react";

const BIOMES = {
  floresta: {
    id: "floresta",
    name: "Floresta Tropical",
    emoji: "🌳",
    color: "#1f6b3a",
    light: "#3fa75f",
    climate: "úmido e quente",
    threat: "desmatamento",
  },
  savana: {
    id: "savana",
    name: "Savana Árida",
    emoji: "🌾",
    color: "#b7832f",
    light: "#ddb35b",
    climate: "seco e sazonal",
    threat: "seca e caça",
  },
  tundra: {
    id: "tundra",
    name: "Tundra Gelada",
    emoji: "❄️",
    color: "#93b8c8",
    light: "#d6edf4",
    climate: "frio extremo",
    threat: "aquecimento",
  },
  pantanal: {
    id: "pantanal",
    name: "Pantanal Alagado",
    emoji: "💧",
    color: "#22727a",
    light: "#54b6bd",
    climate: "alagado e quente",
    threat: "poluição e fogo",
  },
};

const FOOD_NAMES = [
  "base vegetal",
  "herbívoro pequeno",
  "herbívoro médio",
  "herbívoro grande",
  "onívoro oportunista",
  "insetívoro",
  "frugívoro",
  "granívoro",
  "filtrador",
  "peixe/anfíbio",
  "réptil predador",
  "ave predadora",
  "mamífero predador",
  "mesopredador",
  "necrófago",
  "superpredador",
  "engenheiro do ecossistema",
  "polinizador/dispersor",
  "competidor dominante",
  "espécie-chave",
];

const SPECIES_DATA = [
  // FLORESTA TROPICAL — 20 animais
  { name: "Anta", biome: "floresta", rank: 1, diet: "frutos, folhas e brotos", strength: 42, mobility: 38, climateFlex: 35, repro: 52, icon: "AT", trait: "abre trilhas e espalha sementes grandes" },
  { name: "Cutia", biome: "floresta", rank: 2, diet: "sementes e frutos caídos", strength: 22, mobility: 55, climateFlex: 45, repro: 70, icon: "CU", trait: "enterra sementes e acelera regeneração" },
  { name: "Preguiça", biome: "floresta", rank: 3, diet: "folhas novas", strength: 18, mobility: 12, climateFlex: 30, repro: 20, icon: "PG", trait: "vive no dossel e sofre muito com perda de árvores" },
  { name: "Macaco-prego", biome: "floresta", rank: 4, diet: "frutos, insetos e ovos", strength: 34, mobility: 72, climateFlex: 55, repro: 50, icon: "MP", trait: "inteligente, explora novas fontes de alimento" },
  { name: "Tucano", biome: "floresta", rank: 5, diet: "frutas e pequenos animais", strength: 24, mobility: 68, climateFlex: 48, repro: 45, icon: "TU", trait: "dispersor de sementes entre áreas distantes" },
  { name: "Arara-vermelha", biome: "floresta", rank: 6, diet: "sementes duras e frutas", strength: 32, mobility: 74, climateFlex: 44, repro: 38, icon: "AR", trait: "quebra sementes resistentes e depende de árvores altas" },
  { name: "Tamanduá-mirim", biome: "floresta", rank: 7, diet: "formigas e cupins", strength: 30, mobility: 35, climateFlex: 46, repro: 35, icon: "TM", trait: "controla insetos sociais" },
  { name: "Sapo-folha", biome: "floresta", rank: 8, diet: "mosquitos e larvas", strength: 10, mobility: 22, climateFlex: 20, repro: 80, icon: "SF", trait: "bioindicador: cai rápido com poluição e seca" },
  { name: "Jiboia", biome: "floresta", rank: 9, diet: "roedores, aves e anfíbios", strength: 48, mobility: 28, climateFlex: 55, repro: 38, icon: "JI", trait: "predador silencioso de médio porte" },
  { name: "Gavião-real", biome: "floresta", rank: 10, diet: "macacos, preguiças e aves", strength: 72, mobility: 80, climateFlex: 40, repro: 22, icon: "GR", trait: "predador do topo do dossel" },
  { name: "Onça-pintada", biome: "floresta", rank: 11, diet: "antas, capivaras e jacarés", strength: 92, mobility: 65, climateFlex: 60, repro: 25, icon: "OP", trait: "superpredador que regula herbívoros grandes" },
  { name: "Jaguatirica", biome: "floresta", rank: 12, diet: "roedores, aves e lagartos", strength: 54, mobility: 72, climateFlex: 62, repro: 45, icon: "JA", trait: "mesopredador adaptável" },
  { name: "Quati", biome: "floresta", rank: 13, diet: "frutos, ovos e insetos", strength: 31, mobility: 58, climateFlex: 66, repro: 62, icon: "QT", trait: "onívoro que prospera perto de humanos" },
  { name: "Irara", biome: "floresta", rank: 14, diet: "mel, pequenos vertebrados e frutos", strength: 44, mobility: 70, climateFlex: 58, repro: 42, icon: "IR", trait: "explora ninhos e cavidades" },
  { name: "Coruja-murucututu", biome: "floresta", rank: 15, diet: "roedores e aves pequenas", strength: 47, mobility: 64, climateFlex: 50, repro: 32, icon: "CO", trait: "caçadora noturna" },
  { name: "Morcego-frugívoro", biome: "floresta", rank: 16, diet: "frutas e néctar", strength: 15, mobility: 82, climateFlex: 52, repro: 58, icon: "MF", trait: "replanta a floresta durante a noite" },
  { name: "Borboleta-azul", biome: "floresta", rank: 17, diet: "néctar", strength: 4, mobility: 40, climateFlex: 25, repro: 90, icon: "BA", trait: "polinizadora frágil" },
  { name: "Formiga-cortadeira", biome: "floresta", rank: 18, diet: "folhas e fungos", strength: 8, mobility: 26, climateFlex: 70, repro: 95, icon: "FC", trait: "recicla matéria vegetal e compete com brotos" },
  { name: "Besouro-rinoceronte", biome: "floresta", rank: 19, diet: "madeira morta e seiva", strength: 12, mobility: 32, climateFlex: 38, repro: 75, icon: "BR", trait: "decompõe troncos" },
  { name: "Macuco", biome: "floresta", rank: 20, diet: "sementes, frutos e insetos", strength: 26, mobility: 33, climateFlex: 36, repro: 48, icon: "MC", trait: "ave de chão, sensível a fragmentação" },

  // SAVANA ÁRIDA — 20 animais
  { name: "Elefante-da-savana", biome: "savana", rank: 1, diet: "gramíneas, cascas e folhas", strength: 95, mobility: 42, climateFlex: 58, repro: 18, icon: "EL", trait: "derruba árvores e cria clareiras" },
  { name: "Zebra", biome: "savana", rank: 2, diet: "gramíneas duras", strength: 48, mobility: 78, climateFlex: 62, repro: 38, icon: "ZE", trait: "migra em bandos quando a seca aperta" },
  { name: "Gnu", biome: "savana", rank: 3, diet: "capim novo", strength: 45, mobility: 84, climateFlex: 65, repro: 54, icon: "GN", trait: "migrador em massa, responde rápido a chuva" },
  { name: "Gazela-de-thomson", biome: "savana", rank: 4, diet: "brotos e gramíneas baixas", strength: 24, mobility: 92, climateFlex: 60, repro: 68, icon: "GZ", trait: "veloz, mas vulnerável a cercas" },
  { name: "Girafa", biome: "savana", rank: 5, diet: "folhas altas de acácias", strength: 68, mobility: 55, climateFlex: 50, repro: 25, icon: "GI", trait: "alcança alimento inacessível a outros herbívoros" },
  { name: "Rinoceronte-negro", biome: "savana", rank: 6, diet: "arbustos espinhosos", strength: 88, mobility: 36, climateFlex: 42, repro: 18, icon: "RN", trait: "forte, lento e muito afetado por caça" },
  { name: "Avestruz", biome: "savana", rank: 7, diet: "sementes, insetos e brotos", strength: 36, mobility: 88, climateFlex: 70, repro: 45, icon: "AV", trait: "onívoro veloz em campo aberto" },
  { name: "Suricato", biome: "savana", rank: 8, diet: "insetos, escorpiões e ovos", strength: 16, mobility: 62, climateFlex: 68, repro: 72, icon: "SU", trait: "vive em colônias e vigia predadores" },
  { name: "Javali-africano", biome: "savana", rank: 9, diet: "raízes, frutos e carcaças", strength: 46, mobility: 60, climateFlex: 76, repro: 64, icon: "JV", trait: "resistente e oportunista" },
  { name: "Cão-selvagem-africano", biome: "savana", rank: 10, diet: "antilopes e roedores", strength: 62, mobility: 90, climateFlex: 58, repro: 48, icon: "CS", trait: "caça cooperativa e persegue por longas distâncias" },
  { name: "Hiena-malhada", biome: "savana", rank: 11, diet: "carcaças e caça própria", strength: 70, mobility: 68, climateFlex: 72, repro: 44, icon: "HI", trait: "necrófaga e predadora resistente" },
  { name: "Leão", biome: "savana", rank: 12, diet: "zebras, gnus e búfalos", strength: 90, mobility: 62, climateFlex: 48, repro: 26, icon: "LE", trait: "predador de topo que depende de presas grandes" },
  { name: "Leopardo", biome: "savana", rank: 13, diet: "gazelas, aves e macacos", strength: 74, mobility: 76, climateFlex: 66, repro: 34, icon: "LP", trait: "solitário, consegue viver na borda de biomas" },
  { name: "Chacal", biome: "savana", rank: 14, diet: "roedores, insetos e restos", strength: 32, mobility: 74, climateFlex: 82, repro: 62, icon: "CH", trait: "oportunista que cresce quando há lixo humano" },
  { name: "Águia-marcial", biome: "savana", rank: 15, diet: "aves, répteis e pequenos mamíferos", strength: 66, mobility: 86, climateFlex: 52, repro: 25, icon: "AM", trait: "predadora aérea de áreas abertas" },
  { name: "Cobra-cuspideira", biome: "savana", rank: 16, diet: "roedores e lagartos", strength: 36, mobility: 46, climateFlex: 74, repro: 50, icon: "CC", trait: "resiste ao calor e controla roedores" },
  { name: "Lagarto-agama", biome: "savana", rank: 17, diet: "insetos e brotos", strength: 14, mobility: 52, climateFlex: 78, repro: 76, icon: "LA", trait: "pequeno, rápido e favorecido por calor" },
  { name: "Abutre-de-rüppell", biome: "savana", rank: 18, diet: "carcaças", strength: 38, mobility: 95, climateFlex: 64, repro: 20, icon: "AB", trait: "limpa carcaças e reduz doenças" },
  { name: "Cupim-da-savana", biome: "savana", rank: 19, diet: "matéria vegetal seca", strength: 6, mobility: 16, climateFlex: 88, repro: 98, icon: "CP", trait: "constrói cupinzeiros e recicla nutrientes" },
  { name: "Escaravelho", biome: "savana", rank: 20, diet: "fezes e matéria orgânica", strength: 5, mobility: 35, climateFlex: 80, repro: 94, icon: "ES", trait: "fertiliza o solo" },

  // TUNDRA GELADA — 20 animais
  { name: "Caribu", biome: "tundra", rank: 1, diet: "liquens, musgos e capins", strength: 58, mobility: 82, climateFlex: 48, repro: 42, icon: "CA", trait: "migrador de longas distâncias" },
  { name: "Boi-almiscarado", biome: "tundra", rank: 2, diet: "gramíneas congeladas", strength: 82, mobility: 34, climateFlex: 40, repro: 22, icon: "BO", trait: "forma círculo defensivo contra lobos" },
  { name: "Lebre-ártica", biome: "tundra", rank: 3, diet: "brotos, cascas e musgos", strength: 20, mobility: 76, climateFlex: 52, repro: 78, icon: "LB", trait: "troca pelagem e vira presa central" },
  { name: "Lêmure-da-tundra", biome: "tundra", rank: 4, diet: "gramíneas e sementes", strength: 8, mobility: 45, climateFlex: 50, repro: 96, icon: "LM", trait: "pequeno roedor com ciclos explosivos" },
  { name: "Esquilo-ártico", biome: "tundra", rank: 5, diet: "sementes e raízes", strength: 13, mobility: 48, climateFlex: 55, repro: 72, icon: "EA", trait: "hiberna e armazena comida" },
  { name: "Ganso-das-neves", biome: "tundra", rank: 6, diet: "raízes aquáticas e capins", strength: 25, mobility: 88, climateFlex: 62, repro: 48, icon: "GS", trait: "chega com degelo e migra com frio extremo" },
  { name: "Coruja-das-neves", biome: "tundra", rank: 7, diet: "lêmures e lebres", strength: 58, mobility: 82, climateFlex: 44, repro: 32, icon: "CN", trait: "predadora dependente de roedores" },
  { name: "Raposa-ártica", biome: "tundra", rank: 8, diet: "roedores, ovos e carcaças", strength: 42, mobility: 78, climateFlex: 46, repro: 64, icon: "RA", trait: "oportunista, mas sofre com aquecimento" },
  { name: "Lobo-ártico", biome: "tundra", rank: 9, diet: "caribus, lebres e bois-almiscarados", strength: 82, mobility: 76, climateFlex: 38, repro: 28, icon: "LA", trait: "caçador social de grandes presas" },
  { name: "Urso-polar", biome: "tundra", rank: 10, diet: "focas e carcaças", strength: 98, mobility: 55, climateFlex: 20, repro: 12, icon: "UP", trait: "superpredador altamente dependente de gelo" },
  { name: "Foca-anelada", biome: "tundra", rank: 11, diet: "peixes e crustáceos", strength: 46, mobility: 68, climateFlex: 36, repro: 25, icon: "FO", trait: "presa essencial para urso-polar" },
  { name: "Morsa", biome: "tundra", rank: 12, diet: "moluscos do fundo", strength: 90, mobility: 42, climateFlex: 28, repro: 14, icon: "MO", trait: "precisa de gelo para descansar" },
  { name: "Bacalhau-polar", biome: "tundra", rank: 13, diet: "plâncton e larvas", strength: 12, mobility: 52, climateFlex: 30, repro: 86, icon: "BP", trait: "base animal do mar gelado" },
  { name: "Krill-ártico", biome: "tundra", rank: 14, diet: "fitoplâncton", strength: 2, mobility: 22, climateFlex: 34, repro: 99, icon: "KR", trait: "alimenta peixes, aves e focas" },
  { name: "Gaivota-marfim", biome: "tundra", rank: 15, diet: "peixes, ovos e restos", strength: 26, mobility: 92, climateFlex: 32, repro: 30, icon: "GM", trait: "segue gelo e carcaças" },
  { name: "Doninha-ártica", biome: "tundra", rank: 16, diet: "roedores e ovos", strength: 24, mobility: 70, climateFlex: 48, repro: 66, icon: "DA", trait: "predador pequeno de alta agilidade" },
  { name: "Pombo-guillemot", biome: "tundra", rank: 17, diet: "peixes pequenos", strength: 22, mobility: 84, climateFlex: 38, repro: 35, icon: "PG", trait: "ave mergulhadora costeira" },
  { name: "Mosquito-ártico", biome: "tundra", rank: 18, diet: "néctar e sangue", strength: 1, mobility: 30, climateFlex: 70, repro: 100, icon: "MS", trait: "explode em verões quentes" },
  { name: "Besouro-da-neve", biome: "tundra", rank: 19, diet: "matéria orgânica fria", strength: 3, mobility: 20, climateFlex: 62, repro: 80, icon: "BN", trait: "decompõe restos no solo gelado" },
  { name: "Aranha-lobo-ártica", biome: "tundra", rank: 20, diet: "insetos e larvas", strength: 9, mobility: 42, climateFlex: 68, repro: 88, icon: "AL", trait: "cresce com verões mais longos" },

  // PANTANAL ALAGADO — 20 animais
  { name: "Capivara", biome: "pantanal", rank: 1, diet: "capim alagado e plantas aquáticas", strength: 46, mobility: 55, climateFlex: 66, repro: 78, icon: "CV", trait: "herbívoro abundante e presa central" },
  { name: "Cervo-do-pantanal", biome: "pantanal", rank: 2, diet: "plantas aquáticas e brotos", strength: 56, mobility: 62, climateFlex: 42, repro: 28, icon: "CE", trait: "sensível a seca prolongada" },
  { name: "Bugio-preto", biome: "pantanal", rank: 3, diet: "folhas, flores e frutos", strength: 35, mobility: 54, climateFlex: 38, repro: 30, icon: "BU", trait: "depende de matas ciliares" },
  { name: "Ariranha", biome: "pantanal", rank: 4, diet: "peixes e crustáceos", strength: 62, mobility: 80, climateFlex: 48, repro: 36, icon: "AI", trait: "predadora social de rios limpos" },
  { name: "Lontra-neotropical", biome: "pantanal", rank: 5, diet: "peixes pequenos e anfíbios", strength: 38, mobility: 74, climateFlex: 56, repro: 42, icon: "LN", trait: "adaptável, mas sofre com poluição" },
  { name: "Jacaré-do-pantanal", biome: "pantanal", rank: 6, diet: "peixes, aves e capivaras jovens", strength: 80, mobility: 42, climateFlex: 70, repro: 58, icon: "JC", trait: "predador aquático resistente" },
  { name: "Sucuri-verde", biome: "pantanal", rank: 7, diet: "capivaras, aves e jacarés jovens", strength: 86, mobility: 38, climateFlex: 60, repro: 30, icon: "SV", trait: "emboscadora gigante de áreas alagadas" },
  { name: "Onça-parda", biome: "pantanal", rank: 8, diet: "veados, capivaras e aves", strength: 78, mobility: 72, climateFlex: 70, repro: 34, icon: "ON", trait: "predador flexível que cruza biomas" },
  { name: "Tuiuiú", biome: "pantanal", rank: 9, diet: "peixes, anfíbios e moluscos", strength: 44, mobility: 76, climateFlex: 44, repro: 28, icon: "TI", trait: "símbolo do alagado, depende de áreas rasas" },
  { name: "Garça-branca", biome: "pantanal", rank: 10, diet: "peixes pequenos e insetos aquáticos", strength: 24, mobility: 82, climateFlex: 58, repro: 50, icon: "GB", trait: "segue a subida e descida das águas" },
  { name: "Colhereiro", biome: "pantanal", rank: 11, diet: "larvas, crustáceos e peixes", strength: 22, mobility: 78, climateFlex: 50, repro: 44, icon: "CL", trait: "filtra alimento em água rasa" },
  { name: "Piranha-vermelha", biome: "pantanal", rank: 12, diet: "peixes, carcaças e feridos", strength: 28, mobility: 68, climateFlex: 74, repro: 86, icon: "PI", trait: "explode em poças isoladas" },
  { name: "Dourado", biome: "pantanal", rank: 13, diet: "peixes menores", strength: 52, mobility: 88, climateFlex: 34, repro: 40, icon: "DO", trait: "predador migrador de rios conectados" },
  { name: "Pacu", biome: "pantanal", rank: 14, diet: "frutos alagados e sementes", strength: 30, mobility: 64, climateFlex: 52, repro: 62, icon: "PA", trait: "dispersa sementes pela água" },
  { name: "Rã-pimenta", biome: "pantanal", rank: 15, diet: "insetos e larvas", strength: 8, mobility: 28, climateFlex: 26, repro: 92, icon: "RP", trait: "desaparece rápido com químicos" },
  { name: "Cobra-d'água", biome: "pantanal", rank: 16, diet: "peixes e anfíbios", strength: 24, mobility: 48, climateFlex: 64, repro: 54, icon: "CD", trait: "predador pequeno de margens" },
  { name: "Caramujo-maçã", biome: "pantanal", rank: 17, diet: "algas e plantas macias", strength: 5, mobility: 12, climateFlex: 58, repro: 96, icon: "CM", trait: "filtra nutrientes e vira presa de aves" },
  { name: "Libélula-verde", biome: "pantanal", rank: 18, diet: "mosquitos e microinsetos", strength: 3, mobility: 70, climateFlex: 46, repro: 90, icon: "LV", trait: "controle natural de mosquitos" },
  { name: "Caranguejo-do-brejo", biome: "pantanal", rank: 19, diet: "detritos e plantas", strength: 10, mobility: 30, climateFlex: 62, repro: 82, icon: "CB", trait: "revira sedimentos e recicla matéria" },
  { name: "Urubu-de-cabeça-preta", biome: "pantanal", rank: 20, diet: "carcaças", strength: 28, mobility: 90, climateFlex: 78, repro: 36, icon: "UR", trait: "limpa animais mortos e reduz doenças" },
];

const ACTIONS = {
  none: { name: "Sem ação", desc: "apenas observar" },
  drought: { name: "Provocar seca", desc: "derruba água, vegetação e força migração" },
  rain: { name: "Chuva artificial", desc: "aumenta água e vegetação" },
  fire: { name: "Queimada", desc: "remove vegetação e causa mortalidade" },
  hunting: { name: "Caça seletiva", desc: "atinge os animais mais fortes e predadores" },
  pollution: { name: "Poluição", desc: "prejudica anfíbios, peixes e espécies frágeis" },
  food: { name: "Oferta de comida", desc: "aumenta herbívoros e atrai predadores" },
  reserve: { name: "Criar reserva", desc: "reduz pressão humana e melhora reprodução" },
  road: { name: "Abrir estrada", desc: "fragmenta o bioma e dificulta migração" },
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function seededNoise(a, b, c = 0) {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return x - Math.floor(x);
}

function biomeAt(x, y, cols, rows) {
  if (x < cols / 2 && y < rows / 2) return "floresta";
  if (x >= cols / 2 && y < rows / 2) return "savana";
  if (x < cols / 2 && y >= rows / 2) return "tundra";
  return "pantanal";
}

function getNeighbors(id) {
  const map = {
    floresta: ["savana", "tundra", "pantanal"],
    savana: ["floresta", "pantanal", "tundra"],
    tundra: ["floresta", "pantanal", "savana"],
    pantanal: ["savana", "tundra", "floresta"],
  };
  return map[id];
}

function newBiomeState() {
  return {
    floresta: { vegetation: 76, water: 80, temp: 62, human: 16, pollution: 8, fireRisk: 22, barrier: 8, protection: 10 },
    savana: { vegetation: 52, water: 36, temp: 76, human: 18, pollution: 6, fireRisk: 42, barrier: 10, protection: 8 },
    tundra: { vegetation: 34, water: 50, temp: 22, human: 10, pollution: 4, fireRisk: 8, barrier: 5, protection: 16 },
    pantanal: { vegetation: 70, water: 92, temp: 68, human: 20, pollution: 14, fireRisk: 18, barrier: 9, protection: 12 },
  };
}

function initialSpecies() {
  return SPECIES_DATA.map((s, index) => ({
    ...s,
    id: `${s.biome}-${index}`,
    homeBiome: s.biome,
    currentBiome: s.biome,
    population: Math.round(28 + s.repro * 0.9 + (20 - s.rank) * 1.6),
    health: 72,
    stress: 14,
    migrated: false,
    alive: true,
  }));
}

function climateLabel(state) {
  const water = state.water;
  const temp = state.temp;
  const fire = state.fireRisk;
  if (fire > 70) return "risco de fogo";
  if (water < 25) return "seca severa";
  if (water > 85) return "cheia";
  if (temp > 78) return "onda de calor";
  if (temp < 25) return "frio intenso";
  if (state.pollution > 55) return "poluído";
  return "estável";
}

function biomeSuitability(species, biomeId, b) {
  let score = 52;
  if (species.homeBiome === biomeId) score += 34;
  if (biomeId === "pantanal") score += species.diet.includes("peix") || species.diet.includes("aqu") ? 12 : -4;
  if (biomeId === "tundra") score += species.climateFlex < 35 ? 4 : -10;
  if (biomeId === "savana") score += species.mobility > 70 ? 8 : 0;
  if (biomeId === "floresta") score += species.mobility > 60 && species.diet.includes("frut") ? 8 : 0;
  score += (b.vegetation - 50) * 0.22;
  score += (b.water - 50) * 0.14;
  score -= b.pollution * (species.rank === 8 || species.diet.includes("anfíb") || species.diet.includes("peix") ? 0.38 : 0.14);
  score -= Math.abs(b.temp - preferredTemp(species.homeBiome)) * (1 - species.climateFlex / 130);
  return clamp(score, 0, 100);
}

function preferredTemp(biome) {
  return { floresta: 64, savana: 76, tundra: 22, pantanal: 68 }[biome] || 55;
}

function simulateStep(speciesList, biomeState, tick, log, speed) {
  const nextBiomes = JSON.parse(JSON.stringify(biomeState));
  const nextLog = [...log];
  const weatherPulse = Math.sin(tick / 6);

  Object.entries(nextBiomes).forEach(([id, b]) => {
    const seasonalRain = id === "pantanal" ? Math.sin(tick / 9) * 6 : Math.sin(tick / 11) * 4;
    const heatPulse = id === "tundra" ? Math.sin(tick / 13) * 4 : weatherPulse * 3;
    b.temp = clamp(b.temp + heatPulse * 0.12 + (b.human - b.protection) * 0.01, 0, 100);
    b.water = clamp(b.water + seasonalRain * 0.08 - b.temp * 0.015 - b.human * 0.01 + b.protection * 0.015, 0, 100);
    b.fireRisk = clamp(b.fireRisk + (b.temp - 55) * 0.018 - b.water * 0.015 + b.human * 0.018, 0, 100);
    b.pollution = clamp(b.pollution + b.human * 0.006 - b.protection * 0.012, 0, 100);
    const growth = b.water * 0.035 + b.protection * 0.025 - b.fireRisk * 0.03 - b.pollution * 0.018;
    b.vegetation = clamp(b.vegetation + growth, 0, 100);
    b.human = clamp(b.human + seededNoise(tick, id.length) * 0.05 - b.protection * 0.01, 0, 100);
  });

  if (tick % 17 === 0) {
    const ids = Object.keys(BIOMES);
    const target = ids[tick % ids.length];
    nextBiomes[target].water = clamp(nextBiomes[target].water - 10);
    nextBiomes[target].fireRisk = clamp(nextBiomes[target].fireRisk + 12);
    nextLog.unshift(`Clima automático: estação seca atingiu ${BIOMES[target].name}.`);
  }

  if (tick % 23 === 0) {
    const ids = Object.keys(BIOMES);
    const target = ids[(tick + 1) % ids.length];
    nextBiomes[target].water = clamp(nextBiomes[target].water + 12);
    nextBiomes[target].vegetation = clamp(nextBiomes[target].vegetation + 8);
    nextLog.unshift(`Clima automático: chuva forte renovou ${BIOMES[target].name}.`);
  }

  const byBiome = {};
  speciesList.forEach((s) => {
    if (!byBiome[s.currentBiome]) byBiome[s.currentBiome] = [];
    byBiome[s.currentBiome].push(s);
  });

  const nextSpecies = speciesList.map((s) => {
    const b = nextBiomes[s.currentBiome];
    const local = byBiome[s.currentBiome] || [];
    const prey = local.filter((p) => p.rank < s.rank && p.population > 0);
    const predators = local.filter((p) => p.rank > s.rank && p.strength > s.strength * 0.85 && p.population > 0);
    const preyMass = prey.reduce((sum, p) => sum + p.population * (1 + p.rank / 25), 0);
    const predPressure = predators.reduce((sum, p) => sum + p.population * (p.strength / 100), 0);
    const suitability = biomeSuitability(s, s.currentBiome, b);
    const resource = b.vegetation * (s.rank <= 8 ? 0.18 : 0.04) + preyMass * (s.rank > 8 ? 0.024 : 0.005) + b.water * 0.08;
    const humanDamage = Math.max(0, b.human - b.protection) * (s.strength > 70 || s.rank > 10 ? 0.035 : 0.018);
    const pollutionDamage = b.pollution * (s.diet.includes("peix") || s.diet.includes("anfíb") || s.name.includes("Sapo") || s.name.includes("Rã") ? 0.065 : 0.018);
    const fireDamage = b.fireRisk > 65 ? (b.fireRisk - 65) * (s.mobility < 45 ? 0.09 : 0.04) : 0;
    const predDamage = predPressure * (100 - s.mobility) * 0.0009;
    const gain = (resource + suitability + s.repro * 0.35) / 52;
    const loss = humanDamage + pollutionDamage + fireDamage + predDamage + Math.max(0, 42 - suitability) * 0.045;
    const popDelta = (gain - loss - 0.42) * (0.3 + speed * 0.1);
    const stressDelta = loss * 1.8 - gain * 0.8 + (s.currentBiome !== s.homeBiome ? 0.5 : -0.25);
    let population = Math.max(0, Math.round(s.population + popDelta + seededNoise(tick, s.rank, s.population) * 2 - 0.7));
    let stress = clamp(s.stress + stressDelta);
    let health = clamp(100 - stress + suitability * 0.1);
    let currentBiome = s.currentBiome;
    let migrated = s.migrated;

    const migrationNeed = stress > 68 || suitability < 32 || b.water < 18 || b.vegetation < 18;
    const canMigrate = s.mobility > 34 && b.barrier < 72 && population > 5;
    if (migrationNeed && canMigrate && tick % 4 === s.rank % 4) {
      const candidates = getNeighbors(s.currentBiome).map((id) => ({ id, score: biomeSuitability(s, id, nextBiomes[id]) - nextBiomes[id].barrier * 0.25 }));
      candidates.sort((a, b) => b.score - a.score);
      if (candidates[0] && candidates[0].score > suitability + 5) {
        currentBiome = candidates[0].id;
        migrated = true;
        stress = clamp(stress - 14);
        population = Math.max(2, Math.round(population * 0.82));
        nextLog.unshift(`${s.name} migrou para ${BIOMES[currentBiome].name} em busca de comida e clima melhor.`);
      }
    }

    const alive = population > 0;
    if (!alive && s.alive) {
      nextLog.unshift(`${s.name} entrou em colapso populacional.`);
    }

    return { ...s, population, stress, health, currentBiome, migrated, alive };
  });

  return { species: nextSpecies, biomes: nextBiomes, log: nextLog.slice(0, 10) };
}

function applyAction(action, biomeId, speciesList, biomeState, log) {
  const b = JSON.parse(JSON.stringify(biomeState));
  let s = speciesList.map((x) => ({ ...x }));
  const target = b[biomeId];
  const biomeName = BIOMES[biomeId].name;
  let message = "";

  switch (action) {
    case "drought":
      target.water = clamp(target.water - 26);
      target.vegetation = clamp(target.vegetation - 16);
      target.fireRisk = clamp(target.fireRisk + 24);
      message = `Interferência humana: seca provocada em ${biomeName}.`;
      break;
    case "rain":
      target.water = clamp(target.water + 26);
      target.vegetation = clamp(target.vegetation + 14);
      target.fireRisk = clamp(target.fireRisk - 18);
      message = `Interferência humana: chuva artificial em ${biomeName}.`;
      break;
    case "fire":
      target.vegetation = clamp(target.vegetation - 34);
      target.fireRisk = clamp(target.fireRisk + 36);
      s = s.map((sp) => sp.currentBiome === biomeId ? { ...sp, population: Math.max(0, Math.round(sp.population * (sp.mobility > 60 ? 0.9 : 0.72))), stress: clamp(sp.stress + 22) } : sp);
      message = `Interferência humana: queimada em ${biomeName}. Espécies lentas sofreram mais.`;
      break;
    case "hunting":
      target.human = clamp(target.human + 12);
      s = s.map((sp) => {
        if (sp.currentBiome !== biomeId) return sp;
        const hit = sp.strength > 70 || sp.rank > 10 ? 0.68 : 0.9;
        return { ...sp, population: Math.max(0, Math.round(sp.population * hit)), stress: clamp(sp.stress + 18) };
      });
      message = `Interferência humana: caça seletiva em ${biomeName}. Predadores e animais grandes despencaram.`;
      break;
    case "pollution":
      target.pollution = clamp(target.pollution + 28);
      target.water = clamp(target.water - 10);
      s = s.map((sp) => {
        if (sp.currentBiome !== biomeId) return sp;
        const sensitive = sp.diet.includes("peix") || sp.diet.includes("anfíb") || sp.name.includes("Sapo") || sp.name.includes("Rã") || sp.name.includes("Krill");
        return sensitive ? { ...sp, population: Math.max(0, Math.round(sp.population * 0.62)), stress: clamp(sp.stress + 28) } : { ...sp, stress: clamp(sp.stress + 8) };
      });
      message = `Interferência humana: poluição em ${biomeName}. Animais aquáticos e anfíbios foram os primeiros afetados.`;
      break;
    case "food":
      target.vegetation = clamp(target.vegetation + 24);
      s = s.map((sp) => sp.currentBiome === biomeId && sp.rank <= 8 ? { ...sp, population: Math.round(sp.population * 1.18 + 4), stress: clamp(sp.stress - 12) } : sp);
      message = `Interferência humana: oferta de comida em ${biomeName}. Herbívoros cresceram, predadores podem vir depois.`;
      break;
    case "reserve":
      target.protection = clamp(target.protection + 28);
      target.human = clamp(target.human - 16);
      target.pollution = clamp(target.pollution - 10);
      target.barrier = clamp(target.barrier - 10);
      s = s.map((sp) => sp.currentBiome === biomeId ? { ...sp, stress: clamp(sp.stress - 12), population: Math.round(sp.population * 1.04 + 1) } : sp);
      message = `Interferência humana positiva: reserva criada em ${biomeName}. Pressão humana caiu.`;
      break;
    case "road":
      target.human = clamp(target.human + 18);
      target.barrier = clamp(target.barrier + 34);
      target.vegetation = clamp(target.vegetation - 12);
      s = s.map((sp) => sp.currentBiome === biomeId ? { ...sp, stress: clamp(sp.stress + (sp.mobility > 70 ? 20 : 10)) } : sp);
      message = `Interferência humana: estrada aberta em ${biomeName}. Migração ficou mais difícil.`;
      break;
    default:
      message = "Nenhuma ação aplicada.";
  }

  return { species: s, biomes: b, log: [message, ...log].slice(0, 10) };
}

function Sparkline({ values }) {
  const points = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * 100},${100 - clamp(v)}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="h-10 w-full overflow-visible">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function EcosystemPixelSimulator() {
  const cols = 32;
  const rows = 22;
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [tick, setTick] = useState(0);
  const [species, setSpecies] = useState(initialSpecies);
  const [biomes, setBiomes] = useState(newBiomeState);
  const [selectedBiome, setSelectedBiome] = useState("floresta");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null);
  const [action, setAction] = useState("drought");
  const [query, setQuery] = useState("");
  const [log, setLog] = useState(["Simulação iniciada. Faça uma pequena alteração e observe o efeito dominó."]);
  const [history, setHistory] = useState({ floresta: [76], savana: [52], tundra: [34], pantanal: [70] });

  useEffect(() => {
    if (!running) return;
    const delay = Math.max(180, 900 - speed * 160);
    const timer = setInterval(() => {
      setSpecies((prevSpecies) => {
        let result;
        setBiomes((prevBiomes) => {
          result = simulateStep(prevSpecies, prevBiomes, tick + 1, log, speed);
          return result.biomes;
        });
        if (result) {
          setLog(result.log);
          setHistory((h) => {
            const next = { ...h };
            Object.keys(BIOMES).forEach((id) => {
              next[id] = [...(h[id] || []), result.biomes[id].vegetation].slice(-24);
            });
            return next;
          });
          return result.species;
        }
        return prevSpecies;
      });
      setTick((t) => t + 1);
    }, delay);
    return () => clearInterval(timer);
  }, [running, speed, tick, log]);

  const biomeSpecies = useMemo(() => {
    return Object.fromEntries(Object.keys(BIOMES).map((id) => [id, species.filter((s) => s.homeBiome === id)]));
  }, [species]);

  const currentSpecies = useMemo(() => {
    return species.find((s) => s.id === selectedSpeciesId) || species.find((s) => s.homeBiome === selectedBiome) || species[0];
  }, [selectedSpeciesId, selectedBiome, species]);

  const visibleSpecies = useMemo(() => {
    const list = biomeSpecies[selectedBiome] || [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) => `${s.name} ${s.diet} ${s.trait} ${FOOD_NAMES[s.rank - 1]}`.toLowerCase().includes(q));
  }, [biomeSpecies, selectedBiome, query]);

  const totals = useMemo(() => {
    const result = {};
    Object.keys(BIOMES).forEach((id) => {
      const current = species.filter((s) => s.currentBiome === id);
      result[id] = {
        population: current.reduce((sum, s) => sum + s.population, 0),
        speciesCount: current.filter((s) => s.population > 0).length,
        migrants: current.filter((s) => s.homeBiome !== id && s.population > 0).length,
      };
    });
    return result;
  }, [species]);

  const animalBlips = useMemo(() => {
    return species
      .filter((s) => s.population > 0)
      .map((s, i) => {
        const area = s.currentBiome;
        const leftHalf = area === "floresta" || area === "tundra";
        const topHalf = area === "floresta" || area === "savana";
        const x0 = leftHalf ? 0 : cols / 2;
        const y0 = topHalf ? 0 : rows / 2;
        const w = cols / 2;
        const h = rows / 2;
        const n1 = seededNoise(i + tick * 0.07, s.rank, s.population);
        const n2 = seededNoise(s.rank, i + tick * 0.05, s.population);
        return {
          ...s,
          px: ((x0 + 1 + n1 * (w - 2)) / cols) * 100,
          py: ((y0 + 1 + n2 * (h - 2)) / rows) * 100,
          size: clamp(8 + s.population / 25 + s.strength / 20, 10, 22),
        };
      });
  }, [species, tick]);

  const cells = useMemo(() => {
    const arr = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const id = biomeAt(x, y, cols, rows);
        const b = biomes[id];
        const noise = seededNoise(x, y, tick * 0.03);
        const veg = b.vegetation / 100;
        const wet = b.water / 100;
        let opacity = 0.55 + noise * 0.25;
        if (veg > noise) opacity += 0.18;
        if (wet > 0.8 && noise > 0.68) opacity += 0.18;
        arr.push({ x, y, id, opacity, noise });
      }
    }
    return arr;
  }, [biomes, tick]);

  function handleApplyAction(biomeId = selectedBiome) {
    const result = applyAction(action, biomeId, species, biomes, log);
    setSpecies(result.species);
    setBiomes(result.biomes);
    setLog(result.log);
    setSelectedBiome(biomeId);
  }

  function resetGame() {
    setRunning(false);
    setTick(0);
    setSpecies(initialSpecies());
    setBiomes(newBiomeState());
    setSelectedBiome("floresta");
    setSelectedSpeciesId(null);
    setLog(["Simulação reiniciada. O ecossistema voltou ao equilíbrio inicial."]);
    setHistory({ floresta: [76], savana: [52], tundra: [34], pantanal: [70] });
  }

  const ecosystemHealth = Math.round(
    Object.values(totals).reduce((sum, t) => sum + t.speciesCount, 0) / SPECIES_DATA.length * 100
  );

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-4 font-mono">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">EcoDominó Pixel</h1>
            <p className="text-sm text-zinc-400">Altere um bioma manualmente e veja clima, comida, migração e cadeias alimentares reagirem sozinhos.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs md:w-[420px]">
            <div className="rounded-xl bg-zinc-800 p-3">
              <div className="text-zinc-400">tempo</div>
              <div className="text-xl font-bold">{tick}</div>
            </div>
            <div className="rounded-xl bg-zinc-800 p-3">
              <div className="text-zinc-400">saúde geral</div>
              <div className="text-xl font-bold">{ecosystemHealth}%</div>
            </div>
            <div className="rounded-xl bg-zinc-800 p-3">
              <div className="text-zinc-400">espécies vivas</div>
              <div className="text-xl font-bold">{species.filter((s) => s.population > 0).length}/80</div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_360px]">
          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl">
            <h2 className="mb-3 text-lg font-bold">Controle humano</h2>
            <div className="space-y-3">
              <label className="block text-xs text-zinc-400">Interferência manual</label>
              <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-sm">
                {Object.entries(ACTIONS).map(([id, a]) => <option key={id} value={id}>{a.name}</option>)}
              </select>
              <p className="rounded-xl bg-zinc-800 p-3 text-xs text-zinc-300">{ACTIONS[action].desc}</p>

              <label className="block text-xs text-zinc-400">Bioma alvo</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(BIOMES).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBiome(b.id)}
                    className={`rounded-xl border p-2 text-left text-xs transition ${selectedBiome === b.id ? "border-white bg-white text-zinc-950" : "border-zinc-700 bg-zinc-950 hover:bg-zinc-800"}`}
                  >
                    <div className="text-lg">{b.emoji}</div>
                    <div className="font-bold">{b.name}</div>
                  </button>
                ))}
              </div>

              <button onClick={() => handleApplyAction()} className="w-full rounded-xl bg-lime-300 px-4 py-3 font-black text-zinc-950 transition hover:scale-[1.02]">
                Aplicar mudança
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setRunning(!running)} className="rounded-xl bg-zinc-100 px-3 py-2 font-bold text-zinc-950">
                  {running ? "Pausar" : "Rodar"}
                </button>
                <button onClick={resetGame} className="rounded-xl border border-zinc-700 px-3 py-2 font-bold text-zinc-100">
                  Reiniciar
                </button>
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Velocidade: {speed}</label>
                <input value={speed} min="1" max="5" type="range" onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-800 pt-4">
              <h3 className="mb-2 text-sm font-bold">Eventos recentes</h3>
              <div className="space-y-2 text-xs text-zinc-300">
                {log.map((item, i) => <div key={`${item}-${i}`} className="rounded-lg bg-zinc-950 p-2 leading-relaxed">{item}</div>)}
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl">
            <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold">Mapa central do ecossistema</h2>
                <p className="text-xs text-zinc-400">Quatro biomas excludentes. Clique em um quadrante para selecionar e aplicar ações.</p>
              </div>
              <div className="rounded-xl bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
                selecionado: <span className="font-bold text-white">{BIOMES[selectedBiome].name}</span>
              </div>
            </div>

            <div className="relative mx-auto aspect-[32/22] max-h-[70vh] w-full overflow-hidden rounded-2xl border-4 border-zinc-950 bg-black shadow-inner" style={{ imageRendering: "pixelated" }}>
              <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
                {cells.map((cell) => {
                  const b = BIOMES[cell.id];
                  const state = biomes[cell.id];
                  const isBorder = cell.x === cols / 2 - 1 || cell.x === cols / 2 || cell.y === rows / 2 - 1 || cell.y === rows / 2;
                  const wetSpot = state.water > 75 && cell.noise > 0.72;
                  const drySpot = state.fireRisk > 65 && cell.noise > 0.7;
                  const bg = drySpot ? "#5a2e19" : wetSpot ? "#175e9c" : b.color;
                  return (
                    <button
                      key={`${cell.x}-${cell.y}`}
                      onClick={() => setSelectedBiome(cell.id)}
                      onDoubleClick={() => handleApplyAction(cell.id)}
                      className="block border border-black/10"
                      style={{ background: bg, opacity: isBorder ? 1 : cell.opacity }}
                      title={`${b.name} — duplo clique aplica ${ACTIONS[action].name}`}
                    />
                  );
                })}
              </div>

              {Object.values(BIOMES).map((b) => {
                const left = b.id === "floresta" || b.id === "tundra" ? "2%" : "52%";
                const top = b.id === "floresta" || b.id === "savana" ? "2%" : "52%";
                return (
                  <div key={b.id} className="pointer-events-none absolute rounded-lg bg-black/50 px-2 py-1 text-xs font-black" style={{ left, top }}>
                    {b.emoji} {b.name}
                  </div>
                );
              })}

              {animalBlips.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setSelectedSpeciesId(a.id); setSelectedBiome(a.homeBiome); }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-black bg-zinc-100 text-[10px] font-black text-zinc-950 shadow-lg transition hover:z-20 hover:scale-125 ${a.migrated ? "ring-2 ring-yellow-300" : ""}`}
                  style={{ left: `${a.px}%`, top: `${a.py}%`, width: a.size + 14, height: a.size + 8, imageRendering: "pixelated" }}
                  title={`${a.name} — população ${a.population}`}
                >
                  {a.icon}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              {Object.entries(BIOMES).map(([id, b]) => {
                const state = biomes[id];
                const t = totals[id];
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedBiome(id)}
                    className={`rounded-2xl border p-3 text-left ${selectedBiome === id ? "border-white bg-zinc-800" : "border-zinc-800 bg-zinc-950"}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">{b.emoji} {b.name}</span>
                      <span className="text-xs text-zinc-400">{climateLabel(state)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>🌿 veg: <b>{Math.round(state.vegetation)}</b></div>
                      <div>💧 água: <b>{Math.round(state.water)}</b></div>
                      <div>🔥 fogo: <b>{Math.round(state.fireRisk)}</b></div>
                      <div>🏭 pol: <b>{Math.round(state.pollution)}</b></div>
                      <div>🐾 pop: <b>{t.population}</b></div>
                      <div>🚶 mig: <b>{t.migrants}</b></div>
                    </div>
                    <div className="mt-2 text-zinc-300"><Sparkline values={history[id] || [state.vegetation]} /></div>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Menu de animais</h2>
                <p className="text-xs text-zinc-400">20 animais por bioma, todos diferentes.</p>
              </div>
              <span className="rounded-lg bg-zinc-950 px-2 py-1 text-xs">{visibleSpecies.length}/20</span>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              {Object.values(BIOMES).map((b) => (
                <button key={b.id} onClick={() => setSelectedBiome(b.id)} className={`rounded-xl px-2 py-2 text-xs font-bold ${selectedBiome === b.id ? "bg-white text-zinc-950" : "bg-zinc-950 text-zinc-300"}`}>
                  {b.emoji} {b.name.split(" ")[0]}
                </button>
              ))}
            </div>

            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="buscar animal, dieta ou característica" className="mb-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-sm outline-none" />

            <div className="max-h-[310px] space-y-2 overflow-auto pr-1">
              {visibleSpecies.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSpeciesId(s.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${currentSpecies?.id === s.id ? "border-lime-300 bg-lime-300 text-zinc-950" : "border-zinc-800 bg-zinc-950 hover:bg-zinc-800"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black">{s.icon} {s.name}</span>
                    <span className="text-xs">#{s.rank}</span>
                  </div>
                  <div className="mt-1 text-xs opacity-80">{FOOD_NAMES[s.rank - 1]}</div>
                </button>
              ))}
            </div>

            {currentSpecies && (
              <div className="mt-4 rounded-2xl border border-zinc-700 bg-zinc-950 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-xl font-black">{currentSpecies.icon} {currentSpecies.name}</h3>
                  <span className={`rounded-lg px-2 py-1 text-xs font-bold ${currentSpecies.population > 0 ? "bg-emerald-300 text-zinc-950" : "bg-red-400 text-zinc-950"}`}>
                    {currentSpecies.population > 0 ? "vivo" : "colapso"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                  <div className="rounded-lg bg-zinc-900 p-2">bioma original<br /><b className="text-white">{BIOMES[currentSpecies.homeBiome].name}</b></div>
                  <div className="rounded-lg bg-zinc-900 p-2">bioma atual<br /><b className="text-white">{BIOMES[currentSpecies.currentBiome].name}</b></div>
                  <div className="rounded-lg bg-zinc-900 p-2">população<br /><b className="text-white">{currentSpecies.population}</b></div>
                  <div className="rounded-lg bg-zinc-900 p-2">estresse<br /><b className="text-white">{Math.round(currentSpecies.stress)}</b></div>
                  <div className="rounded-lg bg-zinc-900 p-2">força<br /><b className="text-white">{currentSpecies.strength}</b></div>
                  <div className="rounded-lg bg-zinc-900 p-2">mobilidade<br /><b className="text-white">{currentSpecies.mobility}</b></div>
                </div>
                <div className="mt-3 space-y-2 text-sm leading-relaxed">
                  <p><b>Dieta:</b> {currentSpecies.diet}</p>
                  <p><b>Função:</b> {currentSpecies.trait}</p>
                  <p><b>Cadeia:</b> #{currentSpecies.rank} — {FOOD_NAMES[currentSpecies.rank - 1]}</p>
                  {currentSpecies.migrated && <p className="rounded-xl bg-yellow-300 p-2 font-bold text-zinc-950">Esta espécie já mudou de bioma e está vivendo fora do padrão original.</p>}
                </div>
              </div>
            )}
          </aside>
        </main>

        <footer className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300">
          <b>Como jogar:</b> escolha uma interferência, escolha um bioma e aplique. A simulação continua sozinha: vegetação cresce ou morre, o clima oscila, predadores perdem presas, herbívoros explodem com comida, espécies migram quando o ambiente fica ruim e barreiras humanas podem impedir a fuga.
        </footer>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';

const BIOMES = {
  floresta: {
    id: 'floresta',
    name: 'Floresta Tropical',
    emoji: '🌳',
    climate: 'quente e úmida',
    color: '#176a3a',
    light: '#38a169',
    initial: { vegetation: 78, water: 82, temp: 64, pollution: 8, fire: 18, human: 15, barrier: 8, protection: 8 }
  },
  savana: {
    id: 'savana',
    name: 'Savana Árida',
    emoji: '🌾',
    climate: 'seca e sazonal',
    color: '#a86f21',
    light: '#d69e2e',
    initial: { vegetation: 52, water: 38, temp: 78, pollution: 6, fire: 42, human: 18, barrier: 12, protection: 6 }
  },
  tundra: {
    id: 'tundra',
    name: 'Tundra Gelada',
    emoji: '❄️',
    climate: 'fria e extrema',
    color: '#81aebd',
    light: '#c9e7ef',
    initial: { vegetation: 34, water: 54, temp: 22, pollution: 4, fire: 8, human: 10, barrier: 6, protection: 16 }
  },
  pantanal: {
    id: 'pantanal',
    name: 'Pantanal Alagado',
    emoji: '💧',
    climate: 'alagado e quente',
    color: '#1a6f78',
    light: '#38b2ac',
    initial: { vegetation: 70, water: 92, temp: 68, pollution: 14, fire: 18, human: 20, barrier: 9, protection: 10 }
  }
};

const ACTIONS = {
  drought: { name: 'Provocar seca', cost: 6, desc: 'derruba água, reduz plantas e força migração' },
  rain: { name: 'Chuva artificial', cost: 10, desc: 'aumenta água, reduz fogo e ajuda vegetação' },
  fire: { name: 'Queimada', cost: 7, desc: 'destrói vegetação e mata espécies lentas' },
  hunting: { name: 'Caça seletiva', cost: 8, desc: 'derruba predadores e animais grandes' },
  pollution: { name: 'Poluição', cost: 9, desc: 'atinge peixes, anfíbios e espécies frágeis' },
  food: { name: 'Oferta de comida', cost: 8, desc: 'aumenta herbívoros e depois atrai predadores' },
  reserve: { name: 'Criar reserva', cost: 16, desc: 'reduz pressão humana e recupera o bioma' },
  road: { name: 'Abrir estrada', cost: 12, desc: 'fragmenta habitat e dificulta migração' }
};

const SCENARIOS = [
  {
    name: 'Fase 1 — Primeiro impacto',
    subtitle: 'Cause pequenas mudanças sem destruir a estabilidade inicial.',
    budget: 65,
    maxTicks: 90,
    objectives: { ecoScore: 60, speciesAlive: 68, protectedBiomes: 1, migrants: 2 },
    fail: { ecoScore: 35, speciesAlive: 45 }
  },
  {
    name: 'Fase 2 — Cadeia alimentar instável',
    subtitle: 'Mantenha predadores, comida, água e vegetação em equilíbrio.',
    budget: 85,
    maxTicks: 130,
    objectives: { ecoScore: 68, topPredators: 20, averageVegetation: 48, maxPollution: 38 },
    fail: { ecoScore: 40, speciesAlive: 50 }
  },
  {
    name: 'Fase 3 — Crise climática total',
    subtitle: 'Proteja vários biomas enquanto clima extremo e migrações aumentam.',
    budget: 105,
    maxTicks: 170,
    objectives: { ecoScore: 75, speciesAlive: 62, minWater: 28, protectedBiomes: 3, maxPollution: 35 },
    fail: { ecoScore: 45, speciesAlive: 55 }
  }
];

const FOOD_CHAIN = [
  'herbívoro de base', 'herbívoro pequeno', 'herbívoro médio', 'herbívoro grande', 'onívoro oportunista',
  'insetívoro', 'frugívoro', 'granívoro', 'filtrador', 'predador pequeno', 'réptil predador',
  'ave predadora', 'mamífero predador', 'mesopredador', 'necrófago', 'superpredador',
  'engenheiro ecológico', 'polinizador/dispersor', 'competidor dominante', 'espécie-chave'
];

const ANIMAL_NAMES = {
  floresta: [
    'Anta', 'Cutia', 'Preguiça', 'Macaco-prego', 'Tucano', 'Arara-vermelha', 'Tamanduá-mirim', 'Sapo-folha', 'Jiboia', 'Gavião-real',
    'Onça-pintada', 'Jaguatirica', 'Quati', 'Irara', 'Coruja-murucututu', 'Morcego-frugívoro', 'Borboleta-azul', 'Formiga-cortadeira', 'Besouro-rinoceronte', 'Macuco'
  ],
  savana: [
    'Elefante-da-savana', 'Zebra', 'Gnu', 'Gazela-de-thomson', 'Girafa', 'Rinoceronte-negro', 'Avestruz', 'Suricato', 'Javali-africano', 'Cão-selvagem-africano',
    'Hiena-malhada', 'Leão', 'Leopardo', 'Chacal', 'Águia-marcial', 'Cobra-cuspideira', 'Lagarto-agama', 'Abutre-de-rüppell', 'Cupim-da-savana', 'Escaravelho'
  ],
  tundra: [
    'Caribu', 'Boi-almiscarado', 'Lebre-ártica', 'Lêmure-da-tundra', 'Esquilo-ártico', 'Ganso-das-neves', 'Coruja-das-neves', 'Raposa-ártica', 'Lobo-ártico', 'Urso-polar',
    'Foca-anelada', 'Morsa', 'Bacalhau-polar', 'Krill-ártico', 'Gaivota-marfim', 'Doninha-ártica', 'Pombo-guillemot', 'Mosquito-ártico', 'Besouro-da-neve', 'Aranha-lobo-ártica'
  ],
  pantanal: [
    'Capivara', 'Cervo-do-pantanal', 'Bugio-preto', 'Ariranha', 'Lontra-neotropical', 'Jacaré-do-pantanal', 'Sucuri-verde', 'Onça-parda', 'Tuiuiú', 'Garça-branca',
    'Colhereiro', 'Piranha-vermelha', 'Dourado', 'Pacu', 'Rã-pimenta', "Cobra-d'água", 'Caramujo-maçã', 'Libélula-verde', 'Caranguejo-do-brejo', 'Urubu-de-cabeça-preta'
  ]
};

const DIETS = [
  'plantas, folhas e brotos', 'sementes e frutos', 'folhas novas', 'frutos, insetos e ovos', 'frutas e pequenos animais',
  'sementes duras e frutas', 'formigas e cupins', 'mosquitos e larvas', 'roedores e aves', 'presas de médio porte',
  'grandes herbívoros', 'roedores, aves e lagartos', 'frutos, ovos e insetos', 'mel e pequenos vertebrados', 'roedores e aves pequenas',
  'frutas e néctar', 'néctar', 'folhas e fungos', 'matéria orgânica morta', 'sementes, frutos e insetos'
];

const TRAITS = [
  'abre caminhos e altera o solo', 'espalha sementes e ajuda regeneração', 'sofre quando a vegetação cai', 'usa inteligência para explorar comida nova',
  'dispersa sementes a longa distância', 'depende de árvores e alimento duro', 'controla insetos sociais', 'é bioindicador de água limpa',
  'controla pequenos vertebrados', 'predador aéreo de topo', 'regula herbívoros grandes', 'caça nas bordas dos biomas',
  'cresce perto de restos humanos', 'explora ninhos e cavidades', 'caça melhor à noite', 'replanta áreas degradadas',
  'poliniza mas é frágil', 'recicla matéria vegetal', 'decompõe restos orgânicos', 'mantém a base da cadeia alimentar'
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function noise(a, b, c = 0) {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return x - Math.floor(x);
}

function createInitialBiomes() {
  return Object.fromEntries(Object.entries(BIOMES).map(([id, biome]) => [id, { ...biome.initial }]));
}

function createSpecies() {
  return Object.entries(ANIMAL_NAMES).flatMap(([biome, names]) => names.map((name, index) => {
    const rank = index + 1;
    const strength = clamp(12 + rank * 3.6 + noise(index, name.length) * 30);
    const mobility = clamp(20 + noise(name.length, index) * 76);
    const flex = clamp(22 + noise(rank, name.length, 4) * 62);
    const repro = clamp(100 - rank * 3.5 + noise(name.length, rank, 6) * 26);
    return {
      id: `${biome}-${index}`,
      name,
      homeBiome: biome,
      currentBiome: biome,
      rank,
      role: FOOD_CHAIN[index],
      diet: DIETS[index],
      trait: TRAITS[index],
      icon: name.split(/[- ']/).map(part => part[0]).join('').slice(0, 2).toUpperCase(),
      strength: Math.round(strength),
      mobility: Math.round(mobility),
      flexibility: Math.round(flex),
      reproduction: Math.round(repro),
      population: Math.round(38 + repro * 0.8 + Math.max(0, 16 - rank) * 2),
      stress: 14,
      migrated: false,
      alive: true
    };
  }));
}

function biomeAtCell(x, y, cols, rows) {
  if (x < cols / 2 && y < rows / 2) return 'floresta';
  if (x >= cols / 2 && y < rows / 2) return 'savana';
  if (x < cols / 2 && y >= rows / 2) return 'tundra';
  return 'pantanal';
}

function neighbors(id) {
  return {
    floresta: ['savana', 'tundra', 'pantanal'],
    savana: ['floresta', 'pantanal', 'tundra'],
    tundra: ['floresta', 'pantanal', 'savana'],
    pantanal: ['savana', 'tundra', 'floresta']
  }[id];
}

function preferredTemp(id) {
  return { floresta: 64, savana: 78, tundra: 22, pantanal: 68 }[id];
}

function suitability(species, biomeId, biome) {
  let score = species.homeBiome === biomeId ? 82 : 42;
  score += (biome.vegetation - 50) * (species.rank <= 8 ? 0.25 : 0.08);
  score += (biome.water - 50) * 0.12;
  score -= Math.abs(biome.temp - preferredTemp(species.homeBiome)) * (1 - species.flexibility / 120);
  score -= biome.pollution * (species.diet.includes('mosquitos') || species.diet.includes('pequenos') ? 0.25 : 0.12);
  if (biomeId === 'pantanal' && /água|pequenos|larvas|peixes/i.test(species.diet)) score += 10;
  if (biomeId === 'savana' && species.mobility > 70) score += 9;
  if (biomeId === 'tundra' && species.flexibility < 35) score -= 12;
  return clamp(score);
}

function climateName(biome) {
  if (biome.fire > 70) return 'risco de fogo';
  if (biome.water < 24) return 'seca severa';
  if (biome.water > 86) return 'cheia';
  if (biome.pollution > 55) return 'poluído';
  if (biome.temp > 80) return 'onda de calor';
  if (biome.temp < 20) return 'frio extremo';
  return 'estável';
}

function applyHumanAction(actionId, biomeId, species, biomes) {
  const nextBiomes = structuredClone(biomes);
  let nextSpecies = species.map(item => ({ ...item }));
  const biome = nextBiomes[biomeId];

  if (actionId === 'drought') {
    biome.water = clamp(biome.water - 28);
    biome.vegetation = clamp(biome.vegetation - 18);
    biome.fire = clamp(biome.fire + 24);
  }
  if (actionId === 'rain') {
    biome.water = clamp(biome.water + 28);
    biome.vegetation = clamp(biome.vegetation + 14);
    biome.fire = clamp(biome.fire - 20);
  }
  if (actionId === 'fire') {
    biome.vegetation = clamp(biome.vegetation - 36);
    biome.fire = clamp(biome.fire + 36);
    nextSpecies = nextSpecies.map(item => item.currentBiome === biomeId
      ? { ...item, population: Math.round(item.population * (item.mobility > 58 ? 0.9 : 0.7)), stress: clamp(item.stress + 24) }
      : item);
  }
  if (actionId === 'hunting') {
    biome.human = clamp(biome.human + 14);
    nextSpecies = nextSpecies.map(item => {
      if (item.currentBiome !== biomeId) return item;
      const hit = item.strength > 70 || item.rank >= 10 ? 0.66 : 0.9;
      return { ...item, population: Math.round(item.population * hit), stress: clamp(item.stress + 18) };
    });
  }
  if (actionId === 'pollution') {
    biome.pollution = clamp(biome.pollution + 30);
    biome.water = clamp(biome.water - 10);
    nextSpecies = nextSpecies.map(item => {
      if (item.currentBiome !== biomeId) return item;
      const sensitive = /larvas|pequenos|néctar|matéria/i.test(item.diet) || item.name.includes('Sapo') || item.name.includes('Rã') || item.name.includes('Krill');
      return sensitive
        ? { ...item, population: Math.round(item.population * 0.62), stress: clamp(item.stress + 28) }
        : { ...item, stress: clamp(item.stress + 8) };
    });
  }
  if (actionId === 'food') {
    biome.vegetation = clamp(biome.vegetation + 24);
    nextSpecies = nextSpecies.map(item => item.currentBiome === biomeId && item.rank <= 8
      ? { ...item, population: Math.round(item.population * 1.18 + 4), stress: clamp(item.stress - 10) }
      : item);
  }
  if (actionId === 'reserve') {
    biome.protection = clamp(biome.protection + 28);
    biome.human = clamp(biome.human - 16);
    biome.pollution = clamp(biome.pollution - 10);
    biome.barrier = clamp(biome.barrier - 10);
    nextSpecies = nextSpecies.map(item => item.currentBiome === biomeId
      ? { ...item, population: Math.round(item.population * 1.04 + 1), stress: clamp(item.stress - 12) }
      : item);
  }
  if (actionId === 'road') {
    biome.human = clamp(biome.human + 18);
    biome.barrier = clamp(biome.barrier + 34);
    biome.vegetation = clamp(biome.vegetation - 12);
    nextSpecies = nextSpecies.map(item => item.currentBiome === biomeId
      ? { ...item, stress: clamp(item.stress + (item.mobility > 70 ? 20 : 10)) }
      : item);
  }

  return { species: nextSpecies, biomes: nextBiomes };
}

function simulate(species, biomes, tick) {
  const nextBiomes = structuredClone(biomes);
  const events = [];

  Object.entries(nextBiomes).forEach(([id, biome]) => {
    const rainPulse = Math.sin(tick / (id === 'pantanal' ? 8 : 11)) * (id === 'pantanal' ? 0.75 : 0.45);
    const heatPulse = Math.sin(tick / 13) * 0.26;
    biome.temp = clamp(biome.temp + heatPulse + (biome.human - biome.protection) * 0.01);
    biome.water = clamp(biome.water + rainPulse - biome.temp * 0.012 - biome.human * 0.01 + biome.protection * 0.018);
    biome.fire = clamp(biome.fire + (biome.temp - 55) * 0.018 - biome.water * 0.014 + biome.human * 0.018);
    biome.pollution = clamp(biome.pollution + biome.human * 0.006 - biome.protection * 0.012);
    biome.vegetation = clamp(biome.vegetation + biome.water * 0.035 + biome.protection * 0.022 - biome.fire * 0.03 - biome.pollution * 0.016);
  });

  if (tick % 19 === 0) {
    const ids = Object.keys(BIOMES);
    const id = ids[tick % ids.length];
    nextBiomes[id].water = clamp(nextBiomes[id].water - 12);
    nextBiomes[id].fire = clamp(nextBiomes[id].fire + 12);
    events.push(`Estação seca atingiu ${BIOMES[id].name}.`);
  }

  if (tick % 29 === 0) {
    const ids = Object.keys(BIOMES);
    const id = ids[(tick + 1) % ids.length];
    nextBiomes[id].water = clamp(nextBiomes[id].water + 14);
    nextBiomes[id].vegetation = clamp(nextBiomes[id].vegetation + 8);
    events.push(`Chuva forte renovou ${BIOMES[id].name}.`);
  }

  const groups = Object.fromEntries(Object.keys(BIOMES).map(id => [id, []]));
  species.forEach(item => groups[item.currentBiome].push(item));

  const nextSpecies = species.map(item => {
    const biome = nextBiomes[item.currentBiome];
    const local = groups[item.currentBiome];
    const preyMass = local
      .filter(other => other.rank < item.rank && other.population > 0)
      .reduce((sum, other) => sum + other.population * 0.025, 0);
    const predatorPressure = local
      .filter(other => other.rank > item.rank && other.strength > item.strength * 0.85 && other.population > 0)
      .reduce((sum, other) => sum + other.population * other.strength * 0.00045, 0);

    const fit = suitability(item, item.currentBiome, biome);
    const food = biome.vegetation * (item.rank <= 8 ? 0.14 : 0.035) + preyMass + biome.water * 0.04;
    const humanDamage = Math.max(0, biome.human - biome.protection) * (item.strength > 70 ? 0.045 : 0.02);
    const pollutionDamage = biome.pollution * (/larvas|pequenos|néctar/i.test(item.diet) ? 0.055 : 0.016);
    const fireDamage = biome.fire > 66 ? (biome.fire - 66) * (item.mobility < 45 ? 0.08 : 0.035) : 0;
    const gain = (food + fit + item.reproduction * 0.2) / 46;
    const loss = humanDamage + pollutionDamage + fireDamage + predatorPressure + Math.max(0, 40 - fit) * 0.04;

    let population = Math.max(0, Math.round(item.population + gain - loss - 0.5 + noise(tick, item.rank, item.population) * 1.6));
    let stress = clamp(item.stress + loss * 1.8 - gain * 0.8 + (item.currentBiome !== item.homeBiome ? 0.45 : -0.2));
    let currentBiome = item.currentBiome;
    let migrated = item.migrated;

    const mustMigrate = stress > 68 || fit < 32 || biome.water < 18 || biome.vegetation < 18;
    const canMigrate = item.mobility > 34 && biome.barrier < 72 && population > 5;
    if (mustMigrate && canMigrate && tick % 4 === item.rank % 4) {
      const best = neighbors(item.currentBiome)
        .map(id => ({ id, score: suitability(item, id, nextBiomes[id]) - nextBiomes[id].barrier * 0.24 }))
        .sort((a, b) => b.score - a.score)[0];
      if (best && best.score > fit + 5) {
        currentBiome = best.id;
        migrated = true;
        stress = clamp(stress - 14);
        population = Math.max(2, Math.round(population * 0.82));
        events.push(`${item.name} migrou para ${BIOMES[currentBiome].name}.`);
      }
    }

    if (population <= 0 && item.alive) events.push(`${item.name} entrou em colapso populacional.`);
    return { ...item, population, stress, currentBiome, migrated, alive: population > 0 };
  });

  return { species: nextSpecies, biomes: nextBiomes, events };
}

function getMetrics(species, biomes) {
  const speciesAlive = species.filter(item => item.population > 0).length;
  const totalPopulation = species.reduce((sum, item) => sum + item.population, 0);
  const migrants = species.filter(item => item.migrated && item.population > 0).length;
  const topPredators = species.filter(item => item.population > 0 && item.strength >= 70).length;
  const averageStress = species.reduce((sum, item) => sum + item.stress, 0) / species.length;
  const averageVegetation = Object.values(biomes).reduce((sum, biome) => sum + biome.vegetation, 0) / 4;
  const averagePollution = Object.values(biomes).reduce((sum, biome) => sum + biome.pollution, 0) / 4;
  const minWater = Math.min(...Object.values(biomes).map(biome => biome.water));
  const protectedBiomes = Object.values(biomes).filter(biome => biome.protection >= 25).length;
  const survival = (speciesAlive / 80) * 100;
  const ecoScore = clamp(Math.round(
    survival * 0.42 +
    averageVegetation * 0.2 +
    (100 - averagePollution) * 0.18 +
    (100 - averageStress) * 0.12 +
    clamp(totalPopulation / 90) * 0.08
  ));
  return { speciesAlive, totalPopulation, migrants, topPredators, averageStress, averageVegetation, averagePollution, minWater, protectedBiomes, ecoScore };
}

function buildObjectives(scenario, metrics) {
  const obj = scenario.objectives;
  const items = [];
  if (obj.ecoScore) items.push({ label: 'Pontuação ecológica', value: metrics.ecoScore, target: obj.ecoScore, suffix: '%', good: metrics.ecoScore >= obj.ecoScore });
  if (obj.speciesAlive) items.push({ label: 'Espécies vivas', value: metrics.speciesAlive, target: obj.speciesAlive, suffix: '/80', good: metrics.speciesAlive >= obj.speciesAlive });
  if (obj.protectedBiomes) items.push({ label: 'Áreas protegidas', value: metrics.protectedBiomes, target: obj.protectedBiomes, suffix: '', good: metrics.protectedBiomes >= obj.protectedBiomes });
  if (obj.migrants) items.push({ label: 'Migração controlada', value: metrics.migrants, target: obj.migrants, suffix: ' espécies', good: metrics.migrants >= obj.migrants });
  if (obj.topPredators) items.push({ label: 'Predadores fortes vivos', value: metrics.topPredators, target: obj.topPredators, suffix: '', good: metrics.topPredators >= obj.topPredators });
  if (obj.averageVegetation) items.push({ label: 'Vegetação média', value: metrics.averageVegetation, target: obj.averageVegetation, suffix: '%', good: metrics.averageVegetation >= obj.averageVegetation });
  if (obj.maxPollution) items.push({ label: 'Poluição média máxima', value: metrics.averagePollution, target: obj.maxPollution, suffix: '%', good: metrics.averagePollution <= obj.maxPollution, inverse: true });
  if (obj.minWater) items.push({ label: 'Água mínima entre biomas', value: metrics.minWater, target: obj.minWater, suffix: '%', good: metrics.minWater >= obj.minWater });
  return items;
}

function progress(item) {
  if (item.inverse) return item.good ? 100 : clamp(100 - ((item.value - item.target) / item.target) * 100);
  return clamp((item.value / item.target) * 100);
}

function Bar({ label, value }) {
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar"><i style={{ width: `${clamp(value)}%` }} /></div>
      <b>{Math.round(value)}</b>
    </div>
  );
}

function App() {
  const cols = 32;
  const rows = 22;
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState(0);
  const [phaseTick, setPhaseTick] = useState(0);
  const [budget, setBudget] = useState(SCENARIOS[0].budget);
  const [biomes, setBiomes] = useState(createInitialBiomes);
  const [species, setSpecies] = useState(createSpecies);
  const [selectedBiome, setSelectedBiome] = useState('floresta');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [action, setAction] = useState('drought');
  const [query, setQuery] = useState('');
  const [log, setLog] = useState(['Simulação iniciada. Escolha uma interferência e observe o efeito dominó.']);

  const scenario = SCENARIOS[phase];
  const metrics = useMemo(() => getMetrics(species, biomes), [species, biomes]);
  const objectives = useMemo(() => buildObjectives(scenario, metrics), [scenario, metrics]);
  const phaseWon = objectives.every(item => item.good);
  const phaseLost = !phaseWon && (phaseTick >= scenario.maxTicks || metrics.ecoScore < scenario.fail.ecoScore || metrics.speciesAlive < scenario.fail.speciesAlive);

  useEffect(() => {
    if (!running || phaseLost) return;
    const timer = setInterval(() => {
      setSpecies(prevSpecies => {
        let result;
        setBiomes(prevBiomes => {
          result = simulate(prevSpecies, prevBiomes, tick + 1);
          return result.biomes;
        });
        if (result?.events.length) setLog(old => [...result.events, ...old].slice(0, 12));
        return result ? result.species : prevSpecies;
      });
      setTick(t => t + 1);
      setPhaseTick(t => t + 1);
    }, Math.max(180, 920 - speed * 150));
    return () => clearInterval(timer);
  }, [running, speed, tick, phaseLost]);

  const animalsInMenu = useMemo(() => {
    const q = query.trim().toLowerCase();
    return species
      .filter(item => item.homeBiome === selectedBiome)
      .filter(item => !q || `${item.name} ${item.role} ${item.diet} ${item.trait}`.toLowerCase().includes(q));
  }, [species, selectedBiome, query]);

  const currentAnimal = selectedAnimal ? species.find(item => item.id === selectedAnimal) : animalsInMenu[0];

  const cells = useMemo(() => {
    const list = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const biomeId = biomeAtCell(x, y, cols, rows);
        const biome = biomes[biomeId];
        const n = noise(x, y, tick * 0.04);
        const border = x === cols / 2 - 1 || x === cols / 2 || y === rows / 2 - 1 || y === rows / 2;
        const wet = biome.water > 78 && n > 0.7;
        const burned = biome.fire > 68 && n > 0.68;
        list.push({ x, y, biomeId, border, wet, burned, opacity: 0.5 + n * 0.35 + biome.vegetation / 450 });
      }
    }
    return list;
  }, [biomes, tick]);

  const blips = useMemo(() => species.filter(item => item.population > 0).map((item, index) => {
    const leftHalf = item.currentBiome === 'floresta' || item.currentBiome === 'tundra';
    const topHalf = item.currentBiome === 'floresta' || item.currentBiome === 'savana';
    const x0 = leftHalf ? 0 : cols / 2;
    const y0 = topHalf ? 0 : rows / 2;
    const nx = noise(index + tick * 0.06, item.rank, item.population);
    const ny = noise(item.rank, index + tick * 0.04, item.population);
    return {
      ...item,
      left: ((x0 + 1 + nx * (cols / 2 - 2)) / cols) * 100,
      top: ((y0 + 1 + ny * (rows / 2 - 2)) / rows) * 100,
      size: clamp(18 + item.population / 55 + item.strength / 18, 20, 38)
    };
  }), [species, tick]);

  function act(targetBiome = selectedBiome) {
    const cost = ACTIONS[action].cost;
    if (budget < cost) {
      setLog(old => [`Orçamento insuficiente para ${ACTIONS[action].name}.`, ...old].slice(0, 12));
      return;
    }
    if (phaseLost) return;
    const result = applyHumanAction(action, targetBiome, species, biomes);
    setSpecies(result.species);
    setBiomes(result.biomes);
    setBudget(value => value - cost);
    setSelectedBiome(targetBiome);
    setLog(old => [`${ACTIONS[action].name} aplicada em ${BIOMES[targetBiome].name}.`, ...old].slice(0, 12));
  }

  function nextPhase() {
    if (!phaseWon) return;
    if (phase >= SCENARIOS.length - 1) {
      setRunning(false);
      setLog(old => ['Campanha concluída. O ecossistema sobreviveu à crise final.', ...old].slice(0, 12));
      return;
    }
    const next = phase + 1;
    setPhase(next);
    setPhaseTick(0);
    setBudget(Math.min(130, SCENARIOS[next].budget + Math.floor(budget * 0.25)));
    setLog(old => [`${SCENARIOS[next].name} iniciada.`, ...old].slice(0, 12));
  }

  function reset() {
    setRunning(false);
    setTick(0);
    setPhase(0);
    setPhaseTick(0);
    setBudget(SCENARIOS[0].budget);
    setBiomes(createInitialBiomes());
    setSpecies(createSpecies());
    setSelectedBiome('floresta');
    setSelectedAnimal(null);
    setAction('drought');
    setQuery('');
    setLog(['Campanha reiniciada.']);
  }

  return (
    <div className="app">
      <header className="hero panel">
        <div>
          <p className="eyebrow">compatível com GitHub Pages · React + Vite · app 100% estático</p>
          <h1>EcoDominó Pixel</h1>
          <p>Um ecossistema pixelado onde clima, comida, migração e interferências humanas mudam a cadeia alimentar progressivamente.</p>
        </div>
        <div className="stats-grid">
          <div><small>fase</small><b>{phase + 1}/{SCENARIOS.length}</b></div>
          <div><small>tempo</small><b>{phaseTick}/{scenario.maxTicks}</b></div>
          <div><small>orçamento</small><b>{budget}</b></div>
          <div><small>pontuação</small><b>{metrics.ecoScore}%</b></div>
          <div><small>espécies</small><b>{metrics.speciesAlive}/80</b></div>
        </div>
      </header>

      <main className="layout">
        <aside className="panel controls">
          <h2>Controle humano</h2>
          <label>Interferência manual</label>
          <select value={action} onChange={event => setAction(event.target.value)}>
            {Object.entries(ACTIONS).map(([id, item]) => <option key={id} value={id}>{item.name} · {item.cost} pts</option>)}
          </select>
          <p className="hint">{ACTIONS[action].desc}</p>

          <label>Bioma alvo</label>
          <div className="biome-buttons">
            {Object.values(BIOMES).map(biome => (
              <button key={biome.id} className={selectedBiome === biome.id ? 'active' : ''} onClick={() => setSelectedBiome(biome.id)}>
                <span>{biome.emoji}</span>{biome.name}
              </button>
            ))}
          </div>

          <button className="primary" disabled={budget < ACTIONS[action].cost || phaseLost} onClick={() => act()}>
            Aplicar mudança
          </button>

          <div className="button-row">
            <button onClick={() => setRunning(value => !value)}>{running ? 'Pausar' : 'Rodar'}</button>
            <button onClick={reset}>Reiniciar</button>
          </div>

          <label>Velocidade: {speed}</label>
          <input type="range" min="1" max="5" value={speed} onChange={event => setSpeed(Number(event.target.value))} />

          <section className="mission">
            <h3>{scenario.name}</h3>
            <p>{scenario.subtitle}</p>
            {objectives.map(item => (
              <div className="objective" key={item.label}>
                <div><span>{item.good ? '✓' : '•'} {item.label}</span><small>{Math.round(item.value)}{item.suffix} / {item.inverse ? 'máx. ' : ''}{item.target}{item.suffix}</small></div>
                <div className="bar"><i style={{ width: `${progress(item)}%` }} /></div>
              </div>
            ))}
            {phaseWon && <button className="phase-button" onClick={nextPhase}>{phase === SCENARIOS.length - 1 ? 'Concluir campanha' : 'Avançar fase'}</button>}
            {phaseLost && <p className="danger">Colapso da fase. Reinicie e tente outra estratégia.</p>}
          </section>

          <section className="log">
            <h3>Eventos</h3>
            {log.map((item, index) => <p key={`${item}-${index}`}>{item}</p>)}
          </section>
        </aside>

        <section className="panel map-panel">
          <div className="section-title">
            <div>
              <h2>Mapa central</h2>
              <p>Quatro biomas excludentes. Clique para selecionar; duplo clique aplica a ação.</p>
            </div>
            <strong>{BIOMES[selectedBiome].emoji} {BIOMES[selectedBiome].name}</strong>
          </div>

          <div className="pixel-map" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
            {cells.map(cell => {
              const biome = BIOMES[cell.biomeId];
              const background = cell.burned ? '#5a2f1d' : cell.wet ? '#125e92' : biome.color;
              return (
                <button
                  key={`${cell.x}-${cell.y}`}
                  onClick={() => setSelectedBiome(cell.biomeId)}
                  onDoubleClick={() => act(cell.biomeId)}
                  style={{ background, opacity: cell.border ? 1 : cell.opacity }}
                  title={`${biome.name}: ${climateName(biomes[cell.biomeId])}`}
                />
              );
            })}
            {Object.values(BIOMES).map(biome => (
              <div key={biome.id} className={`map-label label-${biome.id}`}>{biome.emoji} {biome.name}</div>
            ))}
            {blips.map(item => (
              <button
                key={item.id}
                className={`animal-blip ${item.migrated ? 'migrated' : ''}`}
                onClick={() => { setSelectedAnimal(item.id); setSelectedBiome(item.homeBiome); }}
                style={{ left: `${item.left}%`, top: `${item.top}%`, width: item.size, height: item.size }}
                title={`${item.name}: ${item.population} indivíduos`}
              >
                {item.icon}
              </button>
            ))}
          </div>

          <div className="biome-cards">
            {Object.entries(BIOMES).map(([id, biome]) => {
              const state = biomes[id];
              return (
                <button key={id} className={selectedBiome === id ? 'active card' : 'card'} onClick={() => setSelectedBiome(id)}>
                  <h3>{biome.emoji} {biome.name}</h3>
                  <p>{climateName(state)} · {biome.climate}</p>
                  <Bar label="vegetação" value={state.vegetation} />
                  <Bar label="água" value={state.water} />
                  <Bar label="fogo" value={state.fire} />
                  <Bar label="poluição" value={state.pollution} />
                </button>
              );
            })}
          </div>
        </section>

        <aside className="panel menu">
          <h2>Menu de animais</h2>
          <p className="hint">20 animais únicos por bioma. Cada um reage ao clima, comida, predadores e interferência humana.</p>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="buscar animal, dieta ou característica" />
          <div className="animal-list">
            {animalsInMenu.map(item => (
              <button key={item.id} className={currentAnimal?.id === item.id ? 'active' : ''} onClick={() => setSelectedAnimal(item.id)}>
                <b>{item.icon} {item.name}</b>
                <small>#{item.rank} · {item.role}</small>
              </button>
            ))}
          </div>

          {currentAnimal && (
            <section className="animal-card">
              <h3>{currentAnimal.icon} {currentAnimal.name}</h3>
              <p><b>Bioma original:</b> {BIOMES[currentAnimal.homeBiome].name}</p>
              <p><b>Bioma atual:</b> {BIOMES[currentAnimal.currentBiome].name}</p>
              <p><b>Dieta:</b> {currentAnimal.diet}</p>
              <p><b>Função ecológica:</b> {currentAnimal.trait}</p>
              <p><b>Cadeia alimentar:</b> #{currentAnimal.rank} · {currentAnimal.role}</p>
              <div className="mini-grid">
                <span>população <b>{currentAnimal.population}</b></span>
                <span>força <b>{currentAnimal.strength}</b></span>
                <span>mobilidade <b>{currentAnimal.mobility}</b></span>
                <span>estresse <b>{Math.round(currentAnimal.stress)}</b></span>
              </div>
              {currentAnimal.migrated && <p className="warning">Esta espécie já migrou e vive fora do bioma original.</p>}
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;

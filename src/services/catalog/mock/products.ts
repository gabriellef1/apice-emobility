import { type Product } from '../types'

/**
 * Catálogo demonstrativo com a linha Aima vendida no Brasil.
 *
 * FONTE DAS SPECS: tabela "Especificações" e "Informações Gerais" de cada página
 * em https://aimabrasil.com.br/modelos/<slug>/ (site oficial da Aima Brasil),
 * consultadas em 2026-09-16. Cada produto tem o link no comentário. Quando a
 * página traz dois valores diferentes pra mesma spec (acontece em texto x
 * tabela), fica o da tabela "Informações Gerais" e o conflito é anotado.
 * Spec que o site não informa fica ausente (nunca inventada). Peso do veículo
 * não aparece em nenhuma página, por isso `weight_kg` não existe aqui.
 *
 * PREÇOS: a Aima não publica tabela. Onde há preço, é referência pública de
 * revenda (neonmobilidade.com.br/marca/aima.html, 2026-09-16), NÃO tabela da
 * Ápice; a UI já avisa "valor de referência". Sem referência confiável, fica
 * "sob consulta". Disponibilidade é placeholder até o admin (Fase 4).
 *
 * FOTOS: ilustrativas (ver src/content/images.json), escolhidas pra não
 * contradizer o tipo do modelo. Nenhuma é do produto Aima.
 */
const T = '2026-09-16T12:00:00.000Z'
const BRAND = 'Aima'

function img(productId: string, path: string, alt: string, sortOrder = 0) {
  return {
    id: `${productId}-img-${sortOrder}`,
    product_id: productId,
    path,
    alt,
    sort_order: sortOrder,
  }
}

export const products: readonly Product[] = [
  // https://aimabrasil.com.br/modelos/aima-x6/
  // Tabela: 90 km/h, 85 km (ciclo WMTC), 3000 W (6000 W pico), lítio 60V 29Ah, 6-7 h, 150 kg.
  {
    id: 'aima-x6',
    slug: 'aima-x6',
    brand: BRAND,
    name: 'X6',
    short_description: 'A mais rápida da linha: motor de 3 kW, 90 km/h e faróis Tiger Eye.',
    description:
      'Motor de cubo de 3.000 W (6.000 W de pico) com velocidade máxima de 90 km/h e autonomia de até 85 km no ciclo WMTC. Bateria de íons de lítio 60V 29Ah, recarga em 6 a 7 horas. Freios a disco com CBS, suspensão dianteira hidráulica e pneus 120/70-12. Destrava ao se aproximar e trava ao se afastar; faróis Tiger Eye com até 35 m de alcance.',
    price: null,
    price_on_request: true,
    category: 'moto',
    availability: 'pre_order',
    featured: true,
    active: true,
    sort_order: 10,
    specifications: {
      range_km: 85,
      top_speed_kmh: 90,
      motor_power_w: 3000,
      battery_v: 60,
      battery_ah: 29,
      battery_type: 'Íons de lítio',
      charge_time_h: 6.5,
      max_load_kg: 150,
    },
    images: [
      img(
        'aima-x6',
        'moto-sport-rider',
        'Scooter elétrica esportiva com piloto (foto ilustrativa)',
      ),
      img('aima-x6', 'detail-dash', 'Painel e guidão de scooter elétrica (foto ilustrativa)', 1),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-a7/
  // Tabela "Informações Gerais": 80 km/h, 130 km, lítio 72V 52Ah, 6-7 h, 150 kg.
  // Conflito: o bloco de destaques da mesma página diz 70 km/h e 90 km; fica a tabela.
  {
    id: 'aima-a7',
    slug: 'aima-a7',
    brand: BRAND,
    name: 'A7',
    short_description: 'Scooter premium com bateria de 72V 52Ah e a maior autonomia da linha.',
    description:
      'Também conhecida como Maverick. Motor de 2.000 W (3.078 W de pico), até 80 km/h e autonomia de até 130 km por carga com a bateria de lítio 72V 52Ah, que recarrega em 6 a 7 horas. Freios a disco dianteiro e traseiro, suspensão hidráulica, display LCD Bafang e pneus 120/70-12. Design premiado, disponível em quatro cores.',
    price: null,
    price_on_request: true,
    category: 'moto',
    availability: 'pre_order',
    featured: true,
    active: true,
    sort_order: 20,
    specifications: {
      range_km: 130,
      top_speed_kmh: 80,
      motor_power_w: 2000,
      battery_v: 72,
      battery_ah: 52,
      battery_type: 'Íons de lítio',
      charge_time_h: 6.5,
      max_load_kg: 150,
    },
    images: [
      img(
        'aima-a7',
        'moto-sport-charging',
        'Scooter elétrica esportiva carregando (foto ilustrativa)',
      ),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-ts5/  (Tiger S5)
  // Tabela: 55 km/h, 55 km, 2000 W (2500 W pico), lítio 76V 20Ah, 4-5 h, 150 kg. Motor Bosch.
  {
    id: 'aima-tiger-s5',
    slug: 'aima-tiger-s5',
    brand: BRAND,
    name: 'Tiger S5',
    short_description:
      'Ciclomotor com motor Bosch de 2 kW, três modos de pilotagem e recarga em 4 a 5 h.',
    description:
      'Motor Bosch de 2.000 W (2.500 W de pico) desenvolvido em parceria com a Aima, velocidade máxima de 55 km/h e autonomia de até 55 km. Bateria de lítio 76V 20Ah com recarga em 4 a 5 horas, a mais rápida da linha. Modos Eco, Comfort e Power, painel LED, freios a disco nos dois eixos e pneus reforçados que rodam até 20 km após um furo.',
    // Referência de revenda (Neon Mobilidade, 2026-09): R$ 13.990.
    price: 1399000,
    price_on_request: false,
    category: 'moto',
    availability: 'in_stock',
    featured: true,
    active: true,
    sort_order: 30,
    specifications: {
      range_km: 55,
      top_speed_kmh: 55,
      motor_power_w: 2000,
      battery_v: 76,
      battery_ah: 20,
      battery_type: 'Íons de lítio',
      charge_time_h: 4.5,
      max_load_kg: 150,
    },
    images: [img('aima-tiger-s5', 'moto-night', 'Ciclomotor elétrico à noite (foto ilustrativa)')],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-liberty/
  // Tabela: 32 km/h, 80 km, 1000 W, lítio 64V 30Ah, 7-8 h, 150 kg. Vem com baú e protetor de carenagem.
  {
    id: 'aima-liberty',
    slug: 'aima-liberty',
    brand: BRAND,
    name: 'Liberty',
    short_description:
      'Scooter de 32 km/h com 80 km de autonomia, baú e freios a disco nos dois eixos.',
    description:
      'Bateria de lítio 64V 30Ah com autonomia de até 80 km e recarga em 7 a 8 horas. Motor de 1.000 W, velocidade máxima de 32 km/h, painel e farol em LED, rodas de alumínio e freios a disco dianteiro e traseiro. Sai de fábrica com baú e protetor de carenagem.',
    // Referência de revenda (Neon Mobilidade, 2026-09): R$ 11.990.
    price: 1199000,
    price_on_request: false,
    category: 'scooter',
    availability: 'in_stock',
    featured: true,
    active: true,
    sort_order: 40,
    specifications: {
      range_km: 80,
      top_speed_kmh: 32,
      motor_power_w: 1000,
      battery_v: 64,
      battery_ah: 30,
      battery_type: 'Lítio',
      charge_time_h: 7.5,
      max_load_kg: 150,
    },
    images: [
      img('aima-liberty', 'scooter-topbox', 'Scooter elétrica com baú traseiro (foto ilustrativa)'),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/q5-dimoon/
  // Tabela: 32 km/h, 75 km, motor AIMA HUB 1000 W, lítio 64V 30Ah, 5-6 h, 150 kg.
  {
    id: 'aima-q5-dimoon',
    slug: 'aima-q5-dimoon',
    brand: BRAND,
    name: 'Q5 Dimoon',
    short_description:
      'Scooter retrô com farol circular em LED, suspensão hidráulica e 75 km de autonomia.',
    description:
      'Motor AIMA HUB de 1.000 W, velocidade de até 32 km/h e autonomia de até 75 km com a bateria de lítio 64V 30Ah, recarregada em 5 a 6 horas. Suspensão hidráulica, freio a disco dianteiro e tambor traseiro, painel e farol em LED. Linhas inspiradas nas scooters clássicas.',
    // Referência de revenda (Neon Mobilidade, 2026-09): R$ 11.990.
    price: 1199000,
    price_on_request: false,
    category: 'scooter',
    availability: 'in_stock',
    featured: true,
    active: true,
    sort_order: 50,
    specifications: {
      range_km: 75,
      top_speed_kmh: 32,
      motor_power_w: 1000,
      battery_v: 64,
      battery_ah: 30,
      battery_type: 'Íons de lítio',
      charge_time_h: 5.5,
      max_load_kg: 150,
    },
    images: [
      img('aima-q5-dimoon', 'scooter-retro-black', 'Scooter retrô preta (foto ilustrativa)'),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-bliss/  (Luna Bliss)
  // Tabela: 32 km/h, 60 km, 800 W (1000 W pico), íons de lítio 24Ah (tensão não informada), 7-8 h, 150 kg.
  {
    id: 'aima-bliss',
    slug: 'aima-bliss',
    brand: BRAND,
    name: 'Bliss',
    short_description: 'Scooter de estilo retrô com motor de 800 W e rodas a vácuo 3.0-10.',
    description:
      'Também chamada de Luna Bliss. Motor de 800 W (1.000 W de pico), velocidade máxima de 32 km/h e autonomia de até 60 km com bateria de íons de lítio de 24Ah, recarregada em 7 a 8 horas. Rodas a vácuo 3.0-10, freio a disco dianteiro e de cubo traseiro, display LCD Bafang e assento espaçoso.',
    // Referência de revenda (Neon Mobilidade, 2026-09): R$ 9.990.
    price: 999000,
    price_on_request: false,
    category: 'scooter',
    availability: 'in_stock',
    featured: false,
    active: true,
    sort_order: 60,
    specifications: {
      range_km: 60,
      top_speed_kmh: 32,
      motor_power_w: 800,
      battery_ah: 24,
      battery_type: 'Íons de lítio',
      charge_time_h: 7.5,
      max_load_kg: 150,
    },
    images: [img('aima-bliss', 'scooter-retro-red', 'Scooter retrô vermelha (foto ilustrativa)')],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/klitio-pro/  (Klitio Pro, também "Aima GO")
  // Tabela: 32 km/h, 70 km, motor AIMA HUB 1000 W (2000 W pico), lítio 48V 24Ah, 7-8 h, 150 kg.
  {
    id: 'aima-klitio-pro',
    slug: 'aima-klitio-pro',
    brand: BRAND,
    name: 'Klitio Pro',
    short_description:
      'Scooter compacta com motor de 1 kW, 70 km de autonomia e iluminação em LED.',
    description:
      'Também chamada de Aima GO. Motor AIMA HUB de 1.000 W nominais (2.000 W de pico), 32 km/h e autonomia de até 70 km com a bateria de lítio 48V 24Ah, recarregada em 7 a 8 horas em tomada convencional. Freio a disco dianteiro e tambor traseiro, painel digital e iluminação em LED. Entre-eixos de 1.110 mm.',
    // Referência de revenda (Neon Mobilidade, 2026-09, listada como "Kuyan Litio Pro"): R$ 8.990.
    price: 899000,
    price_on_request: false,
    category: 'scooter',
    availability: 'in_stock',
    featured: false,
    active: true,
    sort_order: 70,
    specifications: {
      range_km: 70,
      top_speed_kmh: 32,
      motor_power_w: 1000,
      battery_v: 48,
      battery_ah: 24,
      battery_type: 'Lítio',
      charge_time_h: 7.5,
      max_load_kg: 150,
    },
    images: [
      img('aima-klitio-pro', 'scooter-green', 'Scooter elétrica compacta (foto ilustrativa)'),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-kmay/  (K-May)
  // Tabela: 32 km/h, 70 km, 600 W (1850 W pico), bateria de grafeno 60V 22Ah, 7-8 h, 150 kg. Autopropelida.
  {
    id: 'aima-kmay',
    slug: 'aima-kmay',
    brand: BRAND,
    name: 'K-May',
    short_description: 'Scooter autopropelida leve, com bateria de grafeno e 70 km de autonomia.',
    description:
      'Scooter autopropelida com motor de 600 W (1.850 W de pico), 32 km/h e autonomia de até 70 km com a bateria de grafeno 60V 22Ah, recarregada em 7 a 8 horas. Freios de tambor, suspensão mecânica, display LCD Bafang e pneus 2.75-10. Estrutura compacta pra guardar e manobrar com facilidade.',
    // Referência de revenda (Neon Mobilidade, 2026-09): R$ 7.990.
    price: 799000,
    price_on_request: false,
    category: 'scooter',
    availability: 'in_stock',
    featured: false,
    active: true,
    sort_order: 80,
    specifications: {
      range_km: 70,
      top_speed_kmh: 32,
      motor_power_w: 600,
      battery_v: 60,
      battery_ah: 22,
      battery_type: 'Grafeno',
      charge_time_h: 7.5,
      max_load_kg: 150,
    },
    images: [img('aima-kmay', 'scooter-blue-moped', 'Ciclomotor elétrico azul (foto ilustrativa)')],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-e390/  (Harmony E390)
  // Tabela "Informações Gerais": 32 km/h, 65 km, lítio 48V 24Ah removível, 8-9 h, 150 kg; motor Bosch 400 W (840 W pico).
  // Conflito: o bloco de destaques diz 50 km; fica a tabela. Preço: fontes públicas divergem muito (R$ 5.000 a 11.600), então sob consulta.
  {
    id: 'aima-e390',
    slug: 'aima-e390',
    brand: BRAND,
    name: 'E390',
    short_description: 'Autopropelida compacta com motor Bosch de 400 W e bateria removível.',
    description:
      'Também chamada de Harmony E390. Veículo autopropelido com motor Bosch de 400 W (840 W de pico), 32 km/h e autonomia de até 65 km. Bateria de lítio removível 48V 24Ah, recarga em 8 a 9 horas: carrega à noite e sai pronta de manhã. Freio a disco dianteiro e de cubo traseiro, suspensão hidráulica, display LCD Bafang, pneus a vácuo 2.75-10.',
    price: null,
    price_on_request: true,
    category: 'scooter',
    availability: 'in_stock',
    featured: false,
    active: true,
    sort_order: 90,
    specifications: {
      range_km: 65,
      top_speed_kmh: 32,
      motor_power_w: 400,
      battery_v: 48,
      battery_ah: 24,
      battery_type: 'Lítio (removível)',
      charge_time_h: 8.5,
      max_load_kg: 150,
    },
    images: [
      img(
        'aima-e390',
        'scooter-small-white',
        'Scooter elétrica compacta branca (foto ilustrativa)',
      ),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-kuyan-litio/
  // Tabela: 32 km/h, 50 km, motor Bosch 500 W (1050 W pico), lítio 48V 24Ah removível, 7-8 h, 150 kg. Autopropelida.
  {
    id: 'aima-kuyan-litio',
    slug: 'aima-kuyan-litio',
    brand: BRAND,
    name: 'Kuyan Litio',
    short_description:
      'Autopropelida com motor Bosch de 500 W, bateria removível e baixo custo por km.',
    description:
      'Veículo autopropelido com motor Bosch de 500 W (1.050 W de pico), velocidade de 32 km/h e autonomia de até 50 km. Bateria de lítio removível 48V 24Ah com recarga completa em 7 a 8 horas. Freio a disco dianteiro e de cubo traseiro, suspensão mecânica, display LCD Bafang, pneus 2.75-10.',
    // Referência de revenda (Neon Mobilidade, 2026-09): R$ 6.990.
    price: 699000,
    price_on_request: false,
    category: 'scooter',
    availability: 'in_stock',
    featured: false,
    active: true,
    sort_order: 100,
    specifications: {
      range_km: 50,
      top_speed_kmh: 32,
      motor_power_w: 500,
      battery_v: 48,
      battery_ah: 24,
      battery_type: 'Lítio (removível)',
      charge_time_h: 7.5,
      max_load_kg: 150,
    },
    images: [
      img(
        'aima-kuyan-litio',
        'scooter-small-wall',
        'Scooter elétrica compacta clara (foto ilustrativa)',
      ),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-mini-kuyan/
  // Tabela: 25 km/h, 40 km, 350 W (707 W pico), chumbo-ácido 48V 12Ah removível, 7-8 h, 100 kg.
  {
    id: 'aima-mini-kuyan',
    slug: 'aima-mini-kuyan',
    brand: BRAND,
    name: 'Mini Kuyan',
    short_description: 'A menor da linha: leve, dobrável, bateria removível e 40 km de autonomia.',
    description:
      'Scooter compacta e dobrável com motor de 350 W (707 W de pico), velocidade máxima de 25 km/h e autonomia de até 40 km. Bateria de chumbo-ácido removível 48V 12Ah, recarga em 7 a 8 horas em qualquer tomada. Freios de cubo, suspensão mecânica, display LCD Bafang, pneus 14" x 2,125.',
    // Referência de revenda (Neon Mobilidade, 2026-09, listada como "Kuyan Mini"): R$ 5.990.
    price: 599000,
    price_on_request: false,
    category: 'scooter',
    availability: 'sold_out',
    featured: false,
    active: true,
    sort_order: 110,
    specifications: {
      range_km: 40,
      top_speed_kmh: 25,
      motor_power_w: 350,
      battery_v: 48,
      battery_ah: 12,
      battery_type: 'Chumbo-ácido (removível)',
      charge_time_h: 7.5,
      max_load_kg: 100,
    },
    images: [
      img(
        'aima-mini-kuyan',
        'scooter-mini-pair',
        'Scooters elétricas compactas (foto ilustrativa)',
      ),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/santa-monica/
  // Tabela: até 32 km/h, até 96 km, motor Bafang 750 W (1200 W pico), lítio 48V 15Ah (células LG 21700), 5 h.
  {
    id: 'aima-santa-monica',
    slug: 'aima-santa-monica',
    brand: BRAND,
    name: 'Santa Monica',
    short_description:
      'Bike elétrica de estilo clássico com sensor de torque e freios hidráulicos Tektro.',
    description:
      'Motor Bafang de 750 W no cubo traseiro (1.200 W de pico), assistência até 32 km/h e autonomia de até 96 km. Bateria de lítio 48V 15Ah com células LG 21700, recarga em 5 horas. Sensor de torque, freios a disco hidráulicos Tektro com rotores de 203 mm, suspensão dianteira com trava e display TFT Bafang.',
    price: null,
    price_on_request: true,
    category: 'ebike',
    availability: 'pre_order',
    featured: false,
    active: true,
    sort_order: 120,
    specifications: {
      range_km: 96,
      top_speed_kmh: 32,
      motor_power_w: 750,
      battery_v: 48,
      battery_ah: 15,
      battery_type: 'Lítio (LG 21700)',
      charge_time_h: 5,
    },
    images: [
      img('aima-santa-monica', 'ebike-cruiser', 'Bicicleta elétrica cruiser (foto ilustrativa)'),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/big-sur-sport/
  // Tabela: até 32 km/h, 96 km, motor Bafang 750 W (1200 W pico), lítio (LG 21700; tensão/Ah não informadas), 5 h. Pneus 26" x 4.0".
  {
    id: 'aima-big-sur-sport',
    slug: 'aima-big-sur-sport',
    brand: BRAND,
    name: 'Big Sur Sport',
    short_description: 'Bike elétrica de pneus largos 26" x 4.0" pra cidade e trilha leve.',
    description:
      'Motor Bafang de 750 W no cubo traseiro (1.200 W de pico), assistência até 32 km/h e autonomia de até 96 km com bateria de lítio de células LG 21700, recarregada em 5 horas. Pneus 26" x 4.0", sensor de torque, freios a disco hidráulicos de 203 mm, display TFT Bafang e certificação UL2849.',
    // Referência de revenda (Neon Mobilidade, 2026-09): R$ 11.990.
    price: 1199000,
    price_on_request: false,
    category: 'ebike',
    availability: 'in_stock',
    featured: false,
    active: true,
    sort_order: 130,
    specifications: {
      range_km: 96,
      top_speed_kmh: 32,
      motor_power_w: 750,
      battery_type: 'Lítio (LG 21700)',
      charge_time_h: 5,
    },
    images: [
      img(
        'aima-big-sur-sport',
        'ebike-road',
        'Bicicleta elétrica de pneus largos (foto ilustrativa)',
      ),
    ],
    created_at: T,
    updated_at: T,
  },
  // https://aimabrasil.com.br/modelos/aima-mike/  (triciclo, 3 pessoas)
  // Registro INATIVO de propósito: prova que produto despublicado nunca vaza pro catálogo.
  // Tabela: 32 km/h, 60 km, 650 W (1600 W pico), 6-7 h. Bateria: tabela diz lítio 60V 24Ah, texto diz chumbo 60V 20Ah; sem foto de triciclo, fica fora.
  {
    id: 'aima-mike',
    slug: 'aima-mike',
    brand: BRAND,
    name: 'Mike',
    short_description: 'Triciclo elétrico pra até três pessoas, com marcha à ré.',
    description:
      'Triciclo elétrico com motor de 650 W (1.600 W de pico), 32 km/h, autonomia de até 60 km e recarga em 6 a 7 horas. Três níveis de velocidade, marcha à ré, faróis de LED, setas e retrovisores.',
    price: null,
    price_on_request: true,
    category: 'triciclo',
    availability: 'pre_order',
    featured: false,
    active: false,
    sort_order: 140,
    specifications: {
      range_km: 60,
      top_speed_kmh: 32,
      motor_power_w: 650,
      charge_time_h: 6.5,
    },
    images: [img('aima-mike', 'ride-street', 'Scooter em rua da cidade (foto ilustrativa)')],
    created_at: T,
    updated_at: T,
  },
]

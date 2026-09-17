export interface NakuruLocationPreset {
  id: string;
  name: string;
  subCounty: string;
  latitude: number;
  longitude: number;
  nominalElevation: number;
  description: string;
  predominantFarming: string;
}

export const ELMENTEITA_PRESETS: NakuruLocationPreset[] = [
  {
    id: 'elmenteita-basin',
    name: 'Elmenteita Lake Basin / Kasambara',
    subCounty: 'Gilgil / Nakuru Sub-County',
    latitude: -0.4485,
    longitude: 36.2415,
    nominalElevation: 1785,
    description: 'Rift Valley floor volcanic silt loams, mild thermal lake influence, mixed maize and bean smallholdings.',
    predominantFarming: 'Maize (H614D), Bush Beans, Horticulture'
  },
  {
    id: 'kariandusi-escarpment',
    name: 'Kariandusi / Elementaita Escarpment',
    subCounty: 'Gilgil Sub-County',
    latitude: -0.4578,
    longitude: 36.2780,
    nominalElevation: 1940,
    description: 'Higher eastern escarpment overlooking Lake Elmenteita. Rich diatomite volcanic ash soils, cooler night temperatures.',
    predominantFarming: 'Irish Potatoes (Shangi), Pyrethrum, Maize'
  },
  {
    id: 'soysambu-border',
    name: 'Soysambu Conservancy Margin',
    subCounty: 'Rongai / Gilgil Border',
    latitude: -0.4120,
    longitude: 36.2150,
    nominalElevation: 1810,
    description: 'Deep fertile volcanic silt with high organic matter, excellent for rotational legume systems.',
    predominantFarming: 'Maize, Beans (Rosecoco), Fodder Grasses'
  },
  {
    id: 'mbaruk-railway',
    name: 'Mbaruk Agricultural Zone',
    subCounty: 'Gilgil Sub-County',
    latitude: -0.4350,
    longitude: 36.2620,
    nominalElevation: 1860,
    description: 'Mid-elevation volcanic plateau, good drainage, transitional agro-ecological zone UM3/UM4.',
    predominantFarming: 'Maize, Potatoes, Beans, Commercial Tomatoes'
  },
  {
    id: 'dundori-ridge',
    name: 'Dundori / Elmenteita Upper Slopes',
    subCounty: 'Nakuru North Sub-County',
    latitude: -0.3850,
    longitude: 36.3100,
    nominalElevation: 2120,
    description: 'High altitude moist ridge, cool misty microclimate ideal for pyrethrum flower flushes and seed potatoes.',
    predominantFarming: 'Pyrethrum Clones P4, Irish Potatoes, Dairy'
  }
];

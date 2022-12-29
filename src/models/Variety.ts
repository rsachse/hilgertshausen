export enum Species {
  Apple = 'apple',
  Pear = 'pear',
  Plum = 'plum',
  Cherry = 'cherry',
  Nut = 'nut',
  Medlar = 'medlar',
  Quit = 'quit',
}
export interface Variety {
  id: number;
  name: string;
  species: Species | 'unknown' | 'dead';
  ready_to_pick: string | undefined;
  ready_to_eat: string | undefined;
  usage: string;
  taste: string;
  storability: string;
  allergy_info: string;
  urls: string[];
}

import _data from '@/data/Obstsorten.json';
import { Species, type Variety } from '@/models/Variety';

interface ImportData {
  Art: string;
  id: number;
  Sorte: string;
  Pflueckreife: string | null;
  Genussreife: string | null;
  Verwendung: string;
  Geschmack: string;
  Lagerfaehigkeit: string;
  Allergiker: string;
  urls: string[];
}

const _converted_data: ImportData[] = _data;

_converted_data.sort((a, b) => {
  // sort by Art if Art differs
  if (a.Art !== b.Art) return a.Art.localeCompare(b.Art);

  // put 'unbestimmt' at last
  if (a.id % 100 === 99) return 1;
  if (b.id % 100 === 99) return -1;

  // sort by name otherwise
  return a.Sorte.localeCompare(b.Sorte);
});

const toSpecies = function (art: string): Species | 'unknown' | 'dead' {
  switch (art) {
    case 'Apfel':
      return Species.Apple;
    case 'Birne':
      return Species.Pear;
    case 'Zwetschge':
      return Species.Plum;
    case 'Kirsche':
      return Species.Cherry;
    case 'Nuss':
      return Species.Nut;
    case 'Mispel':
      return Species.Medlar;
    case 'Quitte':
      return Species.Quit;
    case 'Tod':
      return 'dead';
    default:
      return 'unknown';
  }
};

export const ALL_VARIETIES: Map<number, Variety> = new Map(
  _converted_data.map((x) => [
    x.id,
    {
      id: x.id,
      name: x.Sorte,
      species: toSpecies(x.Art),
      ready_to_pick: x.Pflueckreife === null ? undefined : x.Pflueckreife,
      ready_to_eat: x.Genussreife === null ? undefined : x.Genussreife,
      usage: x.Verwendung,
      taste: x.Geschmack,
      storability: x.Lagerfaehigkeit,
      allergy_info: x.Allergiker,
      urls: x.urls,
    },
  ]),
);
export const VARIETIES_BY_SPECIES: Map<Species, Variety[]> = new Map();
for (const variety of ALL_VARIETIES.values()) {
  if (variety.species === 'dead' || variety.species === 'unknown') continue;
  if (VARIETIES_BY_SPECIES.has(variety.species) === false) {
    VARIETIES_BY_SPECIES.set(variety.species, []);
  }
  VARIETIES_BY_SPECIES.get(variety.species)?.push(variety);
}

export const getVarietyById = function (
  varietyId: number | string | undefined,
): Variety | undefined {
  if (varietyId === undefined) return undefined;

  return ALL_VARIETIES.get(
    typeof varietyId === 'string' ? Number.parseInt(varietyId, 10) : varietyId,
  );
};

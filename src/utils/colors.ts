import { Species } from '@/models/Variety';
import { ALL_TREES } from '@/utils/trees';
import { getVarietyById } from '@/utils/varieties';

export const getSpeciesColor = function (species: Species | 'unknown' | 'dead'): string {
  switch (species) {
    case 'unknown':
      return 'grey';
    case 'dead':
      return 'grey';
    case Species.Apple:
      return 'red';
    case Species.Pear:
      return 'light-green';
    case Species.Plum:
      return 'deep-purple';
    case Species.Cherry:
      return 'red-13';
    case Species.Nut:
      return 'brown';
    case Species.Medlar:
      return 'deep-orange-10';
    case Species.Quit:
      return 'orange-10';
  }
};

export const getSpeciesColorByTreeId = function (treeId: number): string {
  const tree = ALL_TREES.get(treeId);
  if (tree === undefined) return '';
  const species = getVarietyById(tree.properties.variety_id)?.species;
  if (species === undefined) return '';
  return getSpeciesColor(species);
};

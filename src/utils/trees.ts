import type { Feature, FeatureCollection } from 'geojson';

import _data from '@/data/Baeume.json';
import _images from '@/data/TreeImages.json';
import type { Tree, Geometry } from '@/models/Tree';

interface ImportProperties {
  Baum_Nr: number;
  Wiesen_Nr: number;
  Sorten_id: number;
  Schnitt: string | null;
  Duengung: string | null;
  D_noetig: boolean | null;
  Zustand: string;
}

interface ImportCollection extends FeatureCollection<Geometry, ImportProperties> {}
interface ImportData extends Feature<Geometry, ImportProperties> {}

const _converted_data: ImportData[] = (_data as ImportCollection).features;
const images: Map<string, string[]> = new Map(Object.entries(_images));

_converted_data.sort((a, b) => a.properties.Baum_Nr - b.properties.Baum_Nr);

const parseDate = function (input: string | null): Date | undefined {
  if (input === null) return undefined;
  const [year, month, day] = input.split('/');
  return new Date(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
};

export const ALL_TREES: Map<number, Tree> = new Map(
  _converted_data.map((x) => [
    x.properties.Baum_Nr,
    {
      ...x,
      properties: {
        id: x.properties.Baum_Nr,
        variety_id: x.properties.Sorten_id,
        orchard_id: x.properties.Wiesen_Nr,
        last_fertilization: parseDate(x.properties.Duengung),
        needs_fertilization: x.properties.D_noetig === null ? undefined : x.properties.D_noetig,
        last_cut: parseDate(x.properties.Schnitt),
        state: x.properties.Zustand,
      },
    },
  ]),
);
export const BY_ORCHARD: Map<number, Tree[]> = new Map();
export const BY_VARIETY: Map<number, Tree[]> = new Map();

for (const tree of ALL_TREES.values()) {
  if (BY_ORCHARD.has(tree.properties.orchard_id) === false) {
    BY_ORCHARD.set(tree.properties.orchard_id, []);
  }
  BY_ORCHARD.get(tree.properties.orchard_id)?.push(tree);

  if (BY_VARIETY.has(tree.properties.variety_id) === false) {
    BY_VARIETY.set(tree.properties.variety_id, []);
  }
  BY_VARIETY.get(tree.properties.variety_id)?.push(tree);
}

export const getTreeImages = function (treeId: number | string | undefined): string[] {
  console.log('foo', treeId);
  if (treeId === undefined) return [];
  const urls = images.get(typeof treeId === 'string' ? treeId : treeId.toString());
  console.log(urls);
  return urls === undefined ? [] : urls;
};

export const getTreesByOrchardId = function (orchardId: number | string | undefined): Tree[] {
  if (orchardId === undefined) return [];

  const trees = BY_ORCHARD.get(
    typeof orchardId === 'string' ? Number.parseInt(orchardId, 10) : orchardId,
  );
  return trees === undefined ? [] : trees;
};

export const getTreesByVarietyId = function (varietyId: number | string | undefined): Tree[] {
  if (varietyId === undefined) return [];

  const trees = BY_VARIETY.get(
    typeof varietyId === 'string' ? Number.parseInt(varietyId, 10) : varietyId,
  );
  return trees === undefined ? [] : trees;
};

import type { Feature, FeatureCollection } from 'geojson';

import _data from '@/data/Streuobstwiesen.json';
import type { Orchard, Geometry } from '@/models/Orchard';

interface ImportProperties {
  id: number;
  Ort: string;
}

interface ImportCollection extends FeatureCollection<Geometry, ImportProperties> {}
interface ImportData extends Feature<Geometry, ImportProperties> {}

const _converted_data: ImportData[] = (_data as ImportCollection).features;

_converted_data.sort((a, b) => a.properties.Ort.localeCompare(b.properties.Ort));

export const ALL_ORCHARDS: Map<number, Orchard> = new Map(
  _converted_data.map((x) => [
    x.properties.id,
    {
      ...x,
      properties: {
        id: x.properties.id,
        name: x.properties.Ort,
      },
    },
  ]),
);

export const getOrchardById = function (
  orchardId: number | string | undefined,
): Orchard | undefined {
  if (orchardId === undefined) return undefined;

  return ALL_ORCHARDS.get(
    typeof orchardId === 'string' ? Number.parseInt(orchardId, 10) : orchardId,
  );
};

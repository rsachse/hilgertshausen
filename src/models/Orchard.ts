import type { Feature, MultiPolygon } from 'geojson';

export interface Properties {
  id: number;
  name: string;
}

export type { MultiPolygon as Geometry } from 'geojson';

export interface Orchard extends Feature<MultiPolygon, Properties> {}

import type { Feature, Point } from 'geojson';

export interface Properties {
  id: number;
  variety_id: number;
  orchard_id: number;
  state: string;
  last_fertilization: Date | undefined;
  needs_fertilization: boolean | undefined;
  last_cut: Date | undefined;
}

export type { Point as Geometry } from 'geojson';

export interface Tree extends Feature<Point, Properties> {}

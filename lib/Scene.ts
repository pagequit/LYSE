import { type Renderable } from "./Renderable.ts";
import { type Viewport } from "./Viewport.ts";

export type Scene = {
  viewport: Viewport;
  layers: Array<Array<Renderable>>;
};

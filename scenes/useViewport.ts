import { type Viewport } from "../lib/Viewport.ts";

// TODO: make the dimensions configurable
const viewport: Viewport = {
  width: 1200,
  height: 780,
};

const viewOffset = {
  x:
    window.innerWidth < viewport.width
      ? 0
      : (viewport.width - window.innerWidth) * 0.5,
  y:
    window.innerHeight < viewport.height
      ? 0
      : (viewport.height - window.innerHeight) * 0.5,
};

export function useViewport() {
  return {
    viewport,
    viewOffset,
  };
}

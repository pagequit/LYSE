const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export function useCanvas() {
  return {
    canvas,
    ctx,
  };
}

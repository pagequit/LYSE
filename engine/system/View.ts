const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function resize(): void {
  canvas.width = self.innerWidth;
  canvas.height = self.innerHeight;
  ctx.imageSmoothingEnabled = false;
}

export function useCanvas() {
  document.body.appendChild(canvas);

  self.addEventListener("resize", resize);
  resize();

  return { canvas, ctx };
}

export type Grid = {
  tileSize: number;
  width: number;
  height: number;
  x: number;
  y: number;
};

export const grid = setup(64);

function setup(tileSize: number): Grid {
  self.addEventListener("resize", () => {
    grid.x = self.innerWidth / tileSize;
    grid.y = self.innerHeight / tileSize;
  });

  return {
    tileSize,
    width: self.innerWidth,
    height: self.innerHeight,
    x: self.innerWidth / tileSize,
    y: self.innerHeight / tileSize,
  };
}

export function renderGrid(grid: Grid, ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < grid.x; i++) {
    for (let j = 0; j < grid.y; j++) {
      ctx.fillStyle = i % 2 === j % 2 ? "transparent" : "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(
        i * grid.tileSize,
        j * grid.tileSize,
        grid.tileSize,
        grid.tileSize,
      );
    }
  }
}

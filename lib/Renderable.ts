export type Renderable = {
  render: (ctx: CanvasRenderingContext2D) => void;
};

export function render(this: Renderable, ctx: CanvasRenderingContext2D): void {
  this.render.call(this, ctx);
}

export function createRenderable<T extends object>(
  entity: T,
  render: Renderable["render"],
): T & Renderable {
  return {
    ...entity,
    render,
  };
}

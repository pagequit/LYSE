export const monoitor = document.createElement("div");
monoitor.style.position = "absolute";
monoitor.style.top = "0";
monoitor.style.left = "0";
monoitor.style.fontSize = "12px";
monoitor.style.color = "#fff";
monoitor.style.fontFamily = "monospace";
monoitor.style.padding = "10px";
monoitor.style.background = "rgba(0, 0, 0, 0.5)";

export function applyMonitor(): void {
  document.body.appendChild(monoitor);
}

export const monitor = document.createElement("div");
monitor.style.position = "absolute";
monitor.style.top = "0";
monitor.style.left = "0";
monitor.style.fontSize = "12px";
monitor.style.color = "#fff";
monitor.style.fontFamily = "monospace";
monitor.style.padding = "10px";
monitor.style.background = "rgba(0, 0, 0, 0.5)";

export function adoptMonitor(): void {
  document.body.appendChild(monitor);
}

export function removeMonitor(): void {
  document.body.removeChild(monitor);
}

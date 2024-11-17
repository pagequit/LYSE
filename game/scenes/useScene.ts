import { type Component, ref } from "vue";

type Scenes = Map<string, Component>;
const scenes: Scenes = new Map();
const currentScene = ref<string>("");

function setScene(name: string, scene: Component): Scenes {
  return scenes.set(name, scene);
}

function getScene(name: string): Component | undefined {
  return scenes.get(name);
}

function swapScene(name: string): void {
  currentScene.value = name;
}

export function useScene() {
  return {
    setScene,
    getScene,
    swapScene,
    currentScene,
  };
}

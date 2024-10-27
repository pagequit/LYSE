<script setup lang="ts">
import MainMenu from "./scenes/MainMenu.vue";
import NodesMenu from "./scenes/NodesMenu.vue";
import { useScene } from "./scenes/useScene.ts";

const { setScene, getScene, swapScene, currentScene } = useScene();
setScene("MainMenu", MainMenu);
setScene("NodesMenu", NodesMenu);
swapScene("NodesMenu");
</script>

<template>
  <nav>
    <button @click="swapScene('MainMenu')">MainMenu</button>
    <button @click="swapScene('NodesMenu')">NodesMenu</button>
  </nav>

  <component :is="getScene(currentScene)"></component>
</template>

<style>
nav {
  position: absolute;
  top: 0;
  display: flex;
  gap: 1rem;
  margin: 1rem;
}
</style>

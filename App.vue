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
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: 2px solid whitesmoke;
  border-radius: 0;
  background-color: slateblue;
  color: whitesmoke;
  text-shadow: 2px 2px black;
  font-family: "magofonts";
  font-size: 1.5rem;
}
</style>

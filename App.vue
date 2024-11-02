<script setup lang="ts">
import MainMenu from "./scenes/MainMenu.vue";
import NodesMenu from "./scenes/NodesMenu.vue";
import WorldMap from "./scenes/WorldMap.vue";
import { useScene } from "./scenes/useScene.ts";

const { setScene, getScene, swapScene, currentScene } = useScene();

setScene("MainMenu", MainMenu);
setScene("NodesMenu", NodesMenu);
setScene("WorldMap", WorldMap);
swapScene("NodesMenu");
</script>

<template>
  <nav>
    <button
      @click="swapScene('MainMenu')"
      :class="currentScene === 'MainMenu' && 'active'"
    >
      MainMenu
    </button>
    <button
      @click="swapScene('NodesMenu')"
      :class="currentScene === 'NodesMenu' && 'active'"
    >
      NodesMenu
    </button>
    <button
      @click="swapScene('WorldMap')"
      :class="currentScene === 'WorldMap' && 'active'"
    >
      WorldMap
    </button>
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

.active {
  background-color: whitesmoke;
  color: slateblue;
  text-shadow: 1px 1px black;
  border: 2px solid slateblue;
}

button {
  padding: 0.5rem 1rem;
  border: 2px solid whitesmoke;
  border-radius: 0;
  background-color: slateblue;
  color: whitesmoke;
  text-shadow: 1px 1px black;
  font-family: "magofonts";
  font-size: 1.5rem;
}
</style>

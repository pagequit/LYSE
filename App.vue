<script setup lang="ts">
import MainMenu from "./scenes/MainMenu.vue";
import NodesMenu from "./scenes/NodesMenu.vue";
import SceneEditor from "./scenes/SceneEditor.vue";
import GameTest from "./scenes/GameTest.vue";
import { useScene } from "./scenes/useScene.ts";

const { setScene, getScene, swapScene, currentScene } = useScene();

setScene("MainMenu", MainMenu);
setScene("NodesMenu", NodesMenu);
setScene("SceneEditor", SceneEditor);
setScene("GameTest", GameTest);
swapScene("SceneEditor");
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
      @click="swapScene('SceneEditor')"
      :class="currentScene === 'SceneEditor' && 'active'"
    >
      SceneEditor
    </button>
    <button
      @click="swapScene('GameTest')"
      :class="currentScene === 'GameTest' && 'active'"
    >
      GameTest
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

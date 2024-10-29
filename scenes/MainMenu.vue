<script setup lang="ts">
import { useScene } from "./useScene.ts";

const { swapScene } = useScene();
</script>

<template>
  <div class="container">
    <div>
      <h1>MainMenu</h1>
      <button @click="swapScene('NodesMenu')">Back</button>
    </div>
  </div>
</template>

<style>
@font-face {
  font-family: "magofonts";
  src: url("/magofonts/mago1.ttf");
}

h1 {
  color: whitesmoke;
  text-shadow: 2px 2px black;
  font-family: "magofonts";
  font-size: 1.5rem;
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

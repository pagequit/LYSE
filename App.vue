<script setup lang="ts">
import NodesMenu from "./scenes/NodesMenu.vue";

let scene = NodesMenu;
</script>

<template>
  <component :is="scene"></component>
</template>

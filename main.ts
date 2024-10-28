import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.provide("state", {
  isPointerDown: false,
  isDragging: false,
});
app.mount("#app");

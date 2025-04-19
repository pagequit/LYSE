import { render } from "solid-js/web";
import RangeSlider from "./game/gui/menu/RangeSlider.tsx";
import { startGame } from "./engine/stateful/Game.ts";
import { mount } from "./game/gui/menu/menu.ts";
// import scene from "./game/scenes/gridScene.ts";
import scene from "./game/scenes/testScene.ts";
// import scene from "./game/scenes/nodeScene.ts";

mount();
startGame(scene);

render(() => {
  return (
    <RangeSlider name="volume" min={0} max={1} step={0.1} value={1}>
      <span>Volume</span>
    </RangeSlider>
  );
}, document.body);

/*
0 	3 / A
1 	4 / B
2 	1 / X
3 	2 / Y
4 	L1
5 	R1
6 	L2
7 	R3
8 	Select
9 	Start
10	L3
11	R3
12	Up
13	Down
14	Left
15	Right
*/
let gamepad: Gamepad | null = null;

export function useGamepad(
  onGamepadConnected: (event: GamepadEvent) => void,
  onGamepadDisconnected: (event: GamepadEvent) => void,
) {
  window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
    gamepad = event.gamepad;
    onGamepadConnected(event);
  });

  window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
    gamepad = window.navigator.getGamepads()[0];
    onGamepadDisconnected(event);
  });

  return gamepad;
}

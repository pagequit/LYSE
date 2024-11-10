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

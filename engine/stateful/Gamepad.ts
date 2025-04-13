export const gamepad = {
  value: null as Gamepad | null,
};

function onGamepadConnected(event: GamepadEvent) {
  gamepad.value = event.gamepad;
}

export function useGamepad() {
  self.addEventListener("gamepadconnected", onGamepadConnected);

  return {
    processGamepad() {
      if (gamepad.value === null) {
        return;
      }
    },
  };
}

/*
gamepad standard mapping
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

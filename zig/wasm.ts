import init from "./main.wasm?init";

const { exports } = await init({
  env: {
    print: (result: number) => {
      console.log(`The result is ${result}`);
    },
  },
});

export const wasm = exports as {
  add: (a: number, b: number) => number;
};

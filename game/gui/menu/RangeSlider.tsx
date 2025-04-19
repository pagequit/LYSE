import { type JSX } from "solid-js";

export default function RangeSlider(props: {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  children: JSX.Element;
}) {
  return (
    <label for={props.name}>
      {props.children}
      <input
        type="range"
        name={props.name}
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
      />
    </label>
  );
}

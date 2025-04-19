import { type JSX } from "solid-js";

export default function RangeSlider(props: {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  children: JSX.Element;
  onChange?: (value: number) => void;
  onInput?: (value: number) => void;
}) {
  return (
    <label class="range-slider">
      {props.children}
      <input
        type="range"
        name={props.name}
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) =>
          props.onChange && props.onChange(e.target.valueAsNumber)
        }
        onInput={(e) => props.onInput && props.onInput(e.target.valueAsNumber)}
      />
    </label>
  );
}

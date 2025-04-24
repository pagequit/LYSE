import { render } from "solid-js/web";
import { createEffect, createSignal, Match, Show, Switch } from "solid-js";
import RangeSlider from "./RangeSlider.tsx";
import { game, scaleViewport } from "../../engine/stateful/Game.ts";
import {
  connectAudioPlayer,
  enqueueAudioFromUrl,
  setGain,
  togglePausePlay,
} from "../../engine/lib/AudioPlayer.ts";
import {
  MaximizeIcon,
  MinimizeIcon,
  FloppyIcon,
  VolumeIcon,
  VideoIcon,
  VolumeOffIcon,
  VolumeMuteIcon,
  VolumeLowIcon,
} from "./icons.tsx";

const [scale, setScale] = createSignal(1);
const [volume, setVolume] = createSignal(1);
const [pause, setPause] = createSignal(true);
const [fullscreen, setFullscreen] = createSignal(false);

export function mount(
  element: Element | Document | ShadowRoot | DocumentFragment | Node,
): void {
  render(() => {
    createEffect(() => {
      scaleViewport(scale());
    });

    createEffect(() => {
      setGain(game.BGMPlayer, volume());
    });

    enqueueAudioFromUrl(game.BGMPlayer, "/bgm.wav").then(() => {
      connectAudioPlayer(game.BGMPlayer, game.BGMPlayer.queue[0]);
      game.BGMPlayer.source.loop = true;
    });

    return <SettingsMenu />;
  }, element);
}

export default function SettingsMenu() {
  return (
    <div class="settings-menu">
      <button
        class="icon-button"
        onclick={() => {
          setFullscreen(!fullscreen());

          if (document.fullscreenElement && document.exitFullscreen) {
            return document.exitFullscreen();
          }

          document.body.requestFullscreen();
        }}
      >
        <Show when={fullscreen()} fallback={<MaximizeIcon />}>
          <MinimizeIcon />
        </Show>
        <span>Fullscreen</span>
      </button>

      <button class="icon-button">
        <FloppyIcon />
        <span>Save</span>
      </button>

      <RangeSlider
        name="volume"
        min={0}
        max={1}
        step={0.1}
        value={1}
        onInput={setVolume}
      >
        <span
          role="button"
          onclick={() => {
            setPause(!pause());
            togglePausePlay(game.BGMPlayer);
          }}
        >
          <Show when={!pause()} fallback={<VolumeOffIcon />}>
            <Switch fallback={<VolumeIcon />}>
              <Match when={volume() === 0}>
                <VolumeMuteIcon />
              </Match>
              <Match when={volume() < 0.5}>
                <VolumeLowIcon />
              </Match>
            </Switch>
          </Show>
        </span>
      </RangeSlider>

      <RangeSlider
        name="scale"
        min={0.5}
        max={1.5}
        step={0.1}
        value={1}
        onChange={setScale}
      >
        <VideoIcon />
      </RangeSlider>
    </div>
  );
}

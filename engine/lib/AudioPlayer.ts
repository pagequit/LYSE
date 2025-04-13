export type AudioPlayer = {
  ctx: AudioContext;
  source: AudioBufferSourceNode;
  queue: Array<AudioBuffer>;
  isPaused: boolean;
};

export function createAudioPlayer(): AudioPlayer {
  const audioContext = new AudioContext();

  return {
    ctx: audioContext,
    source: audioContext.createBufferSource(),
    queue: [],
    isPaused: false,
  };
}

export async function enqueueAudioFromUrl(
  audioPlayer: AudioPlayer,
  url: string,
): Promise<void> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioPlayer.queue.push(await audioPlayer.ctx.decodeAudioData(arrayBuffer));
}

export function connectAudioPlayer(
  audioPlayer: AudioPlayer,
  audioBuffer: AudioBuffer,
): void {
  audioPlayer.source.buffer = audioBuffer;
  audioPlayer.source.connect(audioPlayer.ctx.destination);
}

export async function togglePausePlay(audioPlayer: AudioPlayer): Promise<void> {
  switch (audioPlayer.ctx.state) {
    case "suspended": {
      if (audioPlayer.isPaused) {
        await audioPlayer.ctx.resume();
        audioPlayer.isPaused = false;
      } else {
        audioPlayer.source.start();
        audioPlayer.isPaused = false;
      }
      break;
    }
    case "running": {
      if (!audioPlayer.isPaused) {
        await audioPlayer.ctx.suspend();
        audioPlayer.isPaused = true;
      }
      break;
    }
    default: {
      break;
    }
  }
}

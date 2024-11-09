<script setup lang="ts">
type Action = () => void;

type Stack = {
  size: number;
  actions: Array<Action>;
};

type Card = {
  title: string;
  action: Action;
};

type Player = {
  hand: Array<Card>;
  deck: Array<Card>;
  stack: Stack;
};

type Game = {
  player: Player;
  opponent: Player;
};

const game: Game = {
  player: {
    hand: [
      {
        title: "Attack",
        action: () => {
          console.log("attack");
        },
      },
      {
        title: "Defend",
        action: () => {
          console.log("defend");
        },
      },
      {
        title: "Heal",
        action: () => {
          console.log("heal");
        },
      },
    ],
    deck: [],
    stack: {
      size: 8,
      actions: [],
    },
  },
  opponent: {
    hand: [],
    deck: [],
    stack: {
      size: 4,
      actions: [],
    },
  },
};

function focusCard(event: MouseEvent) {
  event.preventDefault();
  (event.target as HTMLElement).classList.toggle("focused");
}

function drag(event: DragEvent) {
  event.dataTransfer!.setData("card", String(event.target));
}

function drop(event: DragEvent) {
  console.log(event.dataTransfer!.getData("card"));
}

function allowDrop(event: DragEvent) {
  event.preventDefault();
}
</script>

<template>
  <div class="container game-test">
    <div class="game-test-board" @dragover="allowDrop" @drop="drop"></div>
    <ul class="player-hand">
      <li
        class="card"
        @click.right="focusCard"
        @dragstart="drag"
        draggable="true"
        v-for="(card, index) in game.player.hand"
        :key="index"
      >
        <div class="card-title">{{ card.title }}</div>
      </li>
    </ul>
  </div>
</template>

<style>
.game-test {
  flex-flow: column nowrap;

  .game-test-board {
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid whitesmoke;
    border-radius: 8px;
    flex: 1 1 auto;
    width: 100%;
  }

  .player-hand {
    display: flex;
    flex-flow: row nowrap;
    gap: 8px;
    justify-content: space-between;
    align-items: flex-end;
    list-style: none;
    margin: 0;
    padding: 8px;
    flex: 0 1 auto;
  }

  .card {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    border: 1px solid whitesmoke;
    border-radius: 8px;
    padding: 8px;
    width: 120px;
    height: 160px;
    color: whitesmoke;
    transition: all 144ms ease-out;

    &:hover {
      transition: all 144ms ease-out;
      transform: scale(1.1) translateY(-8px);
    }

    &.focused {
      transition: all 144ms ease-out;
      transform: none;
      width: 180px;
      height: 240px;
    }
  }
}
</style>

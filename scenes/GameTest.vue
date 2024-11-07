<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

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
</script>

<template>
  <div class="container game-test">
    <ul
      class="player-hand"
      v-for="(card, index) in game.player.hand"
      :key="index"
    >
      <li class="card">
        <div class="card-title">{{ card.title }}</div>
      </li>
    </ul>
  </div>
</template>

<style>
.game-test {
  .player-hand {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .card {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    border: 1px solid whitesmoke;
    border-radius: 0.5rem;
    padding: 0.5rem;
    width: 8rem;
    height: 12rem;
    color: whitesmoke;
  }
}
</style>

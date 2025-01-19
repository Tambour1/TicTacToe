<script>
import { getUserIdentity } from "../../services/AuthProvider";
import { getGame, playMove } from "../../services/httpClient";
import Cell from "./Cell.vue";

export default {
  name: "Game",
  props: ["gameId"],
  components: { Cell },
  data() {
    return {
      gameState: null,
      board: Array(3)
        .fill(null)
        .map(() => Array(3).fill(null)),
      currentPlayer: null,
      winner: null,
      error: null,
      userId: null,
      polling: null,
      playerNames: {
        player1: null,
        player2: null,
      },
    };
  },
  methods: {
    async fetchGameState() {
      try {
        const game = await getGame(this.gameId);
        if (game) {
          this.gameState = game.status;
          this.board = this.formatBoard(game.board);
          this.currentPlayer = game.currentPlayer;
          const user = getUserIdentity();
          this.userId = user.id;

          this.playerNames.player1 = game.player1;
          this.playerNames.player2 = game.player2 || "En attente d’un joueur 2";

          if (game.status === "finished") {
            this.winner =
              game.winner === this.playerNames.player1
                ? "Joueur 1"
                : game.winner === this.playerNames.player2
                  ? "Joueur 2"
                  : null;
          } else if (game.status === "draw") {
            this.winner = "draw";
          }
        }
      } catch (error) {
        console.error("Erreur fetchGameState:", error);
        this.error =
          "Erreur lors de la récupération des informations de la partie";
      }
    },

    formatBoard(flatBoard) {
      return [
        [flatBoard[0], flatBoard[1], flatBoard[2]],
        [flatBoard[3], flatBoard[4], flatBoard[5]],
        [flatBoard[6], flatBoard[7], flatBoard[8]],
      ];
    },

    startPolling() {
      if (this.polling) return;
      this.polling = setInterval(this.fetchGameState, 1000);
    },

    stopPolling() {
      if (this.polling) {
        clearInterval(this.polling);
        this.polling = null;
      }
    },

    async playMove(row, col) {
      try {
        await this.fetchGameState();
        await playMove(this.gameId, row, col);
      } catch (error) {
        this.error = "Erreur lors de l’envoi de votre mouvement.";
      }
    },

    getCellClass(cellValue) {
      if (cellValue === this.playerNames.player1) {
        return "player1-cell";
      } else if (cellValue === this.playerNames.player2) {
        return "player2-cell";
      }
      return "";
    },
  },
  async created() {
    await this.fetchGameState();
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
};
</script>

<template>
  <div class="game">
    <h1>Partie {{ gameId }}</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <p>{{ "User actuel de la session " + userId }}</p>
    <p>{{ "currentPlayer " + currentPlayer }}</p>

    <div v-if="gameState">
      <!-- Afficher les joueurs -->
      <div class="players">
        <p>Joueur 1 : {{ playerNames.player1 }}</p>
        <p>Joueur 2 : {{ playerNames.player2 }}</p>
      </div>

      <!-- Plateau de jeu -->
      <div v-if="winner === null">
        <div class="board">
          <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
            <Cell
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :is-disabled="!!cell || currentPlayer !== userId"
              :class="getCellClass(cell)"
              @click="playMove(rowIndex, colIndex)"
            />
          </div>
        </div>
        <p v-if="gameState !== 'finished'">
          C'est au tour de
          {{ currentPlayer === userId ? "vous" : "l’adversaire" }} de jouer.
        </p>

        <p v-if="gameState === 'waiting'">
          En attente d’un autre joueur pour commencer...
        </p>
      </div>

      <!-- Résultats -->
      <div v-else>
        <p v-if="winner === 'draw'">Match nul !</p>
        <p v-else>Victoire de {{ winner }} !</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cell {
  width: 60px;
  height: 60px;
  font-size: 24px;
  border: 1px solid #000;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}

.cell.disabled {
  cursor: not-allowed;
}

.error {
  color: red;
}

.players {
  margin-bottom: 20px;
}
</style>

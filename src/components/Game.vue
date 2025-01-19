<script>
import { getUserIdentity } from "../../services/AuthProvider";
import { getGame, playMove, getUser } from "../../services/httpClient";
import Cell from "./Cell.vue";

export default {
  name: "Game",
  props: {
    gameId: {
      type: String,
      required: true,
    },
  },
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
      players: {
        player1: null,
        player2: null,
      },
    };
  },
  methods: {
    // Méthode pour récupérer les informations de la partie
    async fetchGameState() {
      try {
        const game = await getGame(this.gameId);
        if (game) {
          this.gameState = game.status;
          this.board = this.formatBoard(game.board);
          this.currentPlayer = game.currentPlayer;

          const user = getUserIdentity();
          this.userId = user.id;

          const player1 = await getUser(game.player1);
          this.playerNames.player1 = player1.username;
          this.players.player1 = game.player1;

          const player2 = game.player2 ? await getUser(game.player2) : null;
          this.players.player2 = game.player2;
          this.playerNames.player2 = player2
            ? player2.username
            : "En attente d’un joueur 2";

          if (game.status === "finished") {
            if (game.winner === this.players.player1) {
              this.winner = this.playerNames.player1;
            } else if (game.winner === this.players.player2) {
              this.winner = this.playerNames.player2;
            } else {
              this.winner = "draw";
            }
          } else if (game.status === "draw") {
            this.winner = "draw";
          }
        }
      } catch (error) {
        this.error = "Impossible de récupérer les informations de la partie.";
      }
    },

    // Méthode pour formater le plateau de jeu
    formatBoard(flatBoard) {
      return [
        [flatBoard[0], flatBoard[1], flatBoard[2]],
        [flatBoard[3], flatBoard[4], flatBoard[5]],
        [flatBoard[6], flatBoard[7], flatBoard[8]],
      ];
    },

    // Méthode pour démarrer le polling
    startPolling() {
      if (this.polling) return;
      this.polling = setInterval(this.fetchGameState, 1000);
    },

    // Méthode pour arrêter le polling
    stopPolling() {
      if (this.polling) {
        clearInterval(this.polling);
        this.polling = null;
      }
    },

    // Méthode pour jouer un coup
    async playMove(row, col) {
      await this.fetchGameState();
      await playMove(this.gameId, row, col);
    },

    // Méthode pour définir la couleur de la cellule
    setCellColor(cellValue) {
      return {
        "player1-cell": cellValue === this.players.player1,
        "player2-cell": cellValue === this.players.player2,
      };
    },

    // Méthode pour rediriger vers le dashboard une fois la partie terminée
    backDashboard() {
      setTimeout(() => {
        this.$router.push("/");
      }, 3000);
    },
  },

  watch: {
    winner(newValue) {
      if (newValue === "draw" || this.gameState === "finished") {
        this.backDashboard();
      }
    },
    gameState(newValue) {
      if (newValue === "finished" && this.winner !== null) {
        this.backDashboard();
      }
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
  <div
    class="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-8"
  >
    <div class="bg-white w-full max-w-xl p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-semibold text-center mb-6">
        Partie {{ gameId }}
      </h1>

      <!-- erreurs -->
      <div v-if="error" class="text-red-600 text-center mb-4">
        {{ error }}
      </div>

      <div v-if="gameState !== 'finished'">
        <!-- Les joueurs -->
        <div
          v-if="winner !== 'draw'"
          class="flex justify-around mb-6 text-center"
        >
          <p class="text-lg text-gray-800 font-medium">
            Joueur 1 : {{ playerNames.player1 }}
          </p>
          <p class="text-lg text-gray-800 font-medium">
            Joueur 2 : {{ playerNames.player2 }}
          </p>
        </div>

        <!-- Plateau de jeu -->
        <div v-if="winner === null">
          <div
            v-for="(row, rowIndex) in board"
            :key="rowIndex"
            class="flex justify-center"
          >
            <Cell
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :is-disabled="!!cell || currentPlayer !== userId"
              :class="setCellColor(cell)"
              @click="playMove(rowIndex, colIndex)"
            />
          </div>
        </div>

        <!--  Les tours -->
        <p v-if="winner !== 'draw'" class="text-center text-xl mt-4">
          C'est au tour de
          <span class="font-bold">{{
            currentPlayer === userId ? "vous" : "l’adversaire"
          }}</span>
        </p>

        <!--  En attente -->
        <p
          v-if="gameState === 'waiting'"
          class="text-center text-lg text-gray-500 mt-4"
        >
          En attente d’un autre joueur pour commencer...
        </p>
      </div>

      <!--  Fin de partie -->
      <p
        v-if="winner === 'draw'"
        class="text-xl text-center font-semibold text-gray-700"
      >
        Match nul !
      </p>
      <p
        v-if="gameState === 'finished'"
        class="text-xl text-center font-semibold text-gray-700"
      >
        Victoire de <span>{{ winner }}</span> !
      </p>
    </div>
  </div>
</template>
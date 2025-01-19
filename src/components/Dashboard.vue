<script>
import {
  getGames,
  createGame,
  joinGame,
  deleteGame,
} from "../../services/httpClient";
import { getUserIdentity } from "../../services/AuthProvider";

export default {
  name: "Dashboard",
  data() {
    return {
      games: [],
      error: null,
      successMessage: null,
      user: null,
    };
  },
  methods: {
    async fetchGames() {
      try {
        const games = await getGames();
        this.games = games || [];
      } catch (error) {
        this.error = "Erreur lors de la récupération des parties.";
      }
    },

    async createNewGame() {
      try {
        await createGame();
        this.successMessage = "Partie créée avec succès !";
        this.fetchGames();
      } catch (error) {
        this.error = "Erreur lors de la création de la partie.";
      }
    },

    async joinGame(gameId) {
      try {
        const game = this.games.find((g) => g.id === gameId);

        if (game && game.player1 === this.user.id) {
          this.error = "Vous êtes déjà le créateur de cette partie.";
          return;
        }

        await joinGame(gameId);
        this.successMessage = "Vous avez rejoint la partie avec succès !";
        this.fetchGames();
      } catch (error) {
        this.error = "Erreur lors de la jonction à la partie.";
      }
    },

    async deleteGame(gameId) {
      try {
        await deleteGame(gameId);
        this.successMessage = "Partie supprimée avec succès !";
        this.fetchGames();
      } catch (error) {
        this.error = "Erreur lors de la suppression de la partie.";
      }
    },
  },
  mounted() {
    this.user = getUserIdentity();
    this.fetchGames();
  },
};
</script>
<template>
  <div class="dashboard">
    <h1>Dashboard - Mes Parties</h1>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>

    <button @click="createNewGame">Créer une nouvelle partie</button>

    <div v-if="games.length === 0">Aucune partie disponible</div>

    <ul>
      <li v-for="game in games" :key="game.id">
        <div>
          <span
            >{{ game.status }} - {{ game.player1 }} vs
            {{ game.player2 || "N/A" }}</span
          >
          <button @click="joinGame(game.id)" v-if="game.status === 'waiting'">
            <RouterLink :to="{ name: 'Game', params: { gameId: game.id } }"
              >Rejoindre</RouterLink
            >
          </button>
          <button @click="deleteGame(game.id)" v-if="game.creator === user.id">
            Supprimer
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
.success {
  color: green;
}
</style>

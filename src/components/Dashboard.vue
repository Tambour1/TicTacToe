<script>
import { getGames, createGame, joinGame, deleteGame, getUser} from "../../services/httpClient";
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
    // Méthode pour récupérer les parties
    async fetchGames() {
      try {
        const games = await getGames();
        this.games = games || [];

        for (const game of this.games) {
          await this.fetchUsernames(game);
        }
      } catch (error) {
        this.error = "Impossible de récupérer les parties.";
      }
    },

    // Méthode pour récupérer les noms d'utilisateurs
    async fetchUsernames(game) {
      try {
        const player1 = await getUser(game.player1);
        const player2 = game.player2 ? await getUser(game.player2) : null;

        game.username1 = player1.username;
        game.username2 = player2 ? player2.username : "N/A";
      } catch (error) {
        this.error = "Impossible de récupérer les noms d'utilisateurs.";
      }
    },

    // Méthode pour créer une nouvelle partie
    async createNewGame() {
      try {
        await createGame();
        this.successMessage = "Partie créée avec succès !";
        this.fetchGames();
      } catch (error) {
        this.error = "Impossible de créer une nouvelle partie.";
      }
    },

    // Méthode pour rejoindre une partie
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
        this.error = "Impossible de rejoindre la partie.";
      }
    },

    // Méthode pour supprimer une partie
    async deleteGame(gameId) {
      try {
        await deleteGame(gameId);
        this.successMessage = "Partie supprimée avec succès !";
        this.fetchGames();
      } catch (error) {
        this.error = "Impossible de supprimer la partie.";
      }
    },

    // Méthode pour afficher le statut de la partie
    getStatusText(status) {
      if (status === "waiting") return "Attente d'un joueur";
      if (status === "in_progress") return "En cours";
      if (status === "finished") return "Terminé - Victoire";
      if (status === "draw") return "Terminé - Match nul";
      return "Inconnu";
    },
  },

  created() {
    this.user = getUserIdentity();
    this.fetchGames();
  },
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-semibold text-center mb-6">
        Games Dashboard {{ user.username }}
      </h1>

      <!-- Erreurs et succès-->
      <p v-if="error" class="text-red-600 text-center mb-4">{{ error }}</p>
      <p v-if="successMessage" class="text-green-600 text-center mb-4">
        {{ successMessage }}
      </p>

      <!-- Bouton pour créer une nouvelle partie -->
      <div class="flex justify-center mb-6">
        <button
          @click="createNewGame"
          class="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Créer une nouvelle partie
        </button>
      </div>

      <!-- Liste des parties -->
      <div v-if="games.length === 0" class="text-center text-gray-500">
        Aucune partie disponible
      </div>
      <ul>
        <li
          v-for="game in games"
          :key="game.id"
          class="flex flex-col p-4 mb-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <p class="text-lg font-semibold">Game #{{ game.id }}</p>

          <!-- Affichage du statut avec couleur et cercle -->
          <div class="flex items-center justify-between space-x-2">
            <div class="flex items-center space-x-2">
              <span
                :class="{
                  'bg-blue-500': game.status === 'waiting',
                  'bg-yellow-500': game.status === 'in_progress',
                  'bg-green-500': game.status === 'finished',
                  'bg-gray-500': game.status === 'draw',
                }"
                class="w-3.5 h-3.5 rounded-full"
              ></span>
              <span
                :class="{
                  'text-blue-500': game.status === 'waiting',
                  'text-yellow-500': game.status === 'in_progress',
                  'text-green-500': game.status === 'finished',
                  'text-gray-500': game.status === 'draw',
                }"
                class="text-sm"
              >
                {{ getStatusText(game.status) }}
              </span>
            </div>

            <!-- Joueurs-->
            <div class="flex justify-center my-2">
              <span class="text-sm text-gray-800"
                >{{ game.username1 }} vs {{ game.username2 }}</span
              >
            </div>

            <div class="flex justify-end space-x-4 mt-2">
              <!-- Boutons Rejoindre -->
              <button
                @click="joinGame(game.id)"
                v-if="
                  game.status === 'waiting' ||
                  user.id === game.player1 ||
                  user.id === game.player2
                "
                class="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition duration-200"
              >
                <RouterLink :to="{ name: 'Game', params: { gameId: game.id } }"
                  >Rejoindre</RouterLink
                >
              </button>

              <!-- Bouton supprimer -->
              <button
                @click="deleteGame(game.id)"
                v-if="game.creator === user.id"
                class="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
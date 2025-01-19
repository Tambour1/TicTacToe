<script>
import { setToken } from "../../services/AuthProvider";
import { login } from "../../services/httpClient";
import { RouterLink } from "vue-router";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    // Methode pour se connecter
    async login() {
      try {
        const response = await login(this.username, this.password);
        setToken(response.token);
        this.$router.push("/");
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
      <h2 class="text-2xl font-semibold text-center mb-6">Se connecter</h2>

      <form @submit.prevent="login">
        <!-- Nom d'utilisateur -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Nom d'utilisateur</label
          >
          <input
            id="username"
            type="text"
            v-model="username"
            placeholder="..."
            class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Mot de passe -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Mot de passe</label
          >
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="..."
            class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none"
        >
          Se connecter
        </button>

        <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
      </form>

      <!-- Lien pour s'inscrire -->
      <div class="mt-6 text-center">
        <RouterLink to="/register" class="text-blue-500 hover:underline text-sm"
          >Pas encore inscrit ? Créez un compte</RouterLink
        >
      </div>
    </div>
  </div>
</template>

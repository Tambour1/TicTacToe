<script>
import { register } from "../../services/httpClient";
import { RouterLink } from "vue-router";
export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      error: null,
    };
  },
  methods: {
    // Méthode pour l'inscription
    async checkRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = "Le mot de passe et la confirmation ne correspondent pas";
        return;
      }

      try {
        await register(this.username, this.password);
        this.$router.push("/login");
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        Créer un compte
      </h1>
      
      <!-- Message d'erreur -->
      <p v-if="error" class="mt-4 text-sm text-red-500 text-center">
          {{ error }}
        </p>

      <form @submit.prevent="checkRegister">
        <!-- Nom d'utilisateur -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-600"
            >Nom d'utilisateur</label
          >
          <input
            type="text"
            id="username"
            v-model="username"
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="..."
          />
        </div>

        <!-- Mot de passe -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-600"
            >Mot de passe</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="..."
          />
        </div>

        <!-- Confirmation du mot de passe -->
        <div class="mb-6">
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-600"
            >Confirmer le mot de passe</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="..."
          />
        </div>

        <!-- Bouton d'inscription -->
        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          S'inscrire
        </button>        
      </form>

      <div class="mt-4 text-center">
        <RouterLink to="/login" class="text-sm text-blue-500 hover:underline"
          >Déjà un compte ? Connectez-vous</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from "../../services/httpClient";
import {removeToken, setToken, getUserIdentity } from "../../services/AuthProvider";

export default {
  name: "Profile",
  data() {
    return {
      userBeforeUpdate: {
        id: "",
        username: "",
        password: "",
      },
      user: {
        id: "",
        username: "",
        password: "",
      },
      error: null,
      successMessage: null,
    };
  },
  methods: {
    // Déconnexion
    deconnectUser() {
      removeToken();
      this.$router.push("/login");
    },

    // Charger les données utilisateur
    async fetchUser() {
      try {
        const identity = getUserIdentity();
        const user = await getUser(identity.id);
        this.userBeforeUpdate = { ...this.userBeforeUpdate, ...user };
      } catch (error) {
        this.error = error;
        this.deconnectUser();
      }
    },

    // Mettre à jour les informations utilisateur
    async updateUser() {
      try {
        const updatedData = {
          username: this.user.username,
          ...(this.user.password && { password: this.user.password }),
        };

        const response = await updateUser(updatedData);

        // Mettre à jour le token
        setToken(response.user.token);

        // Mettre à jour le composant avec les nouvelles données
        this.userBeforeUpdate.username = response.user.username;

        this.successMessage = "Mise à jour réussie !";
        this.error = null;
      } catch (error) {
        this.error = error;
        this.successMessage = null;
      }
    },
  },

  mounted() {
    this.fetchUser();
  },
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex justify-center items-center p-8">
    <div class="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
      <h1 class="text-2xl font-semibold text-center mb-6">
        Profil Utilisateur
      </h1>

      <!-- Utilisateur actuel -->
      <div class="mb-4 text-center">
        <p class="text-lg text-gray-700">
          Username actuel: <strong>{{ userBeforeUpdate.username }}</strong>
        </p>
      </div>

      <!-- Messages de succès ou d'erreur -->
      <p v-if="successMessage" class="text-green-600 text-center mt-4">
        {{ successMessage }}
      </p>
      <p v-if="error" class="text-red-600 text-center mt-4">{{ error }}</p>

      <form @submit.prevent="updateUser">
        <!-- Nouveau username -->
        <div class="mb-4">
          <label for="username" class="block text-gray-700"
            >Nouveau nom d'utilisateur :</label
          >
          <input
            id="username"
            v-model="user.username"
            class="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            type="text"
            required
          />
        </div>

        <!-- Nouveau mot de passe -->
        <div class="mb-4">
          <label for="password" class="block text-gray-700"
            >Nouveau mot de passe :</label
          >
          <input
            id="password"
            v-model="user.password"
            class="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Optionnel"
          />
        </div>

        <!-- Bouton de mise à jour -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Mettre à jour
        </button>
      </form>

      <!-- Bouton de déconnexion -->
      <div class="mt-6 text-center">
        <button
          @click="deconnectUser"
          class="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="bg-gray-800 text-white p-4">
    <nav class="flex justify-between items-center">
      <div class="text-xl font-semibold">
        <RouterLink
          to="/"
          class="text-white hover:text-gray-300 transition duration-200"
          >TicTacToe</RouterLink
        >
      </div>

      <div class="space-x-6">
        <RouterLink
          to="/"
          class="text-white hover:text-blue-400 transition duration-200"
          >Dashboard</RouterLink
        >
        <RouterLink
          to="/profile"
          class="text-white hover:text-blue-400 transition duration-200"
          >Profil</RouterLink
        >
        <RouterLink
          to="/login"
          class="text-white hover:text-blue-400 transition duration-200"
          >Se connecter</RouterLink
        >
        <RouterLink
          to="/register"
          class="text-white hover:text-blue-400 transition duration-200"
          >S'inscrire</RouterLink
        >
      </div>
    </nav>
  </header>

  <RouterView />
</template>

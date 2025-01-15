<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/login">Login</RouterLink>   
        <RouterLink to="/profile">Profile</RouterLink>     
      </nav>
  </header>

  <RouterView />
</template>

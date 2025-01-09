<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/register">Register</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

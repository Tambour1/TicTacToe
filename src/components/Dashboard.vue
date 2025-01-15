<script>
import { getUserIdentity } from '../../services/AuthProvider';
export default {
  name: 'Dashboard',
  data() {
    return {
      user: null,
    }
  }, 
  mounted() {
    this.user = getUserIdentity();
  }
}
</script>

<template>
  <div>
    <p v-if="user">Bonjour, {{ user.username }}</p>
  </div>
</template>

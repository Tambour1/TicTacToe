<script>
import { getUserIdentity, removeToken } from '../../services/AuthProvider';
export default {
  name: 'Dashboard',
  data() {
    return {
      user: null,
    }
  },
  methods: {
    deconnectUser() {
      removeToken();
      this.$router.push('/login');
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
    <button @click="deconnectUser">Deconnect</button>
  </div>
</template>

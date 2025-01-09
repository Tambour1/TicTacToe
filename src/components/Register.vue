<script>
import {register} from '../../services/httpClient';
import {RouterLink} from 'vue-router';
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
    handleRegister() {
        if (this.password !== this.confirmPassword) {
          this.error = "Le mot de passe et la confirmation ne correspondent pas";
          return;
        }

        register(this.username, this.password)
          .then(() => {
            this.$router.push("/login");
          })
          .catch((error) => {
            this.error = error.response.data.message;
          });
    },
  },
};
</script>

<template>
    <div>
        <form @submit.prevent="handleRegister">
        <input type="text" placeholder="Username" v-bind="username" />
        <input type="password" placeholder="Password" v-bind="password" />
        <input type="password" placeholder="Confirm Password" v-bind="confirmPassword" />
        <button type="submit">S'inscrire</button>
        <p v-if="error">{{ error }}</p>        
        </form>
        <RouterLink to="/login">Connexion</RouterLink>
    </div>
</template>
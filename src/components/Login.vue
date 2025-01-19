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
    handleLogin() {
      login(this.username, this.password)
        .then((response) => {
          setToken(response.token);
          this.$router.push("/");
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },
};
</script>

<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input type="text" placeholder="Username" v-model="username" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="submit">Se connecter</button>
      <p v-if="error">{{ error }}</p>
    </form>
    <RouterLink to="/register">Register</RouterLink>
  </div>
</template>

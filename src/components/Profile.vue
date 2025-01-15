<script>
import { getUser, updateUser } from '../../services/httpClient';
import { removeToken, setToken, getUserIdentity } from '../../services/AuthProvider';

export default {
  name: 'Profile',
  data() {
    return {
      userBeforeUpdate: {
        id: '',
        username: '',
        password: '',
    },
      user: {
        id: '',
        username: '',
        password: '',
      },
      error: null,
      successMessage: null,
    };
  },
  methods: {
    // Déconnexion
    deconnectUser() {
      removeToken();
      this.$router.push('/login');
    },

    // Charger les données utilisateur
    async fetchUser() {
      try {
        const identity = getUserIdentity();
        if (!identity || !identity.id) {
          throw new Error('Utilisateur non authentifié.');
        }

        const user = await getUser(identity.id);
        this.userBeforeUpdate = { ...this.userBeforeUpdate, ...user };
      } catch (error) {
        console.error('Erreur lors du chargement des informations utilisateur:', error);
        this.error = error.message || 'Erreur inconnue.';
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

        this.successMessage = 'Mise à jour réussie !';
        this.error = null;
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        this.error = error.message || 'Erreur inconnue.';
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
  <div class="profile-view">
    <h1>Profil Utilisateur</h1>
    <p>Username : {{ userBeforeUpdate.username }}</p>
    <form @submit.prevent="updateUser">
      <div>
        <label for="username">Nouveau nom d'utilisateur :</label>
        <input id="username" v-model="user.username" required />
      </div>
      <div>
        <label for="password">Nouveau mot de passe :</label>
        <input id="password" v-model="user.password" type="password" />
      </div>
      <button type="submit">Mettre à jour</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <button @click="deconnectUser">Se déconnecter</button>
  </div>
</template>

<style scoped>
.success {
  color: green;
}
.error {
  color: red;
}
</style>

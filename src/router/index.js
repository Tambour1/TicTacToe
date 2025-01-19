import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Dashboard from "../components/Dashboard.vue";
import Profile from "../components/Profile.vue";
import Game from "../components/Game.vue";
import { isAuthenticated } from "../../services/AuthProvider";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: { requiresGuest: true },
    },
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: "/game/:gameId",
      name: "Game",
      component: Game,
      props: true,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLogged = isAuthenticated();
  if (to.meta.requiresAuth && !isLogged) {
    next({ name: "Login" });
  } else if (to.meta.requiresGuest && isLogged) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;

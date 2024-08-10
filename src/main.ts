import { createPinia } from "pinia";
import { createApp } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import App from "~/App.vue";
import { roomGuard } from "~/guards/room.guard";
import Home from "~/pages/Home.vue";
import Room from "~/pages/Room.vue";
import Stats from "~/pages/Stats.vue";
import "~/style.css";

const pinia = createPinia();

const routes: RouteRecordRaw[] = [
  { path: "/", name: "Home", component: Home },
  { path: "/r/:room_name", component: Room, beforeEnter: roomGuard },
  { path: "/stats", component: Stats },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(pinia).use(router).mount("#app");

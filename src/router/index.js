import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/map",
      name: "map",
      component: () => import("../views/MapView.vue"),
    },
    {
      path: "/posts",
      name: "posts",
      component: () => import("../views/PostsView.vue"),
    },
    {
      path: "/:catchAll(.*)",
      redirect: () => {
        return { path: "/posts" };
      },
    },
  ],
});

export default router;

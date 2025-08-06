import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Layout",
      component: () => import("../views/layout/index.vue"),
      redirect: "/index",
      children: [
        { path: "/dept", component: () => import("../views/dept/index.vue") },
        { path: "/emp", component: () => import("../views/emp/index.vue") },
        { path: "/clazz", component: () => import("../views/clazz/index.vue") },
        { path: "/stu", component: () => import("../views/stu/index.vue") },
        { path: "/log", component: () => import("../views/log/index.vue") },
        {
          path: "/empReport",
          component: () => import("../views/report/emp/index.vue"),
        },
        {
          path: "/stuReport",
          component: () => import("../views/report/stu/index.vue"),
        },
        { path: "/index", component: () => import("../views/index/index.vue") },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login/index.vue"),
    },
  ],
});

export default router;

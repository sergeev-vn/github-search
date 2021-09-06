import { createWebHistory, createRouter } from "vue-router"

import Home from "@/pages/Home.vue"
import NotFound from "@/pages/404.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

import { createApp } from "vue"
import App from "./App.vue"

import router from "./routes"
import store from "./store"
import "./assets/scss/main.scss"

createApp(App)
  .use(router)
  .use(store)
  .mount("#app")

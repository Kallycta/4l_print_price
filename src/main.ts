import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"

import "@/assets/main.css"
import "@/assets/fonts/roboto.css"
import confirmPlugin from "@/services/confirmPlugin.ts"

const app = createApp(App)

app.use(createPinia())
app.use(confirmPlugin)

app.mount("#app")

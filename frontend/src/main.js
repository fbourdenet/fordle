import { createApp } from 'vue'
import App from './App.vue'
import { io } from "socket.io-client";

let app = createApp(App);
app.config.globalProperties.$socket = io(process.env.VUE_APP_BACKEND, {secure: true});

app.mount('#app');
import { createApp } from 'vue'
import App from './App.vue'
import { io } from "socket.io-client";

let app = createApp(App);
app.config.globalProperties.$socket = io("http://localhost:3000");

app.mount('#app');
import { createApp, reactive } from "vue";
import router from "/src/router/index.js";
import "../src/style/index.scss";
import App from "./App.vue";
import { VueFire } from "vuefire";
import { firebaseApp } from "./includes/firebase.js";

//GlobalNotification
const message = reactive({ message: "" });

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [],
});
app.use(router);
app.provide("key", message);

app.mount("#app");

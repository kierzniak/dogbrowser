import Vue from "vue";

import "./assets/scss/styles.scss";

import "./utils/error";
import "./filters";
import router from "./router";
import store from "./store";

import App from "./App.vue";

new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount("#app");

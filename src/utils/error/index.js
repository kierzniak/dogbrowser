import Vue from "vue";

import * as Sentry from "@sentry/browser";
import config from "../../config";

import * as Handlers from "./handlers.js";

window.onerror = Handlers.error;
window.onunhandledrejection = Handlers.promise;

Vue.config.errorHandler = Handlers.vueError;
Vue.config.warnHandler = Handlers.vueWarn;

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: config.sentryDNS,
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
}

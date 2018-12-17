import Vue from "vue";

import date from "./date";
import truncate from "./truncate";

Vue.filter("date", date);
Vue.filter("truncate", truncate);

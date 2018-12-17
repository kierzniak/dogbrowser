import Vue from "vue";
import Router from "vue-router";

import HeaderPartial from "./../views/Partials/HeaderPartial.vue";
import FooterPartial from "./../views/Partials/FooterPartial.vue";

import NotFoundView from "./../views/NotFoundView.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      components: {
      default: async () => import(/* webpackChunkName: "home" */ './../views/PhotosView.vue'), // eslint-disable-line
        header: HeaderPartial,
        footer: FooterPartial
      }
    },
    {
      path: "/author/:id",
      name: "author",
      components: {
        default: async () => import(/* webpackChunkName: "author" */ "./../views/AuthorView.vue"),
        header: HeaderPartial,
        footer: FooterPartial
      }
    },
    {
      path: "/search/:query",
      name: "search",
      components: {
        default: async () => import(/* webpackChunkName: "search" */ "./../views/SearchView.vue"),
        header: HeaderPartial,
        footer: FooterPartial
      }
    },
    {
      path: "/map",
      name: "map",
      components: {
        default: async () => import(/* webpackChunkName: "map" */ "./../views/MapView.vue"),
        header: HeaderPartial,
        footer: FooterPartial
      }
    },
    {
      path: "/404",
      name: "notfound",
      components: {
        default: NotFoundView
      }
    },
    {
      path: "*",
      redirect: { name: "notfound" }
    }
  ]
});

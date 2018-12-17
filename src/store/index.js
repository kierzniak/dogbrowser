import Vue from "vue";
import Vuex from "vuex";

import hash from "object-hash";
import { getType, isString, isBoolean, isNumber, isNull, isArray, isObject } from "typechecker";

import Photos from "../api/photos.js";

import preload from "../utils/preload.js";
import licenses from "./licenses";
import colors from "./colors";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    photos: {
      /**
       * Namespace photos module
       */
      namespaced: true,

      state: {
        photos: {},
        hash: null,
        page: 1,
        perPage: 100,

        // Loading indicator shows whether any ajax request is made to flick api
        loading: false,

        // Preloading indicator shows whether any images need to be loaded
        preloading: false,

        // Preloading indicator shows whether first chunk images
        preloadingFirstChunk: false,

        // Indicator shows whether any more photos can be loaded
        morePhotos: true
      },

      mutations: {
        /**
         * Update array of photos.
         *
         * @param {Object} state   - Vuex state.
         * @param {Object}   payload - Flickr photos.
         *
         * @returns {void} Returns nothing.
         */
        updatePhotos(state, payload) {
          if (!isObject(payload)) {
            throw new TypeError(
              `You are trying to update "photos" but payload is not typeof "object" but "${getType(payload)}"`
            );
          }

          if (!isString(payload.hash)) {
            throw new TypeError(
              `You are trying to update "photos" but "hash" of "payload" is not typeof "string" but "${getType(
                payload.hash
              )}"`
            );
          }

          if (!isArray(payload.hash)) {
            throw new TypeError(
              `You are trying to update "photos" but "photos" of "payload" is not typeof "array" but "${getType(
                payload.photos
              )}"`
            );
          }

          if (typeof state.photos[payload.hash] === "undefined") {
            Vue.set(state.photos, payload.hash, []);
          }

          Vue.set(state.photos, payload.hash, payload.Photos);
        },

        /**
         * Add array of photos.
         *
         * @param {Object} state   - Vuex state.
         * @param {Array}    payload - Flickr photos.
         *
         * @returns {void} Returns nothing.
         */
        addPhotos(state, payload) {
          if (!isObject(payload)) {
            throw new TypeError(
              `You are trying to update "photos" but payload is not typeof "object" but "${getType(payload)}"`
            );
          }

          if (!isString(payload.hash)) {
            throw new TypeError(
              `You are trying to update "photos" but "hash" of "payload" is not typeof "string" but "${getType(
                payload.hash
              )}"`
            );
          }

          if (!isArray(payload.photos)) {
            throw new TypeError(
              `You are trying to update "photos" but "photos" of "payload" is not typeof "array" but "${getType(
                payload.photos
              )}"`
            );
          }

          if (typeof state.photos[payload.hash] === "undefined") {
            Vue.set(state.photos, payload.hash, []);
          }

          Vue.set(state.photos, payload.hash, state.photos[payload.hash].concat(payload.photos));
        },

        /**
         * Update loading state.
         *
         * @param {Object} state - Vuex state.
         * @param {string} value - Hash value.
         *
         * @returns {void} Returns nothing.
         */
        updateHash(state, value) {
          if (!isString(value)) {
            throw new TypeError(
              `You are trying to update "hash" but "value" is not typeof "string" but "${getType(value)}"`
            );
          }

          state.hash = value;
        },

        /**
         * Increment page number.
         *
         * @param {Object} state - Vuex state.
         *
         * @returns {void} Returns nothing.
         */
        incrementPage(state) {
          state.page = state.page + 1;
        },

        /**
         * Update loading state.
         *
         * @param {Object} state - Vuex state.
         * @param {boolean}  value - Loading indicator.
         *
         * @returns {void} Returns nothing.
         */
        updateLoading(state, value) {
          if (!isBoolean(value)) {
            throw new TypeError(
              `You are trying to update "loading" but "value" is not typeof "boolean" but "${getType(value)}"`
            );
          }

          state.loading = value;
        },

        /**
         * Update preloading state.
         *
         * @param {Object} state - Vuex state.
         * @param {Array}    value - Preloading indicator.
         *
         * @returns {void} Returns nothing.
         */
        updatePreloading(state, value) {
          if (!isBoolean(value)) {
            throw new TypeError(
              `You are trying to update "preloading" but "value" is not typeof "boolean" but "${getType(value)}"`
            );
          }

          state.preloading = value;
        },

        /**
         * Update preloading first chunk state.
         *
         * @param {Object} state - Vuex state.
         * @param {Array}    value - Preloading indicator.
         *
         * @returns {void} Returns nothing.
         */
        updatePreloadingFirstChunk(state, value) {
          if (!isBoolean(value)) {
            throw new TypeError(
              `You are trying to update "preloadingFirstChunk" but "value" is not typeof "boolean" but "${getType(
                value
              )}"`
            );
          }

          state.preloadingFirstChunk = value;
        },

        /**
         * Update morePhotos indicator.
         *
         * @param {Object} state - Vuex state.
         *
         * @returns {void} Returns nothing.
         */
        noMorePhotos(state) {
          state.morePhotos = false;
        },

        /**
         * Reset all state params.
         *
         * @param {Object} state - Vuex state.
         *
         * @returns {void} Returns nothing.
         */
        reset(state) {
          state.photos = {};
          state.page = 1;
          state.perPage = 100;
          state.loading = false;
          state.preloading = false;
          state.preloadingFirstChunk = false;
          state.morePhotos = true;
        }
      },

      actions: {
        /**
         * Fetch photos from Flickr API.
         *
         * @returns {void} Returns nothing.
         */
        async fetch() {
          // Show loader
          this.commit("photos/updateLoading", true);
          this.commit("photos/updatePreloading", true);
          this.commit("photos/updatePreloadingFirstChunk", true);

          try {
            let md5 = hash(this.state.filters);
            this.commit("photos/updateHash", md5);

            let photos = Photos.formatCollection(
              await Photos.search(this.state.filters, this.state.photos.page, this.state.photos.perPage)
            );

            if (photos.length === 0) {
              return this.commit("photos/noMorePhotos");
            }

            // Preload photos images in chunks and add to photos states
            preload(
              photos,
              preloaded => {
                // Add chunk of preloaded images
                this.commit("photos/addPhotos", {
                  hash: md5,
                  photos: preloaded
                });

                this.commit("photos/updatePreloadingFirstChunk", false);
              },
              () => {
                this.commit("photos/updatePreloading", false);
              }
            );
          } finally {
            // Hide loader whatever goes bad or good
            this.commit("photos/updateLoading", false);

            // In case photos can not be preoladed hide loader after 5s
            setTimeout(() => this.commit("photos/updatePreloadingFirstChunk", false), 5000);
          }
        }
      }
    },

    filters: {
      /**
       * Namespace filters module
       */
      namespaced: true,

      /**
       * Search query
       *
       * @var {string}
       */
      state: {
        query: null,
        author: null,
        geo: {
          lat: null,
          lng: null
        },
        license: JSON.parse(JSON.stringify(licenses)), // Deep clone licenses
        color: JSON.parse(JSON.stringify(colors)), // Deep clone colors,
        dateAfter: null,
        dateBefore: null
      },

      /**
       * Search store mutations
       */
      mutations: {
        /**
         * Update seach query.
         *
         * @param {Object} state - Vuex state.
         * @param {string} value - Search query.
         *
         * @returns {void} Returns nothing.
         */
        updateQuery(state, value) {
          if (!isString(value)) {
            throw new TypeError(
              `You are trying to update "query" but "value" is not typeof "string" but "${getType(value)}"`
            );
          }

          state.query = value;
        },

        /**
         * Update author.
         *
         * @param {Object} state - Vuex state.
         * @param {string} value - Author ID.
         *
         * @returns {void} Returns nothing.
         */
        updateAuthor(state, value) {
          if (!isString(value)) {
            throw new TypeError(
              `You are trying to update "author" but "value" is not typeof "string" but "${getType(value)}"`
            );
          }

          state.author = value;
        },

        /**
         * Update geolocation filters.
         *
         * @param {Object} state   - Vuex state.
         * @param {Object} payload - Geolcation postion payload.
         *
         * @returns {void} Returns nothing.
         */
        updateGeo(state, payload) {
          if (!isObject(payload)) {
            throw new TypeError(
              `You are trying to update "geo" but payload is not typeof "object" but "${getType(payload)}"`
            );
          }

          payload.lat = parseFloat(payload.lat);

          if (!isNumber(payload.lat) || isNaN(payload.lat)) {
            throw new TypeError(
              `You are trying to update "geo" but "lat" of "payload" is not typeof "string" but "${getType(
                payload.lat
              )}"`
            );
          }

          payload.lng = parseFloat(payload.lng);

          if (!isNumber(payload.lng) || isNaN(payload.lng)) {
            throw new TypeError(
              `You are trying to update "geo" but "lng" of "payload" is not typeof "array" but "${getType(
                payload.lng
              )}"`
            );
          }

          state.geo = payload;
        },

        /**
         * Update license.
         *
         * @param {Object} state   - Vuex state.
         * @param {Object} payload - License payload.
         *
         * @returns {void} Returns nothing.
         */
        updateLicense(state, payload) {
          if (!isObject(payload)) {
            throw new TypeError(
              `You are trying to update "license" but payload is not typeof "object" but "${getType(payload)}"`
            );
          }

          if (!isString(payload.id)) {
            throw new TypeError(
              `You are trying to update "license" but "id" of "payload" is not typeof "string" but "${getType(
                payload.id
              )}"`
            );
          }

          if (!isBoolean(payload.checked)) {
            throw new TypeError(
              `You are trying to update "license" but "checked" of "payload" is not typeof "boolean" but "${getType(
                payload.checked
              )}"`
            );
          }

          state.license.find(item => {
            return item.id === payload.id;
          }).checked = payload.checked;
        },

        /**
         * Update color.
         *
         * @param {Object} state   - Vuex state.
         * @param {Object} payload - Color payload.
         *
         * @returns {void} Returns nothing.
         */
        updateColor(state, payload) {
          if (!isObject(payload)) {
            throw new TypeError(
              `You are trying to update "color" but payload is not typeof "object" but "${getType(payload)}"`
            );
          }

          if (!isString(payload.id)) {
            throw new TypeError(
              `You are trying to update "color" but "id" of "payload" is not typeof "string" but "${getType(
                payload.id
              )}"`
            );
          }

          if (!isBoolean(payload.checked)) {
            throw new TypeError(
              `You are trying to update "color" but "checked" of "payload" is not typeof "boolean" but "${getType(
                payload.checked
              )}"`
            );
          }

          state.color.find(item => {
            return item.id === payload.id;
          }).checked = payload.checked;
        },

        /**
         * Update dateAfter filter.
         *
         * @param {Object} state - Vuex state.
         * @param {string} value - Date from.
         *
         * @returns {void} Returns nothing.
         */
        updateDateAfter(state, value) {
          if (!isString(value) && !isNull(value)) {
            throw new TypeError(
              `You are trying to update "dateAfter" but "value" is not typeof "string" but "${getType(value)}"`
            );
          }

          state.dateAfter = value;
        },

        /**
         * Update dateBefore filter.
         *
         * @param {Object} state - Vuex state.
         * @param {string} value - Date from.
         *
         * @returns {void} Returns nothing.
         */
        updateDateBefore(state, value) {
          if (!isString(value) && !isNull(value)) {
            throw new TypeError(
              `You are trying to update "dateBefore" but "value" is not typeof "string" but "${getType(value)}"`
            );
          }

          state.dateBefore = value;
        },

        /**
         * Reset all state params.
         *
         * @param {Object} state - Vuex state.
         *
         * @returns {void} Returns nothing.
         */
        reset(state) {
          state.query = null;
          state.author = null;
          state.geo = {
            lat: null,
            lng: null
          };
          state.license = JSON.parse(JSON.stringify(licenses)); // Deep clone licenses
          state.color = JSON.parse(JSON.stringify(colors)); // Deep clone colors
          state.dateAfter = null;
          state.dateBefore = null;
        }
      }
    }
  }
});

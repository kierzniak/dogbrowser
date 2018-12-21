<template>
  <div>
    <div id="map" ref="map"></div>
    <LoaderElement v-show="loading || preloadingFirstChunk" />
  </div>
</template>

<script>
/* global google, MarkerClusterer */

import notie from "notie";
import $script from "scriptjs";

import config from "../../config";
import NetworkError from "../../errors/NetworkError";

import LoaderElement from "../UI/Element/LoaderElement.vue";

/**
 * PhotosMap component
 *
 * PhotosMap component fetch photos from Flickr API based on geo filters
 * and display them on google maps.
 */
export default {
  name: "PhotosMap",
  components: {
    LoaderElement
  },

  /**
   * Component props
   */
  props: {
    author: {
      type: String,
      default: () => null
    },
    query: {
      type: String,
      default: () => null
    }
  },

  /**
   * Component data.
   *
   * @returns {Object} Returns data object.
   */
  data: function() {
    return {
      markers: {},

      geoAvability: false,
      geoPermission: false
    };
  },

  /**
   * Component computed properties
   */
  computed: {
    /**
     * Get photos from application state.
     *
     * @returns {Object[]} Application state photos.
     */
    photos() {
      let hash = this.$store.state.photos.hash;
      let photos = this.$store.state.photos.photos;

      return photos[hash];
    },

    /**
     * Get loading indicator from application state.
     *
     * @returns {boolean} Application state loading indicator.
     */
    loading() {
      return this.$store.state.photos.loading;
    },

    /**
     * Get indicator which describe if first chunks of image is already loaded.
     *
     * @returns {boolean} Application state preloading first chunk indicator.
     */
    preloadingFirstChunk() {
      return this.$store.state.photos.preloadingFirstChunk;
    }
  },

  /**
   * Component watched properties
   */
  watch: {
    /**
     * Load marker when photos change.
     *
     * We not use Vue templates to load map markers so we need to watch for
     * changes in photos vuex state and trigger loadMarkers method.
     *
     * @returns {void} Returns nothing.
     */
    photos() {
      this.loadMarkers();
    }
  },

  /**
   * Initialize component.
   *
   * Initialize component, load required scripts, load map, check for geolocation
   * avability, bind events and eventualy load photos. If gelocation in permitted
   * photos will be loaded by `idle` event.
   *
   * @returns {void} Returns nothing.
   */
  async created() {
    // Reset all state params
    this.$store.commit("photos/reset");
    this.$store.commit("filters/reset");

    try {
      // Append google maps scripts dynamicly
      await this.loadGoogleMapsAssets();
    } catch {
      /**
       * Show nice notification to user that something is wrong
       * probably with network.
       */
      notie.alert({
        type: "error",
        text: "Sorry but we are unable to load map. Please try again later.",
        position: "bottom"
      });

      throw new NetworkError("Unable to load google maps scripts.");
    }

    // Set default position
    this.$store.commit("filters/updateGeo", config.gmapDefaultLocation);

    await this.loadMap();

    // Geolocation
    this.checkGeoAvability();
    this.loadGeoPosition();

    this.bindEvents();

    // If gelocation in permitted photos will be loaded by `idle` event.
    if (this.geoPermission === false) {
      this.$store.dispatch("photos/fetch");
    }
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Load markers.
     *
     * Load only unique markers to map after each request.
     *
     * @returns {void} Returns nothing.
     */
    loadMarkers() {
      if (this.photos) {
        for (let i = 0; i < this.photos.length; i++) {
          // Only add unique markers
          if (typeof this.markers[this.photos[i].id] === "undefined") {
            this.markers[this.photos[i].id] = this.createMarker(this.photos[i]);
            this.cluster.addMarker(this.markers[this.photos[i].id]);
          }
        }
      }
    },

    /**
     * Create marker.
     *
     * Create marker based on photo position and photo.
     *
     * @param {Object} photo - Photo object.
     *
     * @returns {Marker} Created marker.
     */
    createMarker(photo) {
      let position = new google.maps.LatLng(photo.lat, photo.lng);
      let marker = new google.maps.Marker({ position: position });
      let infoWindow = new google.maps.InfoWindow({ position: position });

      infoWindow.setContent('<img src="' + photo.thumbnail + '" style="wdith: 75px; height: 75px;">');

      marker.addListener("click", () => infoWindow.open(this.map, marker));

      return marker;
    },

    /**
     * Load map.
     *
     * Initialize and load map. Wrap map with promise to handle event when
     * map is ready and rest of the script can be executed.
     *
     * @returns {Promise} Promise of loaded map.
     */
    loadMap() {
      return new Promise(
        function(resolve) {
          this.map = new google.maps.Map(this.$refs.map, {
            center: config.gmapDefaultLocation,
            zoom: config.gmapDefaultZoom
          });

          this.cluster = new MarkerClusterer(this.map, Object.values(this.markers), {
            maxZoom: 16,
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
          });

          google.maps.event.addListenerOnce(this.map, "idle", resolve);
        }.bind(this)
      );
    },

    /**
     * Check for geolocation.
     *
     * Check if geolocation API is available in this browser.
     *
     * @returns {void} Returns nothing.
     */
    checkGeoAvability() {
      this.geoAvability = "geolocation" in navigator;
    },

    /**
     * Call geolocation API current position.
     *
     * @returns {void} Returns nothing.
     */
    loadGeoPosition() {
      if (this.geoAvability) {
        navigator.geolocation.getCurrentPosition(
          this.handleGeoCurrentPosition.bind(this),
          this.handleGeoCurrentPositionError.bind(this)
        );
      }
    },

    /**
     * Call geolocation API current position.
     *
     * @param {Object} position - User position from geolocation API.
     *
     * @returns {void} Returns nothing.
     */
    handleGeoCurrentPosition(position) {
      this.geoPermission = true;

      let lat = position.coords.latitude;
      let lng = position.coords.longitude;

      this.$store.commit("filters/updateGeo", { lat: lat, lng: lng });
      this.$store.dispatch("photos/fetch");

      this.map.setCenter({
        lat: lat,
        lng: lng
      });

      this.map.setZoom(config.gmapDefaultZoom);
    },

    /**
     * Handle gelocation error.
     *
     * If gelocation won't be available mark flag.
     *
     * @returns {void} Returns nothing.
     */
    handleGeoCurrentPositionError() {
      this.geoPermission = false;
    },

    /**
     * Google Maps `idle` event handler.
     *
     * @returns {void} Returns nothing.
     */
    handleMapIdle() {
      let center = this.map.getCenter();

      let lat = center.lat();
      let lng = center.lng();

      this.$store.commit("filters/updateGeo", { lat: lat, lng: lng });
      this.$store.dispatch("photos/fetch");
    },

    /**
     * Bind component events.
     *
     * @returns {void} Returns nothing.
     */
    bindEvents() {
      this.bindedHandleMapIdle = this.handleMapIdle.bind(this);

      google.maps.event.addListener(this.map, "idle", this.bindedHandleMapIdle);
    },

    loadGoogleMapsAssets() {
      return new Promise((resolve, reject) =>
        $script([config.gmapSrc + config.gmapKey, config.gmapClusterSrc], resolve, reject)
      );
    }
  }
};
</script>

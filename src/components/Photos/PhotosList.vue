<template>
  <div>
    <div v-show="photos && photos.length > 0" class="row photos">
      <PhotosItem v-for="(photo, index) in photos" :key="index" :photo="photo" />
    </div>
    <LoaderElement v-show="loading || preloadingFirstChunk" />
    <PhotosNoPhotos v-show="!morePhotos" />
  </div>
</template>

<script>
import config from "../../config";
import LoaderElement from "../UI/Element/LoaderElement.vue";
import PhotosItem from "./PhotosItem.vue";
import PhotosNoPhotos from "./PhotosNoPhotos.vue";

/**
 * PhotosList component
 *
 * PhotoList component shows photos from Flickr API. When user scroll to the
 * bottom of the window component will fetch and load next page if the photos.
 */
export default {
  name: "PhotosList",
  components: {
    LoaderElement,
    PhotosItem,
    PhotosNoPhotos
  },

  /**
   * Component props
   */
  props: {
    filters: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  /**
   * Component data.
   *
   * @returns {Object} Returns data object.
   */
  data() {
    return {
      timer: null
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
     * Get indicator which describe if there if images are preloading
     * from application state.
     *
     * @returns {boolean} Application state preloading indicator.
     */
    preloading() {
      return this.$store.state.photos.preloading;
    },

    /**
     * Get indicator which describe if first chunks of image is already loaded.
     *
     * @returns {boolean} Application state preloading first chunk indicator.
     */
    preloadingFirstChunk() {
      return this.$store.state.photos.preloadingFirstChunk;
    },

    /**
     * Get indicator which describe if there is more photos from application state.
     *
     * @returns {boolean} Application state more photos indicator.
     */
    morePhotos() {
      return this.$store.state.photos.morePhotos;
    }
  },

  /**
   * Component watched properties
   */
  watch: {
    filters: function(value) {
      // Reset all state params
      this.$store.commit("photos/reset");
      this.$store.commit("filters/reset");

      this.resolveFilters();
      this.fetch();
    }
  },

  /**
   * Component created hook.
   *
   * @returns {void} Returns nothing.
   */
  created() {
    // Reset all state params
    this.$store.commit("photos/reset");
    this.$store.commit("filters/reset");

    this.resolveFilters();
    this.fetch();
  },

  /**
   * Component destroy hook.
   *
   * @returns {void} Returns nothing.
   */
  destroy() {
    this.unBindEvents();
  },

  /**
   * Component mounted hook.
   *
   * @returns {void} Returns nothing.
   */
  mounted() {
    this.bindedHandleWindowScroll = this.handleWindowScroll.bind(this);
    this.bindEvents();
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Fetch photos based on application state filters.
     *
     * @returns {void} Returns nothing.
     */
    fetch() {
      this.$store.dispatch("photos/fetch");
    },

    /**
     * Fetch next page of photos.
     *
     * @returns {void} Returns nothing.
     */
    nextPage() {
      this.$store.commit("photos/incrementPage");
      this.$store.dispatch("photos/fetch");
    },

    /**
     * Resolve componnet initial filters based on component props.
     *
     * @returns {void} Returns nothing.
     */
    resolveFilters() {
      if (typeof this.filters.author !== "undefined") {
        this.$store.commit("filters/updateAuthor", this.filters.author);
      }

      if (typeof this.filters.query !== "undefined") {
        this.$store.commit("filters/updateQuery", this.filters.query);
      }
    },

    /**
     * Handle window scroll event.
     *
     * @returns {void} Returns nothing.
     */
    handleWindowScroll() {
      let height = document.documentElement.offsetHeight;
      let scroll = document.documentElement.scrollTop + window.innerHeight;

      let bottom = scroll + config.infiniteScrollOffset >= height;

      let loading = this.$store.state.photos.loading;
      let preloading = this.$store.state.photos.preloading;
      let morePhotos = this.$store.state.photos.morePhotos;

      let canLoad = !loading && !preloading && morePhotos;

      if (this.timer) {
        window.clearTimeout(this.timer);
      }

      this.timer = window.setTimeout(
        function() {
          if (bottom && canLoad) {
            this.nextPage();
          }
        }.bind(this),
        config.infiniteScrollEventTreshhold
      );
    },

    /**
     * Bind events.
     *
     * @returns {void} Returns nothing.
     */
    bindEvents() {
      window.addEventListener("scroll", this.bindedHandleWindowScroll);
    },

    /**
     * Unbind events.
     *
     * @returns {void} Returns nothing.
     */
    unBindEvents() {
      window.removeEventListener("scroll", this.bindedHandleWindowScroll);
    }
  }
};
</script>

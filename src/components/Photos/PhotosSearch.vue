<template>
  <form class="form-inline form-search my-2 my-lg-0 por">
    <input v-model="query" class="form-control mr-sm-2 form-search__input" type="search" placeholder="Search" />
    <button v-show="query" class="close" type="button" @click.prevent="clearQuery();">
      <span aria-hidden="true">&times;</span>
    </button>
    <button class="btn btn-light my-2 my-sm-0" type="submit" @click.prevent="updateQuery();">Search</button>
  </form>
</template>

<script>
/**
 * PhotosSearch component
 */
export default {
  name: "PhotosSearch",
  components: {},

  /**
   * Computed properties
   */
  computed: {
    query: {
      get() {
        return this.$store.state.filters.query;
      },

      set(value) {
        this.$store.commit("filters/updateQuery", value);
      }
    }
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Redirect user to search route on form submit.
     *
     * @returns {void} Returns nothing.
     */
    updateQuery() {
      this.$router.push({ name: "search", params: { query: this.query } });
    },

    /**
     * Redirect user to home when user clear query.
     *
     * @returns {void} Returns nothing.
     */
    clearQuery() {
      this.$store.commit("filters/updateQuery", "");
      this.$router.push({ name: "home" });
    }
  }
};
</script>

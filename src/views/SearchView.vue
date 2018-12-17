<template>
  <div class="container-fluid"><PhotosList :filters="filters" :query="$route.params.query" /></div>
</template>

<script>
import PhotosList from "../components/Photos/PhotosList.vue";

/**
 * SearchView component
 *
 * SearchView component is responsible for search results.
 */
export default {
  name: "SearchView",
  components: {
    PhotosList
  },

  computed: {
    filters() {
      return {
        query: this.$route.params.query
      };
    }
  }
};
</script>

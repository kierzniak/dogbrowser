<template>
  <div class="container-fluid"><PhotosList :filters="filters" /></div>
</template>

<script>
import PhotosList from "../components/Photos/PhotosList.vue";

/**
 * AuthorView component
 *
 * AuthorView component is responsible for displaying photos of given author.
 */
export default {
  name: "AuthorView",
  components: {
    PhotosList
  },

  computed: {
    filters() {
      return {
        author: this.$route.params.id
      };
    }
  }
};
</script>

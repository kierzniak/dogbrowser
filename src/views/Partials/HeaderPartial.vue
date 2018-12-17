<template>
  <header>
    <div class="navbar navbar-expand-lg navbar-dark bg-dark">
      <RouterLink class="navbar-brand h4 mt-0 mb-0 text-uppercase font-weight-bold" :to="to">DogBrowser</RouterLink>
      <NavPartial />
      <SearchElement class="ml-auto" />
    </div>
  </header>
</template>

<script>
import NavPartial from "./NavPartial.vue";
import SearchElement from "../../components/Photos/PhotosSearch.vue";

/**
 * HeaderPartial component
 *
 * HeaderPartial component is responsible for displaying header part of the website.
 */
export default {
  name: "HeaderPartial",
  components: {
    NavPartial,
    SearchElement
  },

  computed: {
    to() {
      return { name: "home" };
    }
  }
};
</script>

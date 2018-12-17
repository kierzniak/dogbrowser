<template>
  <div class="container-fluid">
    <PhotosFilters />
    <PhotosList />
  </div>
</template>

<script>
import PhotosList from "../components/Photos/PhotosList.vue";
import PhotosFilters from "../components/Photos/PhotosFilters.vue";

/**
 * PhotosView component
 *
 * PhotosView component is responsible for displaying photos based on used filters.
 */
export default {
  name: "PhotosView",
  components: {
    PhotosList,
    PhotosFilters
  }
};
</script>

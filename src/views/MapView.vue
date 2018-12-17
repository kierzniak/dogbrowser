<template>
  <div class="container-fluid"><PhotosMap /></div>
</template>

<script>
import PhotosMap from "../components/Photos/PhotosMap.vue";

/**
 * MapView component
 *
 * MapView component is responsible for displaying photos of on google maps.
 */
export default {
  name: "MapView",
  components: {
    PhotosMap
  }
};
</script>

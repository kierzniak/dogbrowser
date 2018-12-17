<template>
  <h2>{{ photo.title | truncate(30) }}</h2>
</template>

<script>
/**
 * PhotosItem component
 */
export default {
  name: "PhotosItemTitle",

  /**
   * Component props
   */
  props: {
    photo: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

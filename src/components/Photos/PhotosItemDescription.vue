<template>
  <div>{{ photo.description | truncate(30) }}</div>
</template>

<script>
/**
 * PhotosItemDescription component
 */
export default {
  name: "PhotosItemDescription",

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

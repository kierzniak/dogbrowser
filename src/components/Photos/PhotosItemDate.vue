<template>
  <span>{{ photo.timestamp | date }}</span>
</template>

<script>
/**
 * PhotosItemDate component
 */
export default {
  name: "PhotosItemDate",

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

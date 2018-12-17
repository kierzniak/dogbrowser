<template>
  <img :src="photo.url" :alt="photo.title + ' by ' + photo.author" />
</template>

<script>
/**
 * PhotosItemImage component
 */
export default {
  name: "PhotosItemImage",

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

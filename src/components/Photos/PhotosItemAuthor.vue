<template>
  <span>
    <RouterLink :to="to">{{ photo.author | truncate(30) }}</RouterLink>
  </span>
</template>

<script>
/**
 * PhotosItemAuthor component
 */
export default {
  name: "PhotosItemAuthor",

  /**
   * Component props
   */
  props: {
    photo: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * Component computed properties
   */
  computed: {
    to() {
      return { name: "author", params: { id: this.photo.authorId } };
    }
  }
};
</script>

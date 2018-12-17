<template>
  <div class="col-lg-3 col-md-6 col-12 photo">
    <figure class="photo-figure">
      <PhotosItemImage :photo="photo" />
      <figcaption class="photo-figcaption">
        <PhotosItemTitle :photo="photo" />
        <p>
          <PhotosItemDescription :photo="photo" />
          <br v-show="photo.description" />
          <PhotosItemDate :photo="photo" /> by <PhotosItemAuthor :photo="photo" />
        </p>
      </figcaption>
    </figure>
  </div>
</template>

<script>
import PhotosItemImage from "./PhotosItemImage.vue";
import PhotosItemTitle from "./PhotosItemTitle.vue";
import PhotosItemDescription from "./PhotosItemDescription.vue";
import PhotosItemDate from "./PhotosItemDate.vue";
import PhotosItemAuthor from "./PhotosItemAuthor.vue";

/**
 * PhotosItem component
 */
export default {
  name: "PhotosItem",

  components: {
    PhotosItemImage,
    PhotosItemTitle,
    PhotosItemDescription,
    PhotosItemDate,
    PhotosItemAuthor
  },

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

<template>
  <div class="row filters">
    <div class="col-lg-12 d-flex align-items-center">
      <p class="mr-3">Filters:</p>
      <ChoiceListFilter label="License" name="license" :choices="licenses" />
      <ChoiceListFilter label="Color" name="color" :choices="colors" />
      <DateFilter label="Date" name="date" />
    </div>
  </div>
</template>

<script>
import ChoiceListFilter from "../UI/Filter/ChoiceListFilter.vue";
import DateFilter from "../UI/Filter/DateFilter.vue";

/**
 * PhotosFilters component
 */
export default {
  name: "PhotosFilters",
  components: {
    ChoiceListFilter,
    DateFilter
  },

  /**
   * Component computed properties
   */
  computed: {
    licenses() {
      return this.$store.state.filters.license;
    },
    colors() {
      return this.$store.state.filters.color;
    }
  }
};
</script>

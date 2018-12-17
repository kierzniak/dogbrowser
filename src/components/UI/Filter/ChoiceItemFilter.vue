<template>
  <div class="form-check my-1">
    <input :id="id" v-model="checked" type="checkbox" class="form-check-input" />
    <label class="form-check-label" :for="id">{{ label }}</label>
  </div>
</template>

<script>
/**
 * ChoiceItemFilter component
 */
export default {
  name: "ChoiceItemFilter",
  components: {},

  /**
   * Component props
   */
  props: {
    name: {
      type: String,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },

  /**
   * Component computed properties
   */
  computed: {
    id() {
      return this.name + "_" + this.uid;
    },

    checked: {
      set(value) {
        let method = "filters/update" + this.name.charAt(0).toUpperCase() + this.name.slice(1);
        this.$store.commit(method, { id: this.uid, checked: value });
        this.$store.commit("photos/reset");
        this.$store.dispatch("photos/fetch");
      },

      get() {
        let choices = this.$store.state.filters[this.name];
        let current = choices.find(item => {
          return item.id === this.uid;
        });

        return current.checked;
      }
    }
  }
};
</script>

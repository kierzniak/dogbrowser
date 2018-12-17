<template>
  <div :class="dropdownClasses">
    <button :class="btnClasses" type="button" @click="show = !show;">{{ label }}</button>
    <div :class="dropdownMenuClasses"><slot></slot></div>
  </div>
</template>

<script>
/**
 * DropdownElement component
 */
export default {
  name: "DropdownElement",
  components: {},

  /**
   * Component props
   */
  props: {
    label: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "primary"
    },
    type: {
      type: String,
      default: "default"
    }
  },

  /**
   * Component data.
   *
   * @returns {Object} Returns data object.
   */
  data() {
    return {
      show: false
    };
  },

  /**
   * Component computed properties
   */
  computed: {
    dropdownClasses() {
      return {
        dropdown: true,
        show: this.show
      };
    },

    dropdownMenuClasses() {
      return {
        "dropdown-menu": true,
        show: this.show
      };
    },

    btnClasses() {
      let classes = {
        "dropdown-toggle": true,
        btn: true
      };

      if (this.type === "default") {
        classes["btn-" + this.color] = true;
      }

      if (this.type === "outline") {
        classes["btn-outline-" + this.color] = true;
      }

      return classes;
    }
  }
};
</script>

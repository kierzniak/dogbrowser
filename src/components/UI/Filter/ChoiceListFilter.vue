<template>
  <div class="filter filter-checkbox">
    <DropdownElement :label="compLabel" :color="defaultColor" :type="compType">
      <form class="px-4 py-3 rce">
        <ChoiceItemFilter
          v-for="choice in compChoices"
          :key="choice.id"
          :name="name"
          :uid="choice.id"
          :label="choice.label"
        />
      </form>
    </DropdownElement>
  </div>
</template>

<script>
/**
 * ChoiceListFilter component
 */
import DropdownElement from "../Element/DropdownElement.vue";
import ChoiceItemFilter from "./ChoiceItemFilter.vue";

export default {
  name: "ChoiceListFilter",
  components: {
    DropdownElement,
    ChoiceItemFilter
  },

  /**
   * Component props
   */
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },

  /**
   * Component data.
   *
   * @returns {Object} Returns data object.
   */
  data() {
    return {
      defaultColor: "secondary",
      defaultType: "outline",
      activeType: "default"
    };
  },

  /**
   * Component computed properties
   */
  computed: {
    compLabel() {
      let choicesLabel = [];
      let checked = this.getChecked();

      if (checked.length <= 0) {
        return this.label;
      }

      for (let i = 0; i < checked.length; i++) {
        choicesLabel.push(checked[i].label);
      }

      return choicesLabel.join(", ");
    },

    compType() {
      let checked = this.getChecked();

      if (checked.length <= 0) {
        return this.defaultType;
      }

      return this.selectedType;
    },

    compChoices() {
      return this.$store.state.filters[this.name];
    }
  },

  methods: {
    /**
     * Get checked choices.
     *
     * @returns {Object[]} Retrun array of checked items.
     */
    getChecked() {
      let choices = this.$store.state.filters[this.name];
      let checked = [];

      for (let i = 0; i < choices.length; i++) {
        if (choices[i].checked) {
          checked.push(choices[i]);
        }
      }

      return checked;
    }
  }
};
</script>

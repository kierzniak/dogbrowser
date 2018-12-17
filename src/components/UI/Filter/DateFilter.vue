<template>
  <div class="filter filter-date">
    <DropdownElement :color="defaultColor" :label="compLabel" :type="compType">
      <form class="px-4 py-3 rce">
        <div class="form-group position-relative">
          <label for="dateAfter">Uploaded after:</label>
          <Datepicker v-model="dateAfter" :clear-button="true" placeholder="Select date" @cleared="resetDateAfter();" />
        </div>
        <div class="form-group position-relative">
          <label for="dateBefore">Uploaded before:</label>
          <Datepicker
            v-model="dateBefore"
            :clear-button="true"
            placeholder="Select date"
            @cleared="resetDateBefore();"
          />
        </div>
      </form>
    </DropdownElement>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";

import DropdownElement from "../Element/DropdownElement.vue";

/**
 * DateFilter component
 */
export default {
  name: "DateFilter",
  components: {
    DropdownElement,
    Datepicker
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
    dateAfter: {
      get() {
        return this.$store.state.filters.dateAfter;
      },
      set(value) {
        if (value) {
          value = DateTime.fromJSDate(value).toFormat("yyyy-MM-dd");
        }

        this.$store.commit("filters/updateDateAfter", value);

        this.$store.commit("photos/reset");
        this.$store.dispatch("photos/fetch");
      }
    },

    dateBefore: {
      get() {
        return this.$store.state.filters.dateBefore;
      },
      set(value) {
        if (value) {
          value = DateTime.fromJSDate(value).toFormat("yyyy-MM-dd");
        }

        this.$store.commit("filters/updateDateBefore", value);

        this.$store.commit("photos/reset");
        this.$store.dispatch("photos/fetch");
      }
    },

    dateAfterShow() {
      return this.$store.state.filters.dateAfter;
    },

    dateBeforeShow() {
      return this.$store.state.filters.dateBefore;
    },

    compLabel() {
      let dates = [];

      let dateAfter = this.$store.state.filters.dateAfter;
      let dateBefore = this.$store.state.filters.dateBefore;

      if (typeof dateAfter !== "undefined" && dateAfter) {
        dates.push("After: " + dateAfter);
      }

      if (typeof dateBefore !== "undefined" && dateBefore) {
        dates.push("Before: " + dateBefore);
      }

      if (dates.length === 0) {
        return this.label;
      }

      return dates.join(", ");
    },

    compType() {
      let dateAfter = this.$store.state.filters.dateAfter;
      let dateBefore = this.$store.state.filters.dateBefore;

      if ((typeof dateBefore !== "undefined" || typeof dateAfter !== "undefined") && (dateBefore || dateAfter)) {
        return this.selectedType;
      }

      return this.defaultType;
    }
  },

  methods: {
    resetDateAfter() {
      this.$store.commit("filters/updateDateAfter", "");

      this.$store.commit("photos/reset");
      this.$store.dispatch("photos/fetch");
    },
    resetDateBefore() {
      this.$store.commit("filters/updateDateBefore", "");

      this.$store.commit("photos/reset");
      this.$store.dispatch("photos/fetch");
    }
  }
};
</script>

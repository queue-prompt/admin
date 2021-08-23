<template>
  <div class="pill">
    <div class="user-timeline-date" style="display: inline">
      Selected Date :
    </div>
    <span
      class="badge badge-secondary"
      @click="clickDate(k)"
      v-for="(v, k) in tmpDate"
      :key="k"
      >{{ k }}

      <i class="icon icon-left mdi mdi-close-circle"></i>
    </span>
    <button class="btn btn-link" v-if="tmpDate" @click="clear">clear</button>
  </div>
</template>

<script>
export default {
  props: ["tmpDate"],
  methods: {
    clear() {
      this.$emit("clear");
    },
    clickDate(date) {
      this.$emit("click_date", date);
    },
  },
};
</script>

<style>
.pill span.badge.badge-secondary {
  margin-right: 1rem;
  font-size: 1.1rem;
}
</style>

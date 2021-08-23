<template>
  <button
    @click="onClick"
    :disabled="disabled"
    style="width: 250px"
    class="btn btn-lg btn-primary"
  >
    <slot name="content" />
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    disabled: {
      default: () => false,
    },
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style></style>

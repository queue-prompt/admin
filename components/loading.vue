<template>
  <div v-if="isLoading" id="loading-overlay">
    <div class="content-loading">
      <img
        :src="imageLoading"
        alt="loading"
        width="200"
        height="auto"
      >
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isLoading () {
      return this.$store.state.appState.isLoading
    },
    imageLoading () {
      return require('../assets/svg/loading-ellipsis.svg')
    }
  }
}
</script>

<style>
#loading-overlay {
  background-color: rgba(16,16,16,0.56078);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1050;
}

.content-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 40%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>

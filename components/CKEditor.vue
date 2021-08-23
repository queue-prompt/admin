<template>
  <div>
    <ckeditor
      v-model="contentData"
      class="mt-2"
      :config="editorConfig"
      @input="handleInput"
    />
  </div>
</template>

<script>
// test
export default {
  props: {
    content: {
      type: String,
      default: '',
      requitr: true
    }
  },
  data () {
    return {
      contentData: '',
      editorConfig: {
        toolbar: [
          { name: 'clipboard', items: ['Cut', 'Copy', '-', 'Undo', 'Redo', 'Maximize'] },
          {
            name: 'basicstyles',
            items: [
              'Bold',
              'Italic',
              'Strike',
              '-',
              'CopyFormatting',
              'RemoveFormat'
            ]
          },
          {
            name: 'paragraph',
            items: [
              'NumberedList',
              'BulletedList',
              '-',
              'JustifyLeft',
              'JustifyCenter',
              'JustifyRight',
              'JustifyBlock'
            ]
          }
        ]
      }
    }
  },
  created () {
    if (this.content) {
      this.contentData = this.content
    }
  },
  methods: {
    handleInput () {
      this.$emit('content', this.contentData)
    }
  }
}
</script>

<style></style>

<template>
  <div>
    <div class="card">
      <div class="card-header card-header-divider">
        <div class="tools">
          <span class="icon s7-upload"></span><span class="icon s7-edit"></span
          ><span class="icon s7-close"></span>
        </div>
        <span class="title"
          ><mark>เงื่อนไขในการมาใช้บริการ</mark>
          ที่จะแจ้งให้ผู้มาใช้บริการทราบ</span
        >
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-6">
            <ul class="ol">
              <li class="">แจ้งเงื่อนไขต่างๆ ก่อนรับบริการ</li>
              <li class="">ราคาค่าใช้จ่าย การชำระเงิน</li>
              <li class="">ประเภทเช่น การตรวจโควิด / วัคซีน</li>
            </ul>
          </div>
          <div class="col-6">
            <ul class="l">
              <li class="">ระยะเวลาในการรับบริการ</li>
              <li class="">สิ่งที่ควรทราบก่อนการจองคิว</li>
              <li class="">สิ่งที่นำมาในวันมาใช้บริการ</li>
            </ul>
          </div>
        </div>

        <div class="px-5 my-3">
          <CKEditor v-if="text" :content="text" @content="updateContent" />
          <button
            class="btn btn-primary btn-lg mt-3"
            style="width: 120px"
            @click="submitSave"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CKEditor from "../components/CKEditor.vue";

export default {
  components: {
    CKEditor,
  },
  data() {
    return {
      content: "",
    };
  },
  computed: {
    text() {
      return this.$store.state.preRegister.text;
    },
  },
  methods: {
    async submitSave() {
      if (!this.content) return;
      await this.$store.dispatch("preRegister/saveText", this.content);
      this.$swal.fire("แจ้งเตือน", "บันทึกสำเร็จ", "success");
    },
    updateContent(value) {
      this.content = value;
    },
  },
};
</script>

<style></style>

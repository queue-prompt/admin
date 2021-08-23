<template>
  <div class="">
    <div class="card">
      <div class="card-header card-header-divider">Link การจอง</div>
      <div class="card-body">
        <div class="row">
          <div class="col-3">
            <img
              src="~assets/img/mockup.png"
              class="rounded img-thumbnail img-fluid"
              alt="..."
            />
            <p class="text-center">ตัวอย่างรูปหน้าแรกของระบบจองคิว</p>
          </div>
          <div class="col-9">
            <div class="">
              <h4 class="">Link สำหรับการจอง</h4>
              <div class="input-group mb-5" style="">
                <button
                  id="button-addon2"
                  class="btn btn-secondary"
                  type="button"
                  @click="copyLink('customerLink-1')"
                  style="font-size: 2rem"
                >
                  <i class="bi bi-clipboard" /> คัดลอก link
                </button>
                <input
                  id="customerLink-1"
                  :value="webLink + entityId"
                  style="font-size: 2rem"
                  type="text"
                  class="form-control"
                  readonly
                />
              </div>

              <h4 class="" style="margin-top: 60px">Link สำรอง</h4>
              <div class="input-group mb-1" style="">
                <button
                  id="button-addon2"
                  class="btn btn-secondary"
                  type="button"
                  @click="copyLink('customerLink-2')"
                >
                  <i class="bi bi-clipboard" /> link สำรอง
                </button>
                <input
                  id="customerLink-2"
                  :value="webLink2 + entityId"
                  type="text"
                  class="form-control"
                  readonly
                />
              </div>
              <span style="font-style: italic; color: gray">
                ลิงค์สำรอง : ใช้กับริชเมนู LINA-OA หรือ ในกรณีบาง platform
                ไม่สามารถรองรับลิงค์ภาษาไทย
              </span>
            </div>

            <div class="" style="margin-top: 60px">
              <h4 class="">QR CODE</h4>
              <p style="font-style: italic; color: gray">
                สามารถ Download QR-Code เพื่อในไปใช้ประกอบในรูปภาพ social media
                ได้ที่นี่
              </p>
              <button
                style="width: 250px"
                class="btn btn-lg btn-primary"
                @click="downloadQRImage"
              >
                Download QR-CODE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Publish",
  computed: {
    ...mapState({
      webLink: state => state.publish.webLink,
      webLink2: state => state.publish.webLink2,
      entityId: state => state.user.entityId
    })
  },
  methods: {
    downloadQRImage() {
      this.$store.dispatch("publish/downloadQrImage");
    },
    copyLink(id) {
      const link = document.getElementById(id);
      link.select();
      document.execCommand("copy");
      this.$store.dispatch("appState/toggleNotification", {
        content: "copied",
        type: "success",
        delay: 2000
      });
    }
  }
};
</script>

<style>
.image {
  width: 200px;
  height: 200px;
}
</style>

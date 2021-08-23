
<template>
  <div>
    <div class="div">
      <div class="card">
        <form @submit.prevent="updateInfo">
          <div class="card-header card-header-divider">
            ข้อมูลองค์กร

            <button
              class="btn btn-space btn-primary float-right"
              style="width: 120px"
              type="submit"
            >
              Save
            </button>
          </div>
          <div class="card-body">
            <div class="form-group row">
              <label
                class="col-12 col-sm-3 col-form-label text-sm-right"
                for="logo"
                >โลโก้</label
              >
              <div class="col-12 col-sm-8 col-lg-6">
                <div id="logo" class="d-flex">
                  <img
                    v-if="form.image"
                    id="previewImage"
                    :src="form.image"
                    alt="logo image"
                    class="img-fluid me-3"
                    style="height: 80px"
                  />

                  <input
                    id="logoUpload"
                    style="width: 300px"
                    class="form-control"
                    type="file"
                    accept="image/jpeg, image/png"
                    @change="inputImage"
                  />
                  <br />
                </div>
                <button
                  @click="removeLogo"
                  class="btn btn-link btn-sm"
                  v-if="form.image"
                >
                  Remove logo
                </button>
              </div>
            </div>

            <div class="form-group row">
              <label
                class="col-12 col-sm-3 col-form-label text-sm-right"
                for="inputText3"
                >ชื่อ (องค์กร)</label
              >
              <div class="col-12 col-sm-8 col-lg-6">
                <input
                  class="form-control"
                  v-model="form.organization"
                  type="text"
                />
              </div>
            </div>

            <div class="form-group row">
              <label
                class="col-12 col-sm-3 col-form-label text-sm-right"
                for="inputTextarea3"
                >ที่อยู่</label
              >
              <div class="col-12 col-sm-8 col-lg-6">
                <textarea
                  class="form-control"
                  v-model="form.location.address"
                  id="inputTextarea3"
                ></textarea>
              </div>
            </div>

            <div class="form-group row pt-1 pb-1">
              <label class="col-12 col-sm-3 col-form-label text-sm-right"
                >ประเภทบริการ</label
              >
              <div class="col-12 col-sm-8 col-lg-6 form-check mt-1">
                <label
                  v-for="(choice, $choiceIndex) in radioChoice"
                  :key="$choiceIndex"
                  class="custom-control custom-radio"
                >
                  <template v-if="choice.value == 'other'">
                    <input
                      class="custom-control-input"
                      type="radio"
                      name="type"
                      :value="choice.value"
                      :checked="choice.value === selectedChoice ? true : false"
                      @change="selectType"
                    /><span class="custom-control-label">{{
                      choice.text
                    }}</span>
                    <input
                      :readonly="selectedChoice === 'other' ? false : true"
                      type="text"
                      required
                      :value="optionalChoiceValue"
                      @change="(e) => (optionalChoiceValue = e.target.value)"
                    />
                  </template>
                  <template v-else>
                    <input
                      class="custom-control-input"
                      type="radio"
                      name="type"
                      :value="choice.value"
                      :checked="choice.value === selectedChoice ? true : false"
                      @change="selectType"
                    /><span class="custom-control-label">{{
                      choice.text
                    }}</span>
                  </template>
                </label>
              </div>
            </div>

            <div class="form-group row">
              <label
                class="col-12 col-sm-3 col-form-label text-sm-right"
                for="inputText3"
                >ค่าใช้จ่าย (บาท)</label
              >
              <div class="col-12 col-sm-8 col-lg-6">
                <input class="form-control" v-model="form.price" type="text" />
                <span class="card-subtitle"
                  >ผู้มาใช้บริการจะชำระโดยตรงกับหน่วยงานโดยตรงในวันมาใช้บริการ,
                  หากไม่มีค่าใช้จ่ายให้ใส่ 0
                </span>
              </div>
            </div>
          </div>

          <!-- ช่วง 2  -->
          <div class="card-header card-header-divider">
            ช่องทางการติดต่อ(สำหรับประชาชน)
          </div>
          <div class="card-body">
            <form>
              <div class="form-group row">
                <label
                  class="col-12 col-sm-3 col-form-label text-sm-right"
                  for="inputText3"
                  >เบอร์ติดต่อ</label
                >
                <div class="col-12 col-sm-8 col-lg-6">
                  <input
                    class="form-control"
                    v-model="form.citizenContact.phone"
                    type="text"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label
                  class="col-12 col-sm-3 col-form-label text-sm-right"
                  for="inputText3"
                  >Website</label
                >
                <div class="col-12 col-sm-8 col-lg-6">
                  <input
                    class="form-control"
                    v-model="form.citizenContact.website"
                    type="text"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label
                  class="col-12 col-sm-3 col-form-label text-sm-right"
                  for="inputText3"
                  >Line ID</label
                >
                <div class="col-12 col-sm-8 col-lg-6">
                  <input
                    class="form-control"
                    v-model="form.citizenContact.lineId"
                    type="text"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label
                  class="col-12 col-sm-3 col-form-label text-sm-right"
                  for="inputText3"
                  >Facebook</label
                >
                <div class="col-12 col-sm-8 col-lg-6">
                  <input
                    class="form-control"
                    v-model="form.citizenContact.facebook"
                    type="text"
                  />
                </div>
              </div>
            </form>
          </div>

          <!-- section3 -->
          <div class="card-header card-header-divider">
            ช่องทางการติดต่อ (สำหรับ Support ระบบ)
            <span class="card-subtitle"
              >ทางทีมงาน คิวพร้อม.com ใช้ติดต่อเพื่อแจ้งอัพเดตระบบ</span
            >
          </div>
          <div class="card-body">
            <div class="form-group row">
              <label
                class="col-12 col-sm-3 col-form-label text-sm-right"
                for="inputText3"
                >เบอร์โทร</label
              >
              <div class="col-12 col-sm-8 col-lg-6">
                <input
                  class="form-control"
                  v-model="form.adminContact.phone"
                  type="text"
                />
              </div>
            </div>

            <div class="card-body">
              <div class="form-group row">
                <label
                  class="col-12 col-sm-3 col-form-label text-sm-right"
                  for="inputText3"
                >
                </label>
                <div class="col-12 col-sm-8 p-0 col-lg-6">
                  <button
                    class="btn btn-space btn-lg btn-primary"
                    style="width: 120px"
                    type="submit"
                  >
                    Save
                  </button>
                  <button
                    @click="cancelForm"
                    class="btn btn-space btn-lg btn-secondary"
                    style="width: 120px"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Entity",
  data() {
    return {
      form: {
        organization: "",
        location: { address: ""},
        image: null,
        type: null,
        price: "",
        adminContact: {
          name: "",
          phone: "",
          alt: "",
        },
        citizenContact: {
          phone: "",
          website: "",
          lineId: "",
          facebook: "",
          email: "",
        },
      },
      imageFile: null,
      selectedChoice: null,
      optionalChoiceValue: null,
      adminContactPart: [
        { text: "ชื่อ", value: "name", type: "text" },
        { text: "เบอร์โทร", value: "phone", type: "text" },
        { text: "สำรอง", value: "alt", type: "text" },
      ],
      citizenContactPart: [
        { text: "เบอร์โทร", value: "phone", type: "text" },
        { text: "เว็ปไซต์", value: "website", type: "text" },
        { text: "line Id", value: "lineId", type: "text" },
        { text: "facebook", value: "facebook", type: "text" },
        { text: "email", value: "email", type: "email" },
      ],
      radioChoice: [
        { text: "จองตรวจโควิด", value: "100" },
        { text: "จองฉีดวัคซีน", value: "200" },
        { text: "อื่นๆโปรดระบุ", value: "other" },
      ],
    };
  },
  mounted() {
    this.setFormValue(this.userData);
  },
  watch: {
    userData: {
      handler(newValue) {
        this.setFormValue(newValue);
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      userData: (state) => state.user,
    }),
  },
  methods: {
    updateInfo() {
      const updatePayload = this.createUpdatePayload();

      this.$store.dispatch("user/updateUserInfo", updatePayload);
    },
    removeLogo() {
      this.form.image = null;
      this.imageFile = null;
      this.$store.dispatch("user/updateUserInfo", { image: null });
    },
    selectType(event) {
      const value = event.target.value;
      this.selectedChoice = value;
      if (value === "other") {
        this.form.type = "";
      } else {
        this.form.type = value;
        this.optionalChoiceValue = null;
      }
    },
    async setFormValue(formValue) {
      const localForm = {...formValue}
      const { organization, image = null, price, type, location } = localForm;
      if (type) {
        if (type === "100" || type === "200") {
          this.selectedChoice = type;
          this.optionalChoiceValue = null;
        } else {
          this.optionalChoiceValue = type;
          this.selectedChoice = "other";
        }
      }
      const adminContact = { ...formValue.adminContact };
      const citizenContact = { ...formValue.citizenContact };
      this.form = {
        ...this.form,
        organization,
        type,
        image,
        price,
        location:{...location},
        adminContact,
        citizenContact,
      };
    },
    inputImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.form.image = reader.result;
      };
      reader.readAsDataURL(file);
      this.imageFile = file;
      alert("กด Submit เพื่อยืนยัน upload logo");
    },
    setPosition(position) {
      this.form.location.position = position;
    },
    createUpdatePayload() {
      const payload = { ...this.form };
      if (this.optionalChoiceValue) {
        payload.type = this.optionalChoiceValue;
      }
      if (this.imageFile) {
        payload.image = this.imageFile;
        this.imageFile = null;
        const uploadEle = document.getElementById('logoUpload')
        uploadEle.value = null
      }
      return payload;
    },
    cancelForm() {
      window.location.reload();
    },
  },
};
</script>

<style></style>

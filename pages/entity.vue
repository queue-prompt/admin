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
                for="inputText3"
              >
                รูปแบบการเปิดจอง
              </label>
              <div
                class="col-12 col-sm-8 col-lg-6 form-check mt-1"
                style="max-width: 400px"
              >
                <label
                  v-for="(choice, $choiceIndex) in reserveChoice"
                  :key="$choiceIndex"
                  class="custom-control custom-radio"
                >
                  <template v-if="choice.value === 0">
                    <input
                      class="custom-control-input"
                      type="radio"
                      name="reserve"
                      :value="choice.value"
                      :checked="
                        choice.value === selectedReserveChoice ? true : false
                      "
                      @change="selectReserveChoice"
                    /><span class="custom-control-label">{{
                      choice.text
                    }}</span>
                    <div class="mt-2" v-show="selectedReserveChoice === 0">
                      <input
                        style="
                          width: 50%;
                          padding: 5px;
                          border: 1px solid #bdc0c7;
                        "
                        :readonly="selectedReserveChoice === 0 ? false : true"
                        type="number"
                        placeholder="วัน"
                        required
                        :value="reserveChoiceValue"
                        @change="(e) => (reserveChoiceValue = e.target.value)"
                        @input="validateReserveValue"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <input
                      class="custom-control-input"
                      type="radio"
                      name="reserve"
                      :value="choice.value"
                      :checked="
                        choice.value === selectedReserveChoice ? true : false
                      "
                      @change="selectReserveChoice"
                    />
                    <span class="custom-control-label">
                      {{ choice.text }}
                    </span>

                    <div class="mt-2" v-show="selectedReserveChoice === 1">
                      <div class="form-group-row">
                        <label
                          class="col-12 col-sm-3 col-form-label"
                          for="inputText3"
                        >
                          วันที่เริ่มเปิดให้จอง
                        </label>
                        <div class="col-12 col-sm-8 col-lg-6 mt-1">
                          <div>
                            <input type="text" v-model="form.reserveDate"/>
                            <p class="mt-0" style="color: #ea2a04;">
                              <span >*</span> 
                              <span>Format: YYYY-MM-DD </span>
                              <span class="ml-3">เช่น &nbsp;&nbsp;  2023-03-10</span>
                            </p>
                          </div>
                          <!-- <v-date-picker
                            :masks="masks"
                            v-model="date"
                            transition="none"
                            mode="date"
                          >
                            <template #default="{ inputValue, togglePopover }">                              
                              <input
                                type="text"
                                style="padding: 5px; border: 1px solid #bdc0c7"
                                :value="inputValue"
                                @click.stop="
                                  togglePopover({
                                    placement: 'bottom',
                                    showDelay: 0,
                                    hideDelay: 0,
                                  })
                                "
                              />
                            </template>
                          </v-date-picker> -->


                        </div>
                      </div>

                      <div class="form-group-row">
                        <label class="col-sm-3 col-form-label" for="inputText3">
                          เวลา
                        </label>
                        <div class="col-12 col-sm-8 col-lg-6 mt-1">
                          <v-date-picker mode="time" v-model="date" is24hr>
                            <template #default="{ inputValue, togglePopover }">
                              <input
                                type="text"
                                style="padding: 5px; border: 1px solid #bdc0c7"
                                :value="inputValue"
                                @click.stop="
                                  togglePopover({
                                    placement: 'bottom',
                                    showDelay: 0,
                                    hideDelay: 0,
                                  })
                                "
                              />
                            </template>
                          </v-date-picker>
                        </div>
                      </div>
                    </div>
                  </template>
                </label>
              </div>
            </div>

            <div class="form-group row pt-1 pb-1">
              <label class="col-12 col-sm-3 col-form-label text-sm-right"
                >รูปแบบการยืนยันตัวตน</label
              >
              <div
                class="col-12 col-sm-8 col-lg-6 form-check mt-1"
                style="max-width: 350px"
              >
                <label class="custom-control custom-radio">
                  <input
                    @change="selectIdentityChoice"
                    class="custom-control-input"
                    type="radio"
                    name="identity"
                    :value="0"
                    :checked="
                      selectedIdentityChoice === 0 ? true : false
                    "
                  />
                  <span class="custom-control-label">เลขบัตรประชาชน</span>
                </label>
                <label class="custom-control custom-radio">
                  <input
                    @change="selectIdentityChoice"
                    class="custom-control-input"
                    type="radio"
                    name="identity"
                    value="other"
                    :checked="
                      selectedIdentityChoice === 'other' ? true : false
                    "
                  />
                  <span class="custom-control-label">กำหนดชื่อบริการเอง</span>
                  <div v-if="selectedIdentityChoice!==0" class="mt-2">
                    <input
                      style="
                        width: 100%;
                        padding: 5px;
                        border: 1px solid #bdc0c7;
                      "
                      placeholder="Passsport No., รหัสสมาชิก, เลขบัตรประจำตัวคนต่างดาว"
                      :value="identityChoiceValue"
                      @change="(e) => (identityChoiceValue = e.target.value)"
                      type="text"
                      required
                    />
                  </div>
                </label>
              </div>
            </div>

            <div class="form-group row pt-1 pb-1">
              <label class="col-12 col-sm-3 col-form-label text-sm-right"
                >ประเภทบริการ</label
              >
              <div
                class="col-12 col-sm-8 col-lg-6 form-check mt-1"
                style="max-width: 350px"
              >
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
                      :checked="
                        choice.value === selectedOptionalChoice ? true : false
                      "
                      @change="selectType"
                    /><span class="custom-control-label">{{
                      choice.text
                    }}</span>

                    <div
                      class="mt-2"
                      v-show="selectedOptionalChoice == 'other'"
                    >
                      <input
                        style="
                          width: 50%;
                          padding: 5px;
                          border: 1px solid #bdc0c7;
                        "
                        :readonly="
                          selectedOptionalChoice === 'other' ? false : true
                        "
                        type="text"
                        required
                        :value="optionalChoiceValue"
                        @change="(e) => (optionalChoiceValue = e.target.value)"
                      />
                    </div>
                  </template>

                  <template v-else>
                    <input
                      class="custom-control-input"
                      type="radio"
                      name="type"
                      :value="choice.value"
                      :checked="
                        choice.value === selectedOptionalChoice ? true : false
                      "
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
                <span class="card-subtitle mt-2">
                  ผู้มาใช้บริการจะชำระโดยตรงกับหน่วยงานโดยตรงในวันมาใช้บริการ,
                  หากไม่มีค่าใช้จ่ายให้ใส่ 0
                </span>
              </div>
            </div>
          </div>

          <!-- ช่วง 2  -->
          <div class="card-header card-header-divider">ช่องทางการติดต่อ</div>
          <div class="card-body">
            <form>
              <div class="form-group row">
                <label
                  class="col-12 col-sm-3 col-form-label text-sm-right"
                  for="inputText3"
                  >เบอร์ติดต่อ (สำหรับผู้มาใช้บริการ)</label
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
                  >เบอร์ติดต่อ (สำหรับ Support ระบบ)</label
                >
                <div class="col-12 col-sm-8 col-lg-6">
                  <input
                    class="form-control"
                    v-model="form.adminContact.phone"
                    type="text"
                  />
                  <span class="card-subtitle mt-2">
                    ทางทีมงาน คิวพร้อม.com ใช้ติดต่อเพื่อแจ้งอัพเดตระบบ
                  </span>
                </div>
              </div>
            </form>
          </div>

          <!-- section3 -->
          <div class="card-header card-header-divider">การแจ้งเตือน</div>
          <div class="card-body">
            <div class="form-group row">
              <label
                class="col-12 col-sm-3 col-form-label text-sm-right"
                for="inputText3"
                >อีเมล์แจ้งเตือน</label
              >
              <div class="col-12 col-sm-8 col-lg-6">
                <input
                  class="form-control"
                  v-model="form.citizenContact.email"
                  type="text"
                />
                <span class="card-subtitle mt-2">
                  แจ้งเตือนเมื่อ มีผู้ใช้บริการมาจองคิว
                </span>
                <span class="card-subtitle mt-2">
                  หากต้องการใส่มากกว่า 1 email สามารถใส่เครื่องหมาย "," (comma)
                </span>
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
import dayjs from "dayjs";
export default {
  name: "Entity",
  data() {
    return {
      form: {
        organization: "",
        image: null,
        type: null,
        price: 0,
        adminContact: {
          name: "",
          phone: "",
          alt: "",
        },
        citizenContact: {
          phone: "",
          // website: "",
          // lineId: "",
          // facebook: "",
          email: "",
        },
        identityType: 0,
        reserveMode: null,
        reserveValue: "",
        reserveDate: null,
        reserveTime: null,
      },
      date: dayjs().toISOString(),
      masks: {
        input: "YYYY-MM-DD",
      },
      imageFile: null,
      selectedIdentityChoice: 0,
      selectedOptionalChoice: null,
      selectedReserveChoice: null,
      identityChoiceValue: null,
      reserveChoiceValue: null,
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
        { text: "กำหนดชื่อบริการเอง", value: "other" },
        { text: "จองตรวจโควิด", value: "100" },
        { text: "จองฉีดวัคซีน", value: "200" },
      ],
      reserveChoice: [
        { text: "เปิดจองล่วงหน้าแบบจำกัดวัน(สูงสุด 14 วัน)", value: 0 },
        { text: "เปิดจองทั้งหมดพร้อมกัน", value: 1 },
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
      this.selectedOptionalChoice = value;
      this.form.type = value;
    },
    validateReserveValue(event) {
      let result;
      if (event.target.value) {
        const value = parseInt(event.target.value);
        if (value <= 0) {
          result = 1;
        } else if (value > 14) {
          result = 14;
        } else {
          result = event.target.value;
        }
      } else {
        result = null;
      }
      event.target.value = result;
    },
    selectReserveChoice(event) {
      const value = parseInt(event.target.value);
      this.selectedReserveChoice = value;
      this.form.reserveMode = value;
    },
    selectIdentityChoice(event){
      let value = event.target.value
      if(parseInt(event.target.value) === 0){
        value = parseInt(event.target.value)
      }
      this.selectedIdentityChoice = value;
      this.form.identityType = value;
    },
    async setFormValue(formValue) {
      const localForm = { ...formValue };
      const {
        organization,
        image = null,
        price,
        type,
        identityType = 0,
        reserveMode = 0,
        reserveValue = 1,
        reserveDate = null,
        reserveTime = null,
      } = localForm;
      if (type) {
        if (type === "100" || type === "200") {
          this.selectedOptionalChoice = type;
        } else {
          this.optionalChoiceValue = type;
          this.selectedOptionalChoice = "other";
        }
      }


      if(identityType !==0){
        this.selectedIdentityChoice = "other";
        this.identityChoiceValue = identityType;
      }

      if (reserveMode === 0) {
        this.reserveChoiceValue = reserveValue;
      }
      this.selectedReserveChoice = reserveMode;
      if (reserveDate && reserveTime) {
        this.date = `${reserveDate} ${reserveTime.slice(
          0,
          2
        )}:${reserveTime.slice(2, 4)}`;

        console.log('reserveDate -->', reserveDate)
        console.log('this.date --->', this.date)
      }
      const adminContact = { ...formValue.adminContact };

      const citizenContact = {
        phone: formValue.citizenContact.phone
          ? formValue.citizenContact.phone
          : "",
        email: formValue.citizenContact.email
          ? formValue.citizenContact.email
          : "",
      };

      this.form = {
        ...this.form,
        organization,
        type,
        image,
        price,
        adminContact,
        identityType,
        citizenContact,
        reserveMode,
        reserveValue,
        reserveDate,
        reserveTime,
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
    createUpdatePayload() {
      const payload = { ...this.form };
      if (payload.type === "other") {
        payload.type = this.optionalChoiceValue;
      }

      if (this.reserveChoiceValue) {
        payload.reserveValue = parseInt(this.reserveChoiceValue);
      } else {
        delete payload["reserveValue"];
      }

      if(payload.identityType === "other"){
        payload.identityType = this.identityChoiceValue;
      }
      
      payload.price = parseInt(payload.price);

      if (payload.reserveMode === 1) {
        // const date = dayjs(this.date).format("YYYY-MM-DD");
        const date = dayjs(this.form?.reserveDate).format("YYYY-MM-DD");
        const time = dayjs(this.date).format("HHmm");
        payload.reserveDate = date;
        payload.reserveTime = time;
      } else {
        delete payload["reserveDate"];
        delete payload["reserveTime"];
      }

      if (this.imageFile) {
        payload.image = this.imageFile;
        this.imageFile = null;
        const uploadEle = document.getElementById("logoUpload");
        uploadEle.value = null;
      }
      return payload;
    },
    cancelForm() {
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.vc-date {
  display: none !important;
}
</style>

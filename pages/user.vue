<template>
  <div>
    <div class="card card-border-color card-border-color-primary">
      <div class="card-header card-header-divider">ข้อมูลทั่วไป</div>
      <div class="card-body">
        <div class="form-group row">
          <label class="col-12 col-sm-3 col-form-label text-sm-right"
            >รหัสหน่วยงาน</label
          >
          <div class="col-12 col-sm-8 col-lg-6">
            <input
              class="form-control"
              disabled
              type="text"
              :value="entityId"
            />
          </div>
        </div>

        <div class="form-group row">
          <label class="col-12 col-sm-3 col-form-label text-sm-right"
            >อีเมล</label
          >
          <div class="col-12 col-sm-8 col-lg-6">
            <input class="form-control" disabled type="text" :value="email" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="changePasswordActive"
      class="card card-border-color card-border-color-primary"
    >
      <div class="card-header card-header-divider">เปลี่ยนรหัสผ่าน</div>
      <div class="card-body">
        <form
          @submit.prevent="changePassword"
          @input="validatePasswordMatching"
        >
          <div class="form-group row">
            <label
              class="col-12 col-sm-3 col-form-label text-sm-right"
              for="oldPassword"
              >รหัสผ่านเดิม</label
            >
            <div class="col-12 col-sm-8 col-lg-6">
              <input
                id="oldPassword"
                class="form-control"
                v-model="oldPassword"
                type="password"
                required
              />
            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-12 col-sm-3 col-form-label text-sm-right"
              for="newPassword"
              >รหัสผ่านใหม่</label
            >
            <div class="col-12 col-sm-8 col-lg-6">
              <input
                id="newPassword"
                class="form-control"
                v-model="newPassword"
                type="password"
                required
              />
            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-12 col-sm-3 col-form-label text-sm-right"
              for="confirmPassword"
              >ยืนยันรหัสผ่านใหม่</label
            >
            <div class="col-12 col-sm-8 col-lg-6">
              <input
                id="confirmPassword"
                class="form-control"
                v-model="confirmPassword"
                type="password"
                required
              />
            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-12 col-sm-3 col-form-label text-sm-right"
              for=""
            ></label>
            <div class="col-12 col-sm-8 col-lg-6">
              <button type="submit" class="btn btn-primary btn-xl">
                Submit change password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-body p-0">
        <button
          class="btn btn-link btn-lg btn-block btn-space"
          @click="changePasswordActive = !changePasswordActive"
        >
          Change Password / เปลี่ยนรหัสผ่าน
        </button>
        <button
          class="btn btn-link btn-lg btn-space btn-block"
          @click="signout"
        >
          SignOut / ออกจากระบบ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "User",
  data() {
    return {
      changePasswordActive: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  computed: {
    ...mapState({
      email: (state) => state.user.email,
      entityId: (state) => state.user.entityId,
    }),
  },
  methods: {
    validatePasswordMatching() {
      const newPasswordEl = document.getElementById("newPassword");
      const confirmPassEl = document.getElementById("confirmPassword");
      if (newPasswordEl.value !== confirmPassEl.value) {
        confirmPassEl.setCustomValidity("รหัสผ่านไม่ตรงกัน");
      } else {
        confirmPassEl.setCustomValidity("");
      }
    },
    clearPasswordForm() {
      this.oldPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    },
    async changePassword() {
      try {
        const payload = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        };
        await this.$store.dispatch("user/changePassword", payload);
        this.clearPasswordForm();
      } catch (error) {
        return;
      }
    },

    signout() {
      this.$store.dispatch("auth/signout");
    },
  },
};
</script>

<style></style>

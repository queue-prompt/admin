<template>
  <div class="splash-container">
    <div class="card card-border-color card-border-color-primary">
      <div class="card-header">
        <img
          class="logo-img"
          src="~assets/img/logo-xx.png"
          alt="logo"
          width="102"
          height="27"
        /><span class="splash-description"
          >Please enter your user information.</span
        >
      </div>

      <h3 class="text-center">สมัครใช้งาน</h3>
      <div class="card-body">
        <form @submit.prevent="signup" @input="validatePasswordMatching">
          <div class="mb-3">
            <label for="email" class="form-label">อีเมล</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="test@test.com"
              name="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">รหัสผ่าน</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="password"
              class="form-control"
              name="password"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">ยืนยันรหัสผ่าน</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="password"
              class="form-control"
              name="confirmPassword"
              required
            />
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-xl btn-primary btn-block">
              Submit
            </button>

            <NuxtLink to="/login">
              <button
                type="submit"
                class="btn my-3 btn-xl btn-secondary btn-block"
              >
                ย้อนกลับ
              </button>
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Signup",
  data() {
    return {
      form: {
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    signup() {
      this.$store.dispatch("user/signup", this.form);
    },
    validatePasswordMatching() {
      const passwordEl = document.getElementById("password");
      const confirmPassEl = document.getElementById("confirmPassword");
      if (passwordEl.value !== confirmPassEl.value) {
        confirmPassEl.setCustomValidity("รหัสผ่านไม่ตรงกัน");
      } else {
        confirmPassEl.setCustomValidity("");
      }
    },
  },
};
</script>

<style></style>

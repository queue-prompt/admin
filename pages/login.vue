<template>
  <div class="splash-container" style="">
    <div>
      <div class="card card-border-color card-border-color-primary">
        <div class="card-header">
          <img
            class="logo-img"
            src="~assets/img/logo-xx.png"
            alt="logo"
            width="102"
            height="27"
          /><span class="splash-description"
            >Please enter your login information.</span
          >
          <h3 class="text-center">เข้าสู่ระบบ</h3>
        </div>
        <div class="card-body">
          <form v-if="!isForgetPassword" @submit.prevent="signin">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="password"
                class="form-control"
                required
              />
            </div>
            <div class="row" style="margin-bottom: 20px">
              <div class="col">
                <a @click="() => isForgetPassword = true" href="#"
                  >ลืมรหัสผ่าน?</a
                >
              </div>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-xl btn-primary btn-block">
                Login
              </button>

              <NuxtLink to="/signup">
                <button
                  type="submit"
                  class="btn my-3 btn-xl btn-secondary btn-block"
                >
                  สมัครใช้งาน
                </button>
              </NuxtLink>
            </div>
          </form>
          <form v-else @submit.prevent="sendEmailResetPassword">
            <input
              id="reset-email"
              v-model="forgetPassword.email"
              type="email"
              class="form-control"
              placeholder="email"
              required
            />
            <div class="row" style="margin-top: 20px; margin-bottom: 20px">
              <div class="col">
                <a href="#" @click="backTologin"
                  >กลับหน้า Login</a
                >
              </div>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary btn-block">
                send email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isForgetPassword: false,
      forgetPassword:{
        email:""
      },
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    signin() {
      this.$store.dispatch("user/signin", this.form);
    },
    backTologin(){
      this.forgetPassword = '';
      this.isForgetPassword = false
    },
    async sendEmailResetPassword() {
      await this.$store.dispatch("user/resetPassword", this.forgetPassword.email);
      this.backTologin()
    },
  },
};
</script>

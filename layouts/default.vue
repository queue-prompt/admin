<template>
  <div class="be-wrapper">
    <template v-if="$device.isDesktopOrTablet">
      <template v-if="screenWidth >= 1024">
        <template v-if="state === 1">
          <TopNavbar />
          <SubNavBar />
          <div class="pb-3">
            <div class="main-content container">
              <Nuxt />
            </div>
          </div>
          <loading />
        </template>

        <template v-else-if="state === 2">
          <!-- <h1 class="text-center">Redirect to Login page...</h1> -->
          <div style="margin-top: -60px" class="">
            <Nuxt />
          </div>
        </template>

        <template v-else-if="state === -1">
          <h1 class="text-center">Redirect to Login page...</h1>
        </template>

        <template v-else>
          <h1 class="text-center">คิวพร้อม.com</h1>
          <h1 class="text-center">Loading...</h1>
        </template>
      </template>

      <!-- tablet width<1024px -->
      <template v-else>
        <div class="centerElement">
          <div class="text-center">
            <img
              src="~/assets/img/rotate-device.png"
              style="width:400px;height:400px;"
            />
          </div>
          <h1 class="text-center">ระบบ Admin รองรับเฉพาะการใช้งานในแนวนอน</h1>
          <h4 class="text-center">โปรดหมุน Tablet ของท่านในแนวนอน</h4>
        </div>
      </template>
    </template>

    <!-- on other device -->
    <template v-else>
      <div class="centerElement">
        <div class="text-center">
          <img
            src="~/assets/img/logo-transparent.png"
            style="width:400px;width:400px"
          />
        </div>
        <div class="text-center">
          <h1>ระบบ Admin รองรับเฉพาะ Desktop หรือ Tablet</h1>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TopNavbar from "../components/TopNavbar.vue";
import Loading from "../components/loading.vue";
import SubNavBar from "../components/SubNavBar.vue";
export default {
  data() {
    return {
      screenWidth: window.innerWidth
    };
  },
  computed: {
    state() {
      let { user, loadComplete, isSignout } = this.$store.state.auth;

      if (isSignout === -1) {
        return -1;
      }

      if (user) {
        return 1;
      } else if (user === null && loadComplete == true) {
        return 2;
      } else {
        return 0;
      }
    }
  },
  components: {
    TopNavbar,
    SubNavBar,
    Loading
  },
  mounted() {
    window.addEventListener("resize", this.onResizeScreen.bind(this), true);
    window.onorientationchange = this.onResizeScreen;
    this.$store.dispatch("auth/onAuthChange");
  },
  methods: {
    onResizeScreen() {
      this.screenWidth = window.innerWidth;
    }
  }
};
</script>

<style>
html,
body,
#__nuxt,
#__layout {
  height: 100% !important;
  width: 100% !important;
  margin: 0;
  padding: 0;
}

.alert .message {
  color: black;
}

.centerElement {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

<template>
  <nav class="navbar navbar-expand fixed-top be-top-header">
    <div class="container-fluid">
      <div class="be-navbar-header">
        <img src="~assets/img/logo.png" class="img pe-3" />
      </div>
      <div id="be-navbar-collapse" class="navbar-collapse collapse">
        <ul class="navbar-nav">
          <li
            v-for="(page, $pageIndex) in pages"
            :key="$pageIndex"
            class="nav-item"
          >
            <NuxtLink
              class="nav-link"
              :class="[isActiveClass(page)]"
              :to="{ name: page.to }"
            >
              {{ page.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="be-right-navbar">
        <ul class="nav navbar-nav float-right be-icons-nav me-0">
          <li class="nav-item icon">
            <div class="">
              <SwitchLabel
                label="เปิดจองระบบทั้งหมด"
                @statusChange="toggleActive"
                :status="active"
              ></SwitchLabel>
            </div>
          </li>

          <!-- Users -->
          <li class="nav-item icon" style="margin-top: 8px">
            <NuxtLink class="nav-link user-flex" to="/user">
              <span class="mdi mdi-account-o" style="font-size: 2rem"></span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import SwitchLabel from "./Switch.vue";
import _ from "lodash";
import { mapState } from "vuex";
export default {
  name: "TopNavbar",
  computed: {
    ...mapState({
      user:(state) => state.auth.user,
      entityId: (state) => state.user.entityId,
      active: (state) => state.user.active,
      email: (state) => state.user.email,
    }),
    currentPath(){
      return this.$route.name
    },
    pages() {
      const allPage = [
        { name: "Home", to: "home", auth: true },
        { name: "หน่วยงาน", to: "entity", auth: true },
        { name: "ข้อมูลบริการ", to: "pre-register", auth: true },
        { name: "ตารางคิว", to: "timeslots-view", auth: true },
        { name: "รายงาน", to: "report", auth: true },
        { name: "การจอง", to: "publish", auth: true },
        { name: "SIGU UP", to: "signup", auth: false },
      ];
      if (this.entityId) {
        return allPage.filter((page) => page.auth);
      } else {
        return allPage.filter((page) => !page.auth);
      }
    },
  },
  components: {
    SwitchLabel,
  },
  mounted() {
    const entityId = this.$route.query.entityId
    if(this.user && entityId){
      this.$store.dispatch("user/init",entityId);
    }else{
      this.$store.dispatch("user/init");
    }
  },
  methods: {
    async toggleActive(value) {
      const active = value;
      await this.$store.dispatch("user/updateUserInfo", { active });
      const notification = {
        content: "",
        type: "success",
        delay: 3000,
      };
      if (active) {
        notification.content = "เปิดระบบ สำเร็จ";
      } else {
        notification.content = "ปิดระบบ สำเร็จ";
      }
      this.$store.dispatch("appState/toggleNotification", notification);
    },
    signout() {
      this.$store.dispatch("auth/signout");
    },
    isActiveClass(page) {
      return page.to == this.currentPath ? "nav-tab-active" : "";
    }
  },
};
</script>

<style>
.user-flex {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.be-top-header .be-navbar-header {
  display: flex;
  width: auto;
  flex: 0;
}

.be-top-header .navbar-nav > li > a.nav-link {
  padding: 0px 12px;
}

.nav-link.active {
  border-bottom: 3px solid rgb(66, 133, 244);
}
.nav-tab-active {
  border-bottom: 3px solid rgb(66, 133, 244);
}
</style>

.<template>
  <nav
    v-if="userId && name && email"
    class="navbar navbar-expand-md be-sub-navigation"
  >
    <div class="navbar-collapse collapse justify-content-between align-items-center container" style="padding: 0 25px;" id="be-sub-navigation-collapse">
      <ul class="navbar-nav">
        <li class="nav-item">
          <NuxtLink to="/user" class="nav-link pl-0">
            <span class="mx-1">{{ name }}</span>
            <span class="mx-1"> | </span>
            <span class="mx-1">{{ email }}</span>
            <span class="mx-1"> | </span>
            <span class="mx-1">{{ `ID: ${entityId}` }}</span>
          </NuxtLink>
        </li>
      </ul>
      <div>
        <p class="mb-0" style="font-size: 1.2rem;">Support Tel : 063-048-4510</p>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    email() {
      return this.$store.state.user.email;
    },
    userId() {
      return this.$store.state.auth.user;
    },
    name() {
      return this.$store.state.user.organization;
    },
    entityId() {
      return this.$store.state.user.entityId;
    }
  }
}
</script>

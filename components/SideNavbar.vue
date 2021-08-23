<template>
  <div id="sideNavbar">
    <ul>
      <li
        v-for="(menu, index) in menus"
        :key="index"
      >
        <NuxtLink :to="menu.path">
          {{ menu.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      default: () => {
        return [
          { name: 'test1', path: '' },
          { name: 'test2', path: '' },
          { name: 'test3', path: '' }
        ]
      },
      require: true
    }
  }
}
</script>

<style scoped>
div#sideNavbar {
  height: 100vh;
  padding: 30px;
  width: 18%;
  background-color: #e8e8e8;
}

div#sideNavbar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

div#sideNavbar ul li {
  margin: 16px 0;
}

div#sideNavbar ul li a {
  text-decoration: none;
  color: #000;
}

div#sideNavbar ul li a:hover {
  color: blue;
}
</style>

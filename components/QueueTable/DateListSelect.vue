<template>
  <div class="div">
    <div class="list-group d-flex">
      <a
        href="#"
        class="list-group-item d-flex list-group-item-action p-2"
        v-for="val in dateList"
        :key="val"
        :id="val"
        :class="val === clickDate ? 'active' : ''"
        @click="submitSelectRow(val, createdDateHolder[val])"
      >
        <span class="text">
          {{ val | dateDisplay }}

          <span v-if="val === todayDate" class="badge badge-success mr-2"
            >วันนี้</span
          >
        </span>

        <span
          v-if="
            createdDateHolder[val] &&
            createdDateHolder[val].open > 0 &&
            createdDateHolder[val].active !== false
          "
          class="badge badge-secondary"
        >
          รับ {{ createdDateHolder[val] && createdDateHolder[val].open }} คิว
        </span>

        <span
          v-if="
            createdDateHolder[val] && createdDateHolder[val].active === false
          "
          class="badge badge-danger"
        >
          ปิดระบบไว้
        </span>
      </a>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";

export default {
  props: {
    createdDate: {
      type: Object,
      default: () => {
        return {
          "YYYY-MM-DD": {
            open: 0,
            reserve: 0,
            active: true,
          },
        };
      },
    },
    clickDate: {
      type: String,
    },
    pickMonth: {
      type: String,
    },
  },
  data() {
    return {
      todayDate: moment().format("YYYY-MM-DD"),
    };
  },
  filters: {
    dateDisplay(yyyymmdd) {
      return moment(yyyymmdd).format("DD/MM/YYYY");
    },
  },
  computed: {
    createdDateHolder() {
      return this.createdDate;
    },
    dateList() {
      let m = this.pickMonth;
      let dateCounts = moment(m, "YYYY-MM-DD").endOf("month").get("date");
      let res = [];

      for (let index = 0; index < dateCounts; index++) {
        let [yyyy, mm, dd] = m.split("-");
        dd = _.padStart((index + 1).toString(), 2, "0");
        let date = `${yyyy}-${mm}-${dd}`;
        res.push(date);
      }

      let today = moment().format("YYYY-MM-DD");
      return _.filter(res, (v) => v >= today);
    },
  },
  methods: {
    submitSelectRow(date, val) {
      const row = {
        ...val,
        date,
      };
      this.$emit("submitSelectRow", row);
    }
  },
};
</script>

<style>
.badge {
  font-size: 0.9rem;
}

.list-group-item + .list-group-item.active:hover {
  color: white;
}
</style>

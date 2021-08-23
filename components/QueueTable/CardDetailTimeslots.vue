<template>
  <div
    id="cardTimeslots"
    class="card-custom-timeslots bg-white text-center m-0"
  >
    <hr />

    <div class="row justify-content-around">
      <div class="col-2">รอบที่</div>
      <div class="col-4">เริ่มเวลา</div>
      <div class="col-2">เปิดรับ</div>
      <div class="col-2">ผู้ลงทะเบียน</div>
      <div class="col-2">คงเหลือ</div>
    </div>

    <hr />

    <div
      v-for="(row, index) in rowsTime"
      :key="index"
      class="row justify-content-around mt-2"
    >
      <div class="col-2">
        {{ index + 1 }}
      </div>
      <div class="col-4">{{ row.start }} - {{ row.end }}</div>
      <div class="col-2">
        {{ row.limit }}
      </div>
      <div class="col-2">
        {{ row.reserve }}
      </div>
      <div class="col-2">
        {{ row.limit - row.reserve }}
      </div>
    </div>
    <div v-if="rowsTime.length == 0" class="text-center mt-4">
      <h4>ไม่พบข้อมูล</h4>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { timeHolderTransformToRowsTime } from "../../utility/functions/queueTableTransform";

export default {
  props: {
    timeslotHolder: {
      type: Object,
      default: () => {
        return {};
      },
      require: true,
    },
  },
  data() {
    return {
      rowsTime: [],
    };
  },
  computed: {
    sumQuota() {
      return _.reduce(
        this.rowsTime,
        (acc, row) => {
          let totalLimit = acc.totalLimit || 0;
          let totalReserve = acc.totalReserve || 0;
          let totalRemaining = acc.totalRemaining || 0;
          return {
            totalLimit: (totalLimit += row.limit),
            totalReserve: (totalReserve += row.reserve),
            totalRemaining: (totalRemaining += row.limit - row.reserve),
          };
        },
        {}
      );
    },
  },
  watch: {
    timeslotHolder(timeslotHolder) {
      this.setRowsTime(timeslotHolder);
    },
  },
  created() {
    this.setRowsTime(this.timeslotHolder);
  },
  methods: {
    setRowsTime(timeslotHolder) {
      const rowsTime = timeHolderTransformToRowsTime(timeslotHolder);
      const sort = _.orderBy(rowsTime, "start", "asc");
      this.rowsTime = sort;
    },
  },
};
</script>

<style scoped>
</style>

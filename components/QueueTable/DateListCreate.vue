<template>
  <div class="row">
    <div class="col-2"> </div>
    <div class="col-8">
      <div class="calendar mb-5 pb-5">
        <header class="text-left">
          <span class="mr-5">เลือกเดือน</span>
          <button
            class="btn btn-space btn-secondary hover"
            :class="{ active: m == selectedMonth }"
            v-for="(m, index) in monthList"
            :key="index"
            @click="changeMonth(m)"
          >
            {{ index == 0 ? 'เดือนนี้' : 'เดือนหน้า' }}
          </button>
        </header>

        <ul class="weekdays">
          <li>
            <abbr title="S">Sun</abbr>
          </li>
          <li>
            <abbr title="M">Mon</abbr>
          </li>
          <li>
            <abbr title="T">Tue</abbr>
          </li>
          <li>
            <abbr title="W">Wed</abbr>
          </li>
          <li>
            <abbr title="T">Thu</abbr>
          </li>
          <li>
            <abbr title="F">Fri</abbr>
          </li>
          <li>
            <abbr title="S">Sat</abbr>
          </li>
        </ul>

        <ol class="day-grid">
          <li v-for="d in startDay" :key="d"></li>

          <li
            :class="[genClass(d)]"
            v-for="d in daysLength"
            :key="d"
            @click="clickDate(d)"
          >
            <p class="text">{{ displayDate(d) }}</p>
            <p class="open" v-if="createdDate[d]">({{ createdDate[d] }})</p>
            <p class="selected" v-if="tmpDate[d]">
              <span class="mdi mdi-check"></span>
            </p>
            <p v-if="!createdDate[d] && !tmpDate[d] && d > today" class="free">ว่าง</p>
          </li>
        </ol>
      </div>
    </div>
    <div class="col-2"></div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
export default {
  props: {
    rowsDate: {
      type: Array,
      default: () => {
        return [{ checkbox: false, date: moment().toISOString() }];
      },
      require: true,
    },
    tmpDate: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      startDay: _.range(0, 2),
      daysLength: [],
      rowsDateData: [],
      monthList: [moment().format('YYYY-MM'), moment().add({ months: 1 }).format('YYYY-MM')],

      selectedDate: {},
      selectedMonth: "",
      today: moment().format('YYYY-MM-DD')
    };
  },
  mounted() {
    this.changeMonth(this.monthList[0]);
  },
  computed: {
    createdDate() {
      let holder = _.reduce(
        this.$store.state.queueTable.createdDate,
        (acc, dataObj, date) => {
          acc[date] = dataObj.open;
          return acc;
        },
        {}
      );

      return holder;
    },
  },
  watch: {
    rows(val) {
      this.rowsDateData = val;
    },
  },
  created() {
    if (this.rowsDate) {
      this.rowsDateData = this.rowsDate;
    }
  },
  methods: {
    computeCalendar(month) {
      this.daysLength = [];
      let offsetDays = moment(month, "YYYY-MM").startOf("month").days();
      this.startDay = _.range(0, offsetDays);

      let dateInMonth = moment(month, "YYYY-MM").endOf("month").date();
      let m = moment(month, "YYYY-MM").startOf("month");
      _.times(dateInMonth, (i) => {
        this.daysLength.push(m.format("YYYY-MM-DD"));
        m.add(1, "day");
      });
    },

    clickDate(date) {
      //validate
      const today = moment().format("YYYY-MM-DD")

      // is past
      if (today > date) {
        return this.$swal(
          'แจ้งเตือน',
          `ไม่สามารถเลือกวันในอดีตได้`,
          'error'
        )
      }

      if (today == date) {
        return this.$swal(
          'แจ้งเตือน',
          'ไม่สามารถเลือกวันนี้ได้กรุณาเลือกวันล่วงหน้า 1 วัน',
          'error'
        )
      }

      // is crearted
      if (this.createdDate[date]) {
        return this.$swal(
          'แจ้งเตือน',
          `วันที่ ${date} ได้มีการสร้างไว้แล้ว`,
          'error'
        )
      }

      this.$emit("click_date", date);
    },

    changeMonth(month) {
      this.selectedMonth = month;
      this.computeCalendar(month);
    },

    displayDate(yyyymmdd) {
      let s = yyyymmdd.substring(8, 10);
      return parseInt(s);
    },

    genClass(yyyymmdd) {
      const { today } = this
      return {
        past: today > yyyymmdd,
        selected: this.tmpDate[yyyymmdd],
        open: this.createdDate[yyyymmdd],
        today: today == yyyymmdd,
        free: !this.createdDate[yyyymmdd] && !this.tmpDate[yyyymmdd] && yyyymmdd > today
      }
    },
  },
};
</script>

<style scoped>
/* new cal */
header {
  display: flex;
  align-items: center;
  font-size: calc(16px + (26 - 16) * ((100vw - 300px) / (1600 - 300)));
  justify-content: center;
  min-height: 6vh;
  text-align: center;
}

ul,
ol {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 0.2em;
  margin: 0 auto;
  max-width: 64em;
  padding: 0;
}

li {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin-left: 0;
  font-size: calc(16px + (21 - 16) * ((100vw - 300px) / (1600 - 300)));
}

ul.weekdays li {
  height: 4vw;
}

ol.day-grid li {
  background-color: #eaeaea;
  border: 1px solid #eaeaea;
  height: 6vw;
  max-height: 125px;
  cursor: pointer !important;
}

ol.day-grid li:hover {
  background-color: #d0cfcf;
  border: 1px solid #eaeaea;
}

ol.day-grid li.selected {
  background: turquoise;
}

ol.day-grid li.past {
  background-color: #eaeaea;
  cursor: not-allowed !important;
}

ol.day-grid li.open {
  background-color: #fbbc05;
  cursor: not-allowed !important;
}

ol.day-grid li.free {
  background-color: #fff;
}

ol.day-grid li.today {
  cursor: not-allowed !important;
}

ul.weekdays abbr[title] {
  border: none;
  font-weight: 800;
  text-decoration: none;
}

p.text {
  position: absolute;
}

p.open {
  position: relative;
  top: 25px;
  font-size: 0.95rem;
  color: #666;
}

p.free {
  position: relative;
  top: 25px;
  font-size: 0.95rem;
  color: #666;
}

p.selected {
  position: relative;
  top: 25px;
}

li.today > p.text {
  background-color: #e42323;
  color: #fff;
  border-radius: 100%;
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  margin: 0;
}

@media all and (max-width: 800px) {
  ul,
  ol {
    grid-gap: 0.25em;
  }

  ul.weekdays li {
    font-size: 0;
  }

  ul.weekdays > li abbr:after {
    content: attr(title);
    font-size: calc(16px + (26 - 16) * ((100vw - 300px) / (1600 - 300)));
    text-align: center;
  }
}
</style>

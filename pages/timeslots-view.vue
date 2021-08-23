<template>
  <div>
    <div class="row">
      <div class="col-4">
        <div class="card">
          <div class="card-header card-header-divider">
            <div class="form-group row pt-1">
              <h4 class="col-4 text-right pt-1">เลือกเดือน</h4>
              <div class="col-8">
                <select
                  v-model="pickMonth"
                  style="width: 100%; height: 32px"
                >
                  <option
                    :value="m.value"
                    v-for="m in monthList"
                    :key="m.value"
                  >
                    {{ formatMonth(m.display) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <NuxtLink to="/timeslots-create">
                  <button class="btn btn-primary btn-block">
                    สร้างเวลาจอง
                  </button>
                </NuxtLink>
              </div>
              <div class="col-6">
                <button
                  @click="handleReloadDate"
                  class="btn btn-secondary btn-block"
                >
                  Reload
                </button>
              </div>
            </div>
          </div>
          <div class="card-body" style="height: 65vh; overflow-y: scroll">
            <date-list-select
              v-if="createdDate"
              :created-date="createdDate"
              :pick-month="pickMonth"
              :selected-row-date="selectedRowDate"
              :click-date="clickDate"
              @submitSelectRow="submitSelectRowDate"
            />
          </div>
        </div>
      </div>

      <div class="col-8">
        <div class="card">
          <!-- Headser -->
          <!-- ALert Warn active == false -->
          <div
            v-if="selectedRowDate && selectedRowDate.active === false"
            class="card-body pb-0 mb-0"
          >
            <div
              class="alert alert-warning alert-dismissible pb-0 mb-0"
              role="alert"
            >
              <button
                class="close"
                type="button"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span class="mdi mdi-close" aria-hidden="true"></span>
              </button>
              <div class="icon">
                <span class="mdi mdi-alert-triangle"></span>
              </div>
              <div class="message">
                <strong>Warning!</strong>
                ระบบของวันนี้ปิด คนใช้บริการจะไม่สามารถจองได้
              </div>
            </div>
          </div>

          <div class="card-body pb-0">
            <div class="row">
              <div class="col-6">
                <h4 class="">
                  รายละเอียดของวัน {{ selectedRowDate && selectedRowDate.date }}
                </h4>
              </div>
              <div class="col-6">
                <div class="float-right form-check form-switch m-3">
                  <input
                    id="toggleOpen"
                    v-model="selectedRowDate.active"
                    class="form-check-input"
                    type="checkbox"
                    :disabled="!selectedRowDate.time"
                    @change="handleActive"
                  />
                  <label class="form-check-label" for="toggleOpen">{{
                    selectedRowDate.active ? "เปิดให้จองคิว" : "ปิดการรับจอง"
                  }}</label>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <h5 class="">
                  <span class="mr-3">เปิดรับ {{ sumQuota.open || 0 }},</span>
                  <span class="mr-3"
                    >ลงทะเบียน {{ sumQuota.reserve || 0 }},</span
                  >
                  <span class="mr-3">เหลือ {{ sumQuota.balance || 0 }}</span>
                </h5>
              </div>
              <div class="col-6">
                <div class="d-flex justify-content-end" style="gap: 16px">
                  <button
                    class="btn btn-secondary"
                    @click="handlleReloadTime"
                  >
                    <i class="fas fa-redo-alt"></i> Reload
                  </button>

                  <button
                    class="btn btn-secondary"
                    :class="editMode ? 'active' : ''"
                    @click="submitEditRowsTime"
                  >
                    {{ editMode ? "ออกจากแก้ไข" : "แก้ไข" }}
                  </button>

                  <button :disabled="!selectedRowDate.time" class="btn btn-danger" @click="removeAll">
                    ลบวัน
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- MAIN DATA -->
          <div v-if="selectedRowDate && selectedRowDate.time" class="card-body">
            <card-detail-timeslots
              v-if="selectedRowDate && !editMode"
              :timeslot-holder="selectedRowDate.time"
            />
            
            <add-timeslots
              v-if="rowsTime && editMode"
              :rowsTime="rowsTime"
              :isActive="selectedRowDate.active"
              :showReserve="true"
              @submitSaveRow="submitSaveSingleRowTime"
              @submitRemoveRow="submitRemoveRowTime"
            />

            <button
              v-if="editMode"
              class="btn btn-primary ms-3"
              style="width: 120px; margin-top: -20px"
              @click="submitAddRowTime"
            >
              เพิ่มแถว
            </button>
          </div>

          <div
            v-if="!selectedRowDate || !selectedRowDate.time"
            class="card-body"
          >
            <div class="">
              <h3 class="">ไม่พบข้อมูลตารางเวลา</h3>
            </div>
          </div>

          <div class="p-5 mt-5" style="color: gray">
            <div class="card card-border">
              <div class="card-header card-header-divider">
                <span class="title">คู่มือ</span>
              </div>
              <div class="card-body">
                <Intro />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import timeslotApi from '../APIs/timeslots'
import { timeHolderTransformToRowsTime } from "../utility/functions/queueTableTransform";
import CardDetailTimeslots from "../components/QueueTable/CardDetailTimeslots.vue";
import AddTimeslots from '../components/QueueTable/AddTimeslots.vue'
import DateListSelect from "../components/QueueTable/DateListSelect.vue";
import Intro from "../components/QueueTable/Intorduction.vue";
import Button from "../components/Button.vue";
import { formatMonthEngToThai } from '../utility/functions/format'

export default {
  components: {
    CardDetailTimeslots,
    AddTimeslots,
    DateListSelect,
    Intro,
    Button,
  },
  data() {
    return {
      selectedRowDate: {},
      clickDate: "no-date",
      rowsTime: null,
      editMode: false,
      pickMonth: moment().format("YYYY-MM-DD"),
      monthList: [0, 1, 2].map((i) => {
        return {
          display: moment().add(i, "month").format("MMMM YYYY"),
          value: moment().add(i, "month").format("YYYY-MM-DD"),
        }
      }),
      todayDate: moment().format("YYYY-MM-DD"),
      lastUpdate: new Date().valueOf()
    };
  },
  computed: {
    sumQuota() {
      return _.reduce(
        this.selectedRowDate.time,
        (acc, row) => {
          acc["open"] += row.open;
          acc["reserve"] += row.reserve;
          acc["balance"] = acc["open"] - acc["reserve"];

          return acc;
        },
        {
          open: 0,
          reserve: 0,
          balance: 0,
        }
      );
    },
    createdDate() {
      return this.$store.state.queueTable.createdDate
    },
    entityId () {
      return this.$store.state.user.entityId
    }
  },
  watch: {
    lastUpdate (myVal) {
      this.fetchAll()
    }
  },
  beforeMount() {
    this.init();
  },
  methods: {
    async init() {
      const { todayDate } = this
      this.submitSelectRowDate({
        date: todayDate,
        ...this.createdDate[todayDate],
      })
    },

    async handleActive() {
      const { selectedRowDate, entityId, $store: store } = this;
      const date = selectedRowDate.date;
      
      try {
        store.dispatch('appState/toggleIsLoading')
        await timeslotApi()._update(entityId, {
          date,
          action: 'active',
          value: selectedRowDate.active
        })
        await new Promise(resolve => {
          setTimeout(() => {
            this.showToastSuccess(
              `ระบบทำการ (${selectedRowDate.active ? "เปิด" : "ปิด"}) สำเร็จ`,
              1500
            )
            this.lastUpdate = new Date().valueOf()
            resolve('')
          }, 1500)
        })
      } catch (e) {
        console.error('handle active error: ', e)
        this.$swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง", "error")
      } finally {
        store.dispatch('appState/toggleIsLoading')
      }
    },

    async submitSaveSingleRowTime({ row, indexAt }) {
      const { selectedRowDate, entityId, $store: store } = this;
      const date = selectedRowDate.date;
      const time =
        this.formatTime(row.start) + "-" + this.formatTime(row.end);
      const action = row.new ? 'insert' : 'open'

      try {
        store.dispatch('appState/toggleIsLoading')
        await timeslotApi()._update(entityId, {
          date,
          time,
          action,
          value: row.limit
        })
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            this.lastUpdate = new Date().valueOf()
            action == 'insert' ? row.new = false : ''
            this.selectedRowDate.time[time] = { open: row.limit, reserve: row.reserve || 0 }
            this.$swal.fire(
              "สำเร็จ",
              `ระบบทำการบันทึกข้อมูลแถวที่ ${indexAt + 1} สำเร็จ`,
              "success"
            )
            resolve('')
          }, 1000)
        })
      } catch (e) {
        console.error(e)
        this.$swal.fire(
          "ไม่สามารถบันทึกได้",
          "ไม่สามารถลดจำนวนเปิดรับให้น้อยกว่าจำนวนผู้ลงทะเบียนเข้า",
          "error"
        )
      } finally {
        store.dispatch('appState/toggleIsLoading')
      }
    },

    async submitRemoveRowTime({ row, indexAt }) {
      const { selectedRowDate, entityId, $store: store } = this;
      const date = selectedRowDate.date;
      const time = 
        this.formatTime(row.start) + "-" + this.formatTime(row.end)

      try {
        store.dispatch('appState/toggleIsLoading')
        await timeslotApi()._update(entityId, {
          date,
          time,
          action: 'remove'
        })
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            this.lastUpdate = new Date().valueOf()
            this.rowsTime.splice(indexAt, 1)
            this.selectedRowDate.time[time] = { open: 0, reserve: 0 }
            this.showToastSuccess(
              `ระบบทำการลบเวลา ${row.start}-${row.end} สำเร็จ`,
              1500
            )
            resolve('')
          }, 1500)
        })
      } catch (e) {
        this.$swal.fire(
          "ไม่สามารถลบได้",
          "เนื่องจากมีผู้ลงทะเบียนแล้ว",
          "error"
        )
      } finally {
        store.dispatch('appState/toggleIsLoading')
      }
    },

    async removeAll() {
      const { selectedRowDate: data, $store: store, entityId } = this
      const array = _.values(data.time);
      if (_.sumBy(array, (t) => t.reserve) != 0) {
        return this.$swal.fire(
          "ไม่สามารถลบวันได้ เนื่องจากมีการจองมาแล้ว",
          "คุณสามารถลบแต่ละเวลาได้ กดปุ่มแก้ไข",
          "error"
        )
      }

      try {
        store.dispatch('appState/toggleIsLoading')
        let promiseArr = []
        _.forEach(data.time, (value, timeKey) => {
          const promise = timeslotApi()._update(entityId, {
            date: data.date,
            time: timeKey,
            action: 'remove'
          })
          promiseArr.push(promise)
        })

        await Promise.all(promiseArr)
        await new Promise(resolve => {
          setTimeout(() => {
            this.lastUpdate = new Date().valueOf()
            this.selectedRowDate.time = {}
            resolve('')
          }, 3500)
        })
      } catch (e) {
        console.error(e)
        this.$swal.fire(
          "เกิดข้อผิดพลาด",
          "กรุณาลองใหม่อีกครั้ง",
          "error"
        )
      } finally {
        store.dispatch('appState/toggleIsLoading')
      }
    },

    submitAddRowTime() {
      this.rowsTime.push({
        start: "00:00",
        end: "00:00",
        limit: 100,
        new: true,
      });
    },

    async submitSelectRowDate(row) {
      this.clickDate = row.date
      this.selectedRowDate = await this.fetchSingleDateTimeslots(row.date)
      this.editMode = false
    },

    async submitEditRowsTime() {
      const { editMode } = this;

      if (!editMode) {
        const rowsTime = timeHolderTransformToRowsTime(
          this.selectedRowDate.time
        )
        const sort = _.orderBy(rowsTime, "start", "asc");
        this.rowsTime = sort
      } else {
        this.selectedRowDate = await this.fetchSingleDateTimeslots(this.clickDate)
      }

      this.editMode = !this.editMode;
    },

    async handleReloadDate() {
      this.$store.dispatch("appState/toggleIsLoading")
      await this.$store.dispatch("queueTable/fetchCreatedDate")
      this.$store.dispatch("appState/toggleIsLoading")
    },

    async handlleReloadTime () {
      const { $store: store, clickDate, rowsTime } = this
      store.dispatch("appState/toggleIsLoading")
      this.selectedRowDate = await this.fetchSingleDateTimeslots(clickDate)
      const sort = _.orderBy(rowsTime, 'start', 'asc')
      this.rowsTime = sort
      store.dispatch("appState/toggleIsLoading")
    },

    formatTime(time) {
      const [hour, min] = time.split(":");
      return hour + min
    },

    showToastSuccess(content, delay) {
      this.$toast.success(content, {
        duration: delay || 2000,
      })
    },

    showAlertConfirm(title, text, icon) {
      return this.$swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#26d454",
        cancelButtonColor: "#f53307",
      });
    },

    formatMonth (MMyyyy) {
      const [MM, yyyy] = MMyyyy.split(' ')
      const formated = formatMonthEngToThai(MM)
      return formated + yyyy
    },

    fetchAll() {
      return new Promise(async (resolve) => {
        await this.$store.dispatch("queueTable/fetchCreatedDate")
        this.selectedRowDate = await this.fetchSingleDateTimeslots(this.clickDate)
        resolve('')
      })
    },

    async fetchSingleDateTimeslots(date) {
      const { data } = await timeslotApi()._get(this.entityId, date)
      const newData = {
        ...data,
        active: data && data.active != undefined ? data.active : true
      }
      return newData || {}
    }
  },
};
</script>

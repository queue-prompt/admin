<template>
  <div class="">
    <div class="row wizard-row">
      <div class="col-md-12 fuelux">
        <div class="block-wizard">
          <div id="wizard1" class="wizard wizard-ux">
            <div class="steps-container">
              <ul class="steps">
                <li
                  v-for="(step, index) in stepList"
                  :key="index"
                  :class="[
                    dataStep == step.stepAt ? 'active' : '',
                    dataStep > step.stepAt ? 'complete' : '',
                  ]"
                >
                  {{ step.title }}<span class="chevron" />
                </li>
              </ul>
            </div>

            <div class="actions" style="z-index: 1">
              <button
                class="btn btn-xs btn-prev btn-secondary"
                type="button"
                @click="submitPrevious"
              >
                <i class="fas fa-chevron-left" /> Prev
              </button>
              <button
                class="btn btn-xs btn-next btn-secondary"
                type="button"
                data-last="Finish"
                @click="submitNext"
              >
                {{ dataStep === stepList.length ? "Submit" : "Next"
                }}<i class="fas fa-chevron-right" />
              </button>
            </div>

            <!-- content -->
            <div class="step-content">
              <!-- manual -->
              <div class="step-pane" :class="dataStep == 1 ? 'active' : ''">
                <div class="container p-0">
                  <Intro />
                </div>
              </div>

              <!-- date -->
              <div class="step-pane" :class="dataStep == 2 ? 'active' : ''">
                <div class="container p-0">
                  <date-list-create
                    class="mt-2"
                    @click_date="handleClickDate"
                    :rows-date="rowsDate"
                    :tmp-date="tmpDate"
                  />
                  <SelectedDatePill
                    :tmpDate="tmpDate"
                    @click_date="handleClickDate"
                    @clear="handleClear"
                  />
                </div>
              </div>

              <!-- time -->
              <div
                :class="dataStep == 3 ? 'active' : ''"
                class="step-pane"
                data-step="2"
              >
                <div class="container p-0">
                  <SelectedDatePill
                    :tmpDate="tmpDate"
                    @click_date="handleClickDate"
                    @clear="handleClear"
                  />

                  <add-timeslots
                    class="mt-2"
                    :rowsTime="rowsTime"
                    @submitRemoveRow="submitRemoveRow"
                  >
                    <template #buttonAdd>
                      <div class="p-2 text-left ml-4">
                        <button
                          class="btn btn-info text-white"
                          @click="submitInsertRowTime"
                        >
                          เพิ่มแถว
                        </button>
                      </div>
                    </template>
                  </add-timeslots>
                </div>
              </div>

              <div class="row my-3">
                <div class="col-6">
                  <button
                    class="btn-block btn btn-secondary btn-xl"
                    @click="submitPrevious"
                  >
                    <i class="fas fa-chevron-left" /> Back
                  </button>
                </div>
                <div class="col-6">
                  <button
                    class="btn-block btn btn-secondary btn-xl"
                    @click="submitNext"
                  >
                    {{ dataStep === stepList.length ? "Submit" : "Next" }}
                    <i class="fas fa-chevron-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Intro from "../components/QueueTable/Intorduction.vue";
import SelectedDatePill from "../components/QueueTable/SelectedDatePill.vue";
import moment from "moment";
import AddTimeslots from '../components/QueueTable/AddTimeslots.vue'
import DateListCreate from "../components/QueueTable/DateListCreate.vue";
import Button from "../components/Button.vue";
import timeslotsApi from '../APIs/timeslots'
import {
  rowsTimeTransformToTimeslotsHolder,
  rowsDateTransformtoDateList
} from '../utility/functions/queueTableTransform'

export default {
  name: "Register",
  components: {
    Intro,
    SelectedDatePill,
    AddTimeslots,
    DateListCreate,
    Button,
  },
  data() {
    return {
      tmpDate: {},
      dataStep: 1,
      stepList: [
        { title: "คำแนะนำ", stepAt: 1 },
        { title: "เลือกวัน", stepAt: 2 },
        { title: "สร้างตารางเวลา", stepAt: 3 },
      ],
      form: null,
      contentPreRegis: null,
      contentPostRegis: null,

      //-- timeslote
      rowsTime: [
        { start: "09:00", end: "10:00", limit: 100, new: true },
        { start: "10:00", end: "11:00", limit: 100, new: true },
        { start: "13:00", end: "16:00", limit: 100, new: true },
      ],
      rowsDate: [],
    };
  },
  async created() {
    this.rowsDate = this.computeMoreDaysFromToday(14);
  },
  methods: {
    submitNext() {
      if (this.dataStep === 3) {
        this.submitDeploy();
        return;
      }
      this.dataStep++;
    },

    submitPrevious() {
      if (this.dataStep === 1) {
        return;
      }
      this.dataStep--;
    },

    // ---  timeslots create
    async submitDeploy() {
      const { rowsTime, $store: store } = this;

      const confirm = await this.alertConfirm(
        "แจ้งเตือน",
        "ยืนยันการสร้างตารางคิว",
        "information"
      )
      if (confirm.dismiss) return;

      let rowsDate = _.reduce(
        this.tmpDate,
        (acc, v, k) => {
          acc.push({ date: k, checkbox: true });
          return acc;
        },
        []
      )

      try {
        store.dispatch('appState/toggleIsLoading')
        const timeslotHolder = rowsTimeTransformToTimeslotsHolder(rowsTime)
        const dateList = rowsDateTransformtoDateList(rowsDate)
        await timeslotsApi()._create(
          store.state.user.entityId,
          dateList,
          timeslotHolder
        )
        await new Promise(resolve => {
          setTimeout(() => {
            this.fetchAll()
            this.$swal.fire("แจ้งเตือน", "สร้างตารางคิวสำเร็จ", "success")
            this.$router.push({ path: "/timeslots-view" })
            resolve('')
          }, 5000)
        })
      } catch (error) {
        console.error('create error: ', error)
      } finally {
        store.dispatch('appState/toggleIsLoading')
      }
    },

    submitInsertRowTime() {
      this.rowsTime.push({
        start: "00:00",
        end: "00:00",
        limit: 1,
        new: true,
      });
    },

    submitRemoveRow({ indexAt }) {
      this.rowsTime.splice(indexAt, 1);
    },

    computeMoreDaysFromToday(length) {
      const date = [];
      for (let i = 0; i < length; i++) {
        const isoString = moment().add(i, "days").toISOString();
        date.push({ checkbox: false, date: isoString });
      }

      return date;
    },

    alertConfirm(title, text, icon) {
      return this.$swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });
    },

    handleClickDate(date) {
      if (this.tmpDate[date] == undefined) {
        this.tmpDate = {
          ...this.tmpDate,
          [date]: true,
        }
      } else {
        let newDate = _.omit(this.tmpDate, [date])
        this.tmpDate = newDate;
      }

      this.tmpDate = this.sortHolderObject(this.tmpDate)
    },

    sortHolderObject (holder) {
      const tmpArr = []
      for (const key in holder) {
        tmpArr.push({ date: key })
      }

      const sort = _.orderBy(tmpArr, 'date', 'asc')

      let tmpHolder = {}
      _.forEach(sort, data => {
        tmpHolder = {
          ...tmpHolder,
          [[data.date]]: true
        }
      })

      return tmpHolder
    },

    handleClear() {
      this.tmpDate = {};
    },

    fetchAll () {
      this.$store.dispatch('queueTable/fetchCreatedDate')
    }
  },
};
</script>

<style scope>
</style>

<template>
  <div>
    <div class="card">
      <div class="card-header card-header-divider">Report</div>
      <div class="card-body">
        <div class="row">
          <div class="col-6">
            <div class="form-group row mt-2">
              <label
                class="col-3 col-lg-2 col-form-label text-right"
                for="inputEmail2"
                >เลือกวัน</label
              >
              <div class="col-9 col-lg-10">
                <v-date-picker
                  :masks="masks"
                  v-model="date"
                  transition="none"
                  mode="date"
                  @input="selectDate"
                >
                  <template #default="{ inputValue, togglePopover }">
                    <input
                      type="text"
                      class="form-control"
                      :value="inputValue"
                      @click.stop="
                        togglePopover({
                          placement: 'bottom',
                          showDelay: 0,
                          hideDelay: 0,
                        })
                      "
                    />
                  </template>
                </v-date-picker>
              </div>
            </div>
            <div class="form-group row mt-2">
              <label
                class="col-3 col-lg-2 col-form-label text-right"
                for="inputEmail2"
              ></label>
              <div class="col-9 col-lg-10">
                <button
                  class="btn btn-primary btn-lg"
                  @click="() => getReport('pdf')"
                >
                  <i class="bi bi-file-earmark-pdf-fill">
                    Export PDF (Print A4)</i
                  >
                </button>
                <button
                  class="btn btn-primary btn-lg"
                  @click="() => getReport('excel')"
                >
                  <i class="bi bi-file-earmark-spreadsheet">Export EXCEL</i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-5 offset-lg-1">
            <div class="">
              <h4 class="">การใช้งานรายงาน</h4>
              <ol class="">
                <li class="">
                  ปริ้น A4 ( PDF ) รายชื่อผู้จองคิว ในวันนั้นในตอนเช้า
                </li>
                <li class="">
                  ผู้มาใช้บริการ แจ้งรหัสการจอง และ ช่วงเวลาที่จองคิวไว้
                  ให้เจ้าหน้าที่ <br />
                  (รหัสการจองอาจมีซ้ำได้)
                </li>
                <li class="">
                  เจ้าหน้าที่ดำเนินการ ตามระเบียบ, ระบบภายในขององค์กรนั้นๆ
                  ตามปกติ
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div class="row mt-5">
          <div class="col-12">
            <table v-if="reportData" class="table mt-3">
              <thead>
                <tr>
                  <th scope="col">เวลา</th>
                  <th scope="col">ชื่อ-นามสกุล</th>
                  <th scope="col">เลขรหัสบัตรประชาชน</th>
                  <th scope="col">เบอร์โทรศัพท์</th>
                  <th v-if =" type === '100' || type === '200' " scope="col">กลุ่ม</th>
                  <th scope="col">ข้อมูลเพิ่มเติม</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, $dataIndex) in reportData" :key="$dataIndex">
                  <td>{{ convertTimeRangeFormat(data.time) }}</td>
                  <td>
                    {{ data.prefix }} {{ data.firstName }} {{ data.lastName }}
                  </td>
                  <td>{{ data.idCardNumber }}</td>
                  <td>{{ data.mobile }}</td>
                  <td v-if =" type === '100' || type === '200' ">{{ data.groupOf }}</td>
                  <td>{{data.remark}}</td>
                </tr>
              </tbody>
            </table>
            <div
              v-else
              class="row"
              style="text-align: center; margin-top: 30px"
            >
              <div class="col">
                <h4>ไม่พบข้อมูล</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Report",
  data() {
    return {
      date: dayjs().format("YYYY-MM-DD"),
      masks:{
        input:'YYYY-MM-DD'
      }
    };
  },
  computed: {
    ...mapState({
      reportData: (state) => state.report.data,
      type: (state) => state.user.type
    }),
  },
  mounted(){
    this.$store.dispatch("report/fetchReport",this.date);
  },
  methods: {
    selectDate(date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      this.$store.dispatch("report/fetchReport", formattedDate);
    },
    convertTimeRangeFormat(time){
    const startTime = time.slice(0,4)
    const endTime = time.slice(5,9)
    const formatTime =(time)=> {return [time.substring(0,2),':',time.substring(2,4)].join('').toString()}
    return `${formatTime(startTime)}-${formatTime(endTime)}`
    },
    getReport(reportType) {
      const formattedDate = dayjs(this.date).format("YYYY-MM-DD");
      this.$store.dispatch("report/getReport", {
        reportType,
        date: formattedDate,
      });
    },
  },
};
</script>

<style></style>

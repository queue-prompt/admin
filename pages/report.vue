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
              <div class="col-7 col-lg-8">
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
                          hideDelay: 0
                        })
                      "
                    />
                  </template>
                </v-date-picker>
              </div>

              <div class="col-2 p-0">
                <button 
                  class="btn btn-space btn-secondary btn-lg" 
                  style="width: 100%; height: 100%;" 
                  @click="refreshReport"
                >
                  Refresh
                </button>
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
              <h4>การใช้งานรายงาน</h4>
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
            <div class="row">
              <div class="col-6">
                <div class="row">
                  <div class="col-6">
                    <span>วันที่ {{ dateForShow }} ผลการค้นหา {{reportData.length}} รายการ</span>
                  </div>
                  <div class="col-6">
                    <span class="fst-italic" style="background: #eee; padding: 3px 5px;" >Generate At :  {{ generateAt }} น.</span>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <Pagination
                  :currentPage="currentPage"
                  position="justify-content-end"
                  :prevFunction="prevPage"
                  :nextFunction="nextPage"
                  :disabledPrev="currentPage === 1"
                  :disabledNext="maxPage==0?true:currentPage===maxPage?true:false"
                />
              </div>
            </div>
            <table v-if="reportData.length>0" class="table mt-3">
              <thead>
                <tr>
                  <th scope="col">ลำดับ</th>
                  <th scope="col">รหัสจองคิว</th>
                  <th scope="col">เวลา</th>
                  <th scope="col">ชื่อ-นามสกุล</th>
                  <th scope="col">เลขรหัสบัตรประชาชน</th>
                  <th scope="col">เบอร์โทรศัพท์</th>
                  <th v-if="type === '100' || type === '200'" scope="col">
                    กลุ่ม
                  </th>
                  <th scope="col">ข้อมูลเพิ่มเติม</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, $dataIndex) in displayData" :key="$dataIndex">
                  <td>{{ $dataIndex + 1 }}</td>
                  <td>{{ data.registerCode }}</td>
                  <td>{{ convertTimeRangeFormat(data.time) }}</td>
                  <td>
                    {{ data.prefix }} {{ data.firstName }} {{ data.lastName }}
                  </td>
                  <td>{{ data.idCardNumber }}</td>
                  <td>{{ data.mobile }}</td>
                  <td v-if="type === '100' || type === '200'">
                    {{ data.groupOf }}
                  </td>
                  <td>{{ data.remark }}</td>
                </tr>
              </tbody>
            </table>
            <div
              v-else-if="!reportData.length"
              class="row"
              style="text-align: center; margin-top: 30px"
            >
              <div class="col">
                <h4>ไม่พบข้อมูล</h4>
              </div>
            </div>
          </div>

          <div v-if="reportData.length>0" class="col-12">
            <Pagination
              :currentPage="currentPage"
              :prevFunction="prevPage"
              :nextFunction="nextPage"
              :disabledPrev="currentPage === 1"
              :disabledNext="maxPage==0?true:currentPage===maxPage?true:false"
            />
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
      dateForShow: dayjs().format("YYYY-MM-DD"),
      masks: {
        input: "YYYY-MM-DD"
      },
      currentPage: 1,
      itemsPerPage: 100,
      generateAt: dayjs().format("YYYY-MM-DD HH:mm"),
    };
  },
  computed: {
    ...mapState({
      reportData: state => state.report.data,
      type: state => state.user.type
    }),
    displayData() {
      let start;
      if (this.currentPage === 1) {
        start = 0;
      } else {
        start = this.currentPage * this.itemsPerPage - this.itemsPerPage;
      }
      const end = start + this.itemsPerPage;
      return this.reportData.slice(start, end);
    },
    maxPage() {
      return Math.round(this.reportData.length / this.itemsPerPage);
    }
  },
  mounted() {
    this.$store.dispatch("report/fetchReport", this.date);
  },
  methods: {
    prevPage() {
      if (this.currentPage <= 1) {
        return;
      } else {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage >= this.maxPage) {
        return;
      } else {
        this.currentPage += 1;
      }
    },
    async selectDate(date) {
      this.$store.dispatch("appState/toggleIsLoading", null)
      this.currentPage = 1
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      this.dateForShow = formattedDate
      await this.$store.dispatch("report/fetchReport", formattedDate);
      setTimeout(()=>{
        this.$store.dispatch("appState/toggleIsLoading", null)
      },1000)
    },
    convertTimeRangeFormat(time) {
      const startTime = time.slice(0, 4);
      const endTime = time.slice(5, 9);
      const formatTime = time => {
        return [time.substring(0, 2), ":", time.substring(2, 4)]
          .join("")
          .toString();
      };
      return `${formatTime(startTime)}-${formatTime(endTime)}`;
    },
    getReport(reportType) {
      const formattedDate = dayjs(this.date).format("YYYY-MM-DD");
      this.$store.dispatch("report/getReport", {
        reportType,
        date: formattedDate
      });
    },
    refreshReport() {
      this.generateAt = dayjs().format('YYYY-MM-DD HH:mm')
      const formatDate = dayjs(this.date).format('YYYY-MM-DD')
      this.$store.dispatch("report/fetchReport", formatDate);
    }
  }
};
</script>

<style></style>

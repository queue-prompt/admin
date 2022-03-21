<template>
  <div class="card">
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th>รอบที่</th>
            <th>เริ่มเวลา</th>
            <th>สิ้นสุดเวลา</th>
            <th>จำกัด</th>
            <th v-if="showReserve">Reserve</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, index) in rowsTimeData"
            :key="index"
          >
            <td>
              {{ index + 1 }}
            </td>

            <td scope="row">
              <VueTimepicker
                v-if="row.new"
                v-model="row.start"
                lazy
                :disabled="!isActive"
                format="HH:mm"
                :minute-interval="5"
                @change="handleTimePicker(index, 'start')"
              />
              <small v-else style="font-size: 1rem">{{ row.start }}</small>
            </td>

            <td>
              <VueTimepicker
                v-if="row.new"
                v-model="row.end"
                lazy
                format="HH:mm"
                :disabled="!isActive"
                :minute-interval="5"
                @change="handleTimePicker(index, 'end')"
              />
              <small v-else style="font-size: 1rem">{{ row.end }}</small>
            </td>

            <td>
              <div>
                <input
                  v-model.number="row.limit"
                  style="width: 100px"
                  type="number"
                  class="form-control"
                  :disabled="!isActive"
                />
              </div>
            </td>

            <td v-if="showReserve">
              {{ row.reserve || 0 }}
            </td>

            <td>
              <div v-if="showReserve">
                <button
                  class="btn btn-success"
                  :disabled="!isActive"
                  @click="submitSaveRow(index)"
                >
                  <i class="far fa-save" />
                </button>
                <button
                  class="btn btn-danger"
                  :disabled="!isActive"
                  @click="submitRemoveRow(index)"
                >
                  <i class="fas fa-trash-alt" />
                </button>
              </div>

              <button
                v-else
                class="btn btn-danger"
                :disabled="!isActive"
                @click="submitRemoveRow(index)"
              >
                ลบแถว
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot name="buttonAdd" />
  </div>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
import _ from 'lodash'

export default {
  components: {
    VueTimepicker,
  },
  props: {
    rowsTime: {
      type: Array,
      default: () => {
        return []
      },
      require: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    showReserve: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rowsTimeData: []
    }
  },
  created () {
    if (this.rowsTimeData) this.rowsTimeData = this.rowsTime
  },
  watch: {
    rowsTime (myVal) {
      this.rowsTimeData = myVal
    }
  },
  methods: {
    async submitSaveRow (indexAt) {
      const result = await this.showAlertConfirm(
        'แจ้งเตือน',
        `ต้องการบันทึกแถวที่ ${indexAt + 1}`
      )

      if (result.dismiss) return

      this.$emit('submitSaveRow', { row: this.rowsTimeData[indexAt], indexAt })
    },

    async submitRemoveRow (indexAt) {
      const row = this.rowsTimeData[indexAt]

      if (row.reserve && row.reserve >= 1) {
        return this.$swal.fire(
          'ไม่สามารถลบได้',
          'เนื่องจากมีการจองมาในเวลานี้แล้ว',
          'error'
        )
      }

      if (row.new) {
        this.rowsTimeData.splice(indexAt, 1)
        return
      }

      const validate = this.validateRowTimeForRemove(this.rowsTimeData)
      if (!validate) {
        return this.$swal.fire(
          "ไม่สามารถลบได้",
          "หากต้องการลบแถวนี้กรุณาเพิ่มแถวใหม่ หรือ บันทึกแถวใหม่ให้เสร็จสิ้นก่อน",
          "error"
        )
      }

      const result = await this.showAlertConfirm(
        'แจ้งเตือน',
        `ต้องการลบแถวที่ ${indexAt + 1}`
      )

      if (result.dismiss) return

      this.$emit('submitRemoveRow', { row: this.rowsTimeData[indexAt], indexAt })
    },

    handleTimePicker (indexAt, key) {
      const row = this.rowsTimeData[indexAt]
      const originalValue = row

      if (key === 'start') {
        this.rowsTimeData[indexAt].end = this.addHours(row.start, 1)
      }

      const errorIndexAt = this.validateRowTimeStart(indexAt)
      if(errorIndexAt) {
        this.$swal.fire(
          'ขออภัย',
          `เวลาเริ่มต้นไม่ควรซ้ำกับแถวที่ ${errorIndexAt + 1}`,
          'error'
        )

        setTimeout(() => {
          this.rowsTimeData[indexAt] = originalValue
        }, 100)
      }
    },

    addHours(dateString, length) {
      const hours = dateString.slice(0, 2);
      const minute = dateString.slice(3, 5);
      const added = Number.parseInt(hours) + length;
      const formatHour = added < 10 ? `0${added}` : String(added);
      return `${formatHour}:${minute}`;
    },

    validateRowTimeStart(indexAt) {
      const { rowsTimeData } = this;
      let errorIndexAt = null;

      for (let i = 0; i < rowsTimeData.length; i++) {
        const row = rowsTimeData[i];
        if (indexAt !== i) {
          if (rowsTimeData[indexAt].start === row.start) {
            errorIndexAt = i;
            break;
          }
        }
      }

      return errorIndexAt
    },

    validateRowTimeForRemove(rowsTime) {
      const find = _.find(this.rowsTime, (row) => {
        return row.new === true;
      });

      if (rowsTime.length <= 1) {
        return false;
      }
      if (find) {
        return false;
      }

      return true;
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
  }
}
</script>

<style>

</style>
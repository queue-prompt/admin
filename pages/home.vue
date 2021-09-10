<template>
  <div class="row">
    <div class="col-12">
      <h3 class="text-center mb-3">คู่มือการใช้งานเบื้องต้น</h3>

      <div class="card">
        <div class="card-header card-header-divider">
          การใช้งาน (สำหรับหน่วยงาน)
        </div>
        <div class="card-body">
          <p class="">ขั้นตอนการสร้างตารางจอง timeslots</p>
          <ol class="">
            <li class="">กรอกข้อมูลหน่วยงาน</li>
            <li class="">เขียนคำอธิบาย การใช้บริการ ของหน่วยงาน</li>
            <li class="">สร้างตารางจองคิว เลือกวันที่ และ เวลา จำนวนคิวที่เปิดรับ</li>
            <li class="">
              แปะ link การจอง หรือ นำ QR-code การจองไปใช้งาน
              <br />(ทางคิวพร้อม.com ไม่ได้ประชาสัมพันธ์ การจองนี้)
            </li>
          </ol>

          <p class="">ขั้นตอนปิดระบบจองชั่วคราว</p>
          <ol class="">
            <li class="">
              ปิดระบบจองทั้งหมด : สามารถกดปิดที่มุมบนขวาสุดขอหน้าจอ
              (ปุ่มสีเขียว)
            </li>
            <li class="">ปิดระบบจองแบบเลือกวัน :</li>
            <ol class="">
              <li class="">เข้าเมนูที่ตารางเวลา</li>
              <li class="">เลือกวันที่</li>
              <li class="">กด switch สีฟ้าเพื่อเปิด/ปิดการจองของวันนั้น</li>
            </ol>
          </ol>
          <span class=""></span>
        </div>
      </div>

      <div class="card">
        <div class="card-header card-header-divider">
          การจองคิว (สำหรับผู้มาใช้บริการ)
        </div>
        <div class="card-body">
          <p class="">ขั้นตอน</p>
          <ol class="">
            <li class="">
              กดที่ลิงค์ หรือ Scan QR หรือ เข้า menu line OA ของหน่วยงาน
            </li>
            <li class="">อ่านเงื่อนไข และ รายละเอียดบริการ</li>
            <li class="">กรอก ข้อมูลผู้มาใช้บริการ</li>
            <li class="">เลือกเวลาที่ต้องการไปใช้บริการ</li>
            <li class="">
              capture หน้าจอ หรือจดรหัสการจอง ไว้เพื่อแจ้งเจ้าหน้าที่ในวันที่มาใช้บริการ
            </li>
          </ol>
          <p class="">
            หมายเหตุ <br />
            - สามารถจองให้บุคคลอื่นได้เพิ่มได้(ยึดตามหมายเลขบัตรประชาชน)<br />
            <span class="yellow"
              >- สามารถตรวจสอบ คิวได้ที่หน้าแรก ของการจอง
              แล้วกรอกเลขบัตรประชาชน</span
            >
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-header card-header-divider">
          การตรวจสอบคิวผู้มาใช้บริการ (สำหรับหน่วยงาน)
        </div>
        <div class="card-body">
          <p class="">ขั้นตอน</p>
          <ol class="">
            <li class="">เข้าที่รายงาน</li>
            <li class="">เลือกวัน และ ปริ้น PDF (A4)</li>
            <li class="">ผู้มาใช้บริการแจ้งข้อมูล</li>
            <ul class="">
              <li class="">
                รหัสการจอง (รหัสอาจมีซ้ำได้)
                (ซึ่งระบบได้เรียงตัวเลขจากรหัสนี้ให้แล้ว)
              </li>
              <li class="">ช่วงเวลาที่จองไว้</li>
              <li class="">ชื่อ นามสุกล</li>
            </ul>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown-render";

export default {
  data() {
    return {
      md: null,
    };
  },
  components: {
    VueMarkdown,
  },
  created() {
    this.md = "# header";
  },
  mounted(){
    console.log('home')
  }
};
</script>

<style scoped>
.card-body p {
  margin-bottom: 4px;
}

p.yellow {
  background: yellow;
}

span.yellow {
  background: yellow;
}
</style>

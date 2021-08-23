<template>
  <div class="switch-holder">
    <div class="switch-label me-3">
      <i class="fa fa-bluetooth-b"></i><span>{{ label }}</span>
    </div>
    <div class="switch-toggle">
      <input
        type="checkbox"
        id="bluetooth"
        @change="onChange"
        :checked="status"
      />
      <label for="bluetooth"></label>
    </div>
  </div>
</template>

<script>
export default {
  props: ["status", "label"],
  methods: {
    onChange(e) {
      this.$emit("statusChange", e.target.checked);
    },
  },
};
</script>

<style>
.switch-holder {
  display: flex;
  /* padding: 10px 20px;

  margin-bottom: 30px;
  box-shadow: -8px -8px 15px rgba(255, 255, 255, 0.7),
    10px 10px 10px rgba(0, 0, 0, 0.3),
    inset 8px 8px 15px rgba(255, 255, 255, 0.7),
    inset 10px 10px 10px rgba(0, 0, 0, 0.3); */
  justify-content: space-between;
  border: 1px solid #ccc;
  align-items: center;
  margin-top: 0px;
  /* border-radius: 10px; */
}

.switch-label {
  /* width: 150px; */
}

.switch-label i {
  margin-right: 5px;
}

.switch-toggle {
  height: 40px;
}

.switch-toggle input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  z-index: -2;
}

.switch-toggle input[type="checkbox"] + label {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 40px;
  /* border-radius: 20px; */
  margin: 0;
  cursor: pointer;
  border-left: 1px solid #ccc;
}

.switch-toggle input[type="checkbox"] + label::before {
  position: absolute;
  content: "OFF";
  font-size: 13px;
  text-align: center;
  line-height: 25px;
  top: 4px;
  left: 8px;
  width: 45px;
  height: 25px;
  /* border-radius: 20px; */
  background-color: red;
  color: white;
  box-shadow: -3px -3px 5px rgba(255, 255, 255, 0.5),
    3px 3px 5px rgba(0, 0, 0, 0.25);
  transition: 0.3s ease-in-out;
}

.switch-toggle input[type="checkbox"]:checked + label::before {
  left: 50%;
  content: "ON";
  color: #fff;
  background-color: #00b33c;
  box-shadow: -3px -3px 5px rgba(255, 255, 255, 0.5), 3px 3px 5px #00b33c;
}
</style>

<template>
  <nav aria-label="Page navigation example">
    <ul :class="`pagination ${position} `">
      <li  @click="prevFunction" :class="`page-item ${disabledPrev?'disabled':''} `">
        <a class="page-link" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link">{{ currentPage }}</a>
      </li>
      <li @click="nextFunction" :class="`page-item ${disabledNext?'disabled':''} `">
        <a class="page-link" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props:{
    currentPage:{
      type:Number,
      require:true,
      default:()=>1
    },
    position:{
      type:String,
      default:()=>'justify-content-center'
    },
    disabledPrev:{
      type:Boolean,
      default:()=>false
    },
    disabledNext:{
      type:Boolean,
      default:()=>false
    },
    prevFunction:{
      type:Function,
      require:true,
      default:()=>{return}
    },
    nextFunction:{
      type:Function,
      require:true,
      default:()=>{return}
    }
  },
};
</script>

<style></style>

<template>
  <div class="home">
    <div class="topic">
      <img src="@/assets/home/img001.jpg" alt="全球抗疫">
    </div>
    <div class="intro_title">
      <h2>医院简介</h2>
    </div>
    <el-carousel class="intro" :interval="5000" arrow="always">
      <el-carousel-item key="001">
        <img src="@/assets/home/img002.jpg" alt="医院简介">
      </el-carousel-item>
      <el-carousel-item key="002">
        <img src="@/assets/home/img003.jpg" alt="医院简介">
      </el-carousel-item>
      <el-carousel-item key="003">
        <img src="@/assets/home/img004.jpg" alt="医院简介">
      </el-carousel-item>
      <el-carousel-item key="004">
        <img src="@/assets/home/img005.jpg" alt="医院简介">
      </el-carousel-item>
      <el-carousel-item key="005">
        <img src="@/assets/home/img006.jpg" alt="医院简介">
      </el-carousel-item>
      <el-carousel-item key="006">
        <img src="@/assets/home/img007.jpg" alt="医院简介">
      </el-carousel-item>
    </el-carousel>
    <div class="intro_title">
      <h2>关于疫情</h2>
    </div>
    <el-carousel class="intro ill" type="card" :interval="5000" arrow="always">
      <el-carousel-item key="007">
        <img src="@/assets/home/img008.jpg" alt="医院简介">
      </el-carousel-item>
      <el-carousel-item key="008">
        <img src="@/assets/home/img009.jpg" alt="医院简介">
      </el-carousel-item>
      <el-carousel-item key="009">
        <img src="@/assets/home/img010.jpg" alt="医院简介">
      </el-carousel-item>
      <el-carousel-item key="010">
        <img src="@/assets/home/img011.jpg" alt="医院简介">
      </el-carousel-item>
    </el-carousel>
    <div class="intro_title">
      <h2>医疗设备</h2>
    </div>
    <div class="device">
      <ul class="device_img">
        <li><img src="@/assets/home/pic1.jpg" alt=""></li>
        <li><img src="@/assets/home/pic3.png" alt=""></li>
        <li><img src="@/assets/home/pic5.jpg" alt=""></li>
        <li><img src="@/assets/home/pic6.jpg" alt=""></li>
        <li><img src="@/assets/home/pic7.jpg" alt=""></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {
      
    }
  }
}
</script>

<style lang="scss">
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  img {
    width: 100%;
    display: block;
  }
  .intro {
    width: 80%;
    margin: 0 auto;
    .el-carousel__container {
      height: auto;
      min-height: 660px;
      img {
        max-height: 660px;
      }
    }
    &.ill {
      width: 90%;
      .el-carousel__container {
        min-height: 375px;
        img {
          height: 375px;
        }
      }
    }
  }
  .intro_title {
    height: 48px;
    background: #3064b8;
    h2 {
      width: 90%;
      margin: 5px auto 0;
      color: #fff;
      border-left: 14px solid #bb0b0b;
      line-height: 48px;
      padding-left: 15px;
    }
  }
  .device {
    width: 90%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .device_img {
    padding: 0;
    overflow: hidden;
    li {
      float: left;
      list-style: none;
      width: 240px;
      height: 240px;
      img {
        width: 90%;
        height: 90%;
        margin: 5px auto;
        display: block;
        cursor: pointer;
        transition: all 0.5s;
        &:hover {
          width: 95%;
          height: 95%;
          box-shadow: 0 0 10px #555;
        }
      }
    }
  }
}
</style>

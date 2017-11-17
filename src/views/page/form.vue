<template>
  <div class="app-container">
    <el-carousel :interval="4000"  height="300px">
      <el-carousel-item v-for="item in 6" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {

    background-image: url(../../assets/timg.jpeg) ;
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .el-carousel__item:nth-child(2n+1) {

    background-image: url(../../assets/timg2.jpeg);
    background-repeat: no-repeat;
    background-size: 100%;
  }
</style>
<script>

</script>

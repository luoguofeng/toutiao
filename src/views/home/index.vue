<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {

    }
  }
}
</script>

<style scoped lang="less">
.layout {
    height: 100%;
    .el-container {
        height: 100%;
    }
}
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #323745;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #eee;
  color: #333;
  text-align: center;
}
</style>

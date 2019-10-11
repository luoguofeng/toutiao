<template>
    <div class="layout">
        <el-container>
            <el-aside width="200px">
                <layout-asider />
            </el-aside>
            <el-container>
                <el-header>
                    <layout-header />
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
// 导入两个布局组件
import LayoutHeader from '@/views/layout/components/layoutHeader'
import LayoutAsider from '@/views/layout/components/layoutAsider'

export default {
  components: {
    LayoutHeader,
    LayoutAsider
  }
}
</script>

<style lang="less" scoped>
.layout {
    height: 100%;
    &>.el-container {
        height: 100%;
    }
}

.el-aside {
    background-color: #323745;
    color: #333;
}

.el-header {
    background-color: #fff;
    color: #333;
    line-height: 60px;
}

.el-main {
    background-color: #eee;
    color: #333;
}
</style>

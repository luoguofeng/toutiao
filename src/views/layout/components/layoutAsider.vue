<template>
  <div class="appasider">
    <!--项目的 logo -->
    <div class="logo">
      <img src="./logo_admin.png" alt />
    </div>
    <!-- 导航菜单栏 -->
    <!-- el-menu：管理所有的菜单栏选项 default-active：默认选中 @open：展开导航的事件 @cloas：关闭导航的事件 -->
    <!-- background-color： 导航栏的背景颜色 text-color: 导航中文本的颜色 active-text-color: 导航中被选中文本的颜色-->
    <el-menu
      default-active="/home"
      class="el-menu-vertical-demo"
      background-color="#353b4e"
      text-color="#ccc"
      active-text-color="#409eff"
      :router="true"
      :unique-opened="true"
    >
      <el-menu-item index="/home">
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <span>内容管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/publish">发布文章</el-menu-item>
          <el-menu-item index="/article/list">内容列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <span>粉丝管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1">图文数据</el-menu-item>
          <el-menu-item index="3-2">粉丝概况</el-menu-item>
          <el-menu-item index="3-3">粉丝画像</el-menu-item>
          <el-menu-item index="3-4">粉丝列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="4">
        <template slot="title">
          <span>账户信息</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  methods: {
    //   handleOpen () {
    //       console.log('哎呀!我被打开了')
    //   },
    //   handleClose () {
    //       console.log('哎呀!我被关闭了')
    //   }
  }
}
</script>

<style lang="less" scoped>
.logo {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  img {
    width: 120px;
  }
}
.is-active {
    background-color: #409eff!important;
    color: #fff!important;
}
.el-menu-item {
    min-width: 200px!important;
    padding-left: 30px!important;
}
.el-submenu {
    min-width: 200px!important;
  }
</style>

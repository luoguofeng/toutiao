<template>
  <div class="appheader">
    <el-row>
      <el-col :span="14">江苏传智播客教育科技股份有限公司</el-col>
      <el-col :span="10">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo">
            <img class="icon" :src="userInfo.photo" alt />
            <span class="name">{{userInfo.name}}</span>
            <i class="el-icon-caret-bottom iconfont"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="userCenter">个人信息</el-dropdown-item>
            <el-dropdown-item><a href="https://github.com/luoguofeng/toutiao">git地址</a></el-dropdown-item>
            <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'layoutHeader',
  methods: {
    exit () {
      this.$router.push('/login')
    },
    userCenter () {
      this.$router.push('/userInfo')
    }
  },
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style lang="less" scoped>
.userinfo {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  .icon {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  .name {
      margin-left: 10px;
      color:#606266;
  }
  .iconfont {
    cursor: pointer;
    font-size: 12px;
    margin-left: 10px;
    color:#606266;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-dropdown {
  display: flex;
  justify-content: flex-end;
  color: #606266;
  font-size: 14px;
}
</style>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户信息</span>
    </div>
    <el-row :gutter="40">
      <el-col :span="12">
        <el-form
          :model="userInfo"
          status-icon
          label-width="100px"
          class="demo-ruleForm"
          :loading="loading"
        >
          <el-form-item label="帐号类型">
            <el-input type="text" v-model="userInfo.type" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="头条号ID">
            <el-input type="text" v-model="userInfo.id" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input type="text" v-model="userInfo.mobile" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input type="text" v-model="userInfo.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input type="text" v-model="userInfo.intro" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input type="text" v-model="userInfo.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editUserInfo">修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :show-file-list="false"
          :http-request="editUserPhoto"
          name="file"
        >
          <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 用户信息
      userInfo: {
        // 用户名
        name: '',
        // 个性签名
        intro: '',
        // 帐号类型
        type: `头条号类型  个人`,
        // 头条帐号
        id: '1',
        // 手机号
        mobile: '',
        // 邮箱
        email: '',
        // 上传图片路径
        photo: ''
      },
      // 加载状态
      loading: false,
      // 禁用状态
      disabled: false
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    // 映射vuex中mutation中的方法
    ...mapMutations(['updateUserInfo']),
    // 获取用户信息的方法
    async getUserInfo () {
      this.loading = true
      let res = await this.$Http.getUserInfo()
      this.userInfo = { ...this.userInfo, ...res }
      this.loading = false
    },
    // 编辑用户资料的方法
    async editUserInfo () {
      this.loading = true
      let res = await this.$Http.editUserInfo({
        data: this.userInfo
      })
      console.log(res)
      this.loading = false
      // 提示用户编辑成功
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      // 更新数据方法
      this.getUserInfo()
      // 修改vuex中的数据
      this.updateUserInfo(res)
    },
    // 编辑用户头像的方法
    async editUserPhoto (data) {
      const fd = new FormData()
      fd.append('photo', data.file)
      let res = await this.$Http.editUserPhoto({
        data: fd
      })
      // 提示用户编辑成功
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      console.log(res)
      this.getUserInfo()
      // 修改vuex中的数据
      this.updateUserInfo(res)
    }
  }
}
</script>

<style>
.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-upload.el-upload--text {
  border: 1px dashed #ccc;
}
</style>

<template>
  <!-- 卡片容器 -->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>图片管理</span>
    </div>
    <div class="itemBtn">
      <div class="items">
        <el-radio-group v-model="currentRadio" size="mini" @change="radioChange">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="收藏"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="upload">
        <el-button type="primary" @click="uploadImg">上传素材</el-button>
      </div>
    </div>
    <!-- 放置素材 -->
    <el-row :gutter="40">
      <!-- 一行 -->
      <el-col :span="6" v-for="(item, index) in materials" :key="index" class="imgItem">
        <!-- 一列 -->
        <el-card class="mycard">
          <!-- 图片 -->
          <img class="myimg" :src="item.url" alt />
          <div class="mybtns">
            <el-button
              v-if="item.is_collected"
              type="text"
              @click="collectMaterial(false, item.id)"
            >
              <i class="el-icon-star-on"></i>
            </el-button>
            <el-button v-else type="text" @click="collectMaterial(true, item.id)">
              <i class="el-icon-star-off"></i>
            </el-button>
            <el-button type="text" @click="deleteMaterial(item.id)">
              <i class="el-icon-delete"></i>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页组件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total_count"
      @current-change="pageChange"
      @prev-click="pervClick"
      @next-click="nextClick"
      :disabled="disabled"
    ></el-pagination>
    <!-- 弹出的上传图片面板 -->
    <!-- el-dialog：面板 title 面板标题 ：visible.sync这个属性用来控制当前面板的显示和隐藏-->
    <el-dialog
      title="上传图片"
      :visible.sync="dialogFormVisible"
      v-loading="loading"
      element-loading-text="图片上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- el-upload: 上传的组件 action： 接收图片的服务器地址 show-file-list：不以列表的方式显示图片 -->
      <!-- on-success：成功时的钩子：上传图片成功后会执行的回调 -->
      <!-- before-upload:上传图片之前执行的回调函数 -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closePanle">关闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 当前选中radio框中的value值
      currentRadio: '全部',
      // 素材数据
      materials: [],
      // 素材总条数
      total_count: 0,
      // 当前页
      page: 1,
      // 页容量,每页数量,介于10-50之间
      per_page: 12,
      // 加载状态
      loading: false,
      // 禁用状态
      disabled: false,
      // 弹出框状态
      dialogFormVisible: false,
      // 上传组件中的图片地址
      imageUrl: '',
      // 上传的请求头
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
      }
    }
  },
  methods: {
    // 得到素材的方法
    // collect: true 收藏的数据 false 全部的数据
    async getMaterials (collect) {
      let res = await this.$Http.getMaterials({
        params: {
          collect,
          page: this.page,
          per_page: this.per_page
        }
      })
      // 保存素材数据
      this.materials = res.results
      this.total_count = res.total_count
    },
    // 判断请求全部数据还是收藏图片数据的方法,执行时机:radio单选框改变之后调用的方法,第一个参数为radio的value值,
    radioChange (value) {
      if (value === '全部') {
        // 加载全部图片数据
        this.getMaterials(false)
      } else {
        // 加载收藏图片数据
        this.getMaterials(true)
      }
    },
    // 收藏图片的方法
    async collectMaterial (collect, id) {
      let res = await this.$Http.collectMaterial({
        target: id,
        data: { collect }
      })
      this.$message({
        message: res.collect ? '收藏成功' : '取消收藏成功',
        type: 'success'
      })
      // 重新请求数据
      this.radioChange(this.currentRadio)
    },
    // 删除图片的方法
    async deleteMaterial (target) {
      await this.$Http.deleteMaterial({
        target
      })
      // 提示用户删除成功
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.radioChange(this.currentRadio)
    },
    // 上一页
    pervClick () {
      this.page--
      this.radioChange(this.currentRadio)
    },
    // 下一页
    nextClick () {
      this.page++
      this.radioChange(this.currentRadio)
    },
    // 点击页面
    pageChange (currentPage) {
      this.page = currentPage
      this.radioChange(this.currentRadio)
    },
    // 上传按钮的点击事件
    uploadImg () {
      // 打开一个面板
      this.dialogFormVisible = true
    },
    // 当上传图片之前的钩子函数
    beforeAvatarUpload () {
      this.loading = true
    },
    // 当上传图片成功后的钩子函数
    handleAvatarSuccess (response, file, fileList) {
      // response: 上传成功后返回的数据
      this.imageUrl = response.data.url
      this.loading = false
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
    },
    // 当上传图片失败后的钩子函数
    handleAvatarError () {
      // err: 上传失败后返回的数据
      this.loading = false
      this.$message({
        message: '图片上传失败,请检查图片格式后重试',
        type: 'error'
      })
      // 刷新数据
      this.radioChange(this.currentRadio)
    },
    // 关闭面板时触发
    closePanle () {
      // 先关闭
      this.dialogFormVisible = false
      // 清空预览中的图片
      this.imageUrl = ''
      // 刷新数据
      this.radioChange(this.currentRadio)
    }
  },
  created () {
    // 加载全部素材数据
    this.getMaterials()
  }
}
</script>

<style lang="less" scoped>
.itemBtn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.imgItem {
  margin-top: 20px;
}
.mycard {
  padding: 20px;
  padding-bottom: 0;
  .myimg {
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
  }
  .mybtns {
    display: flex;
    justify-content: space-around;
    i {
      font-size: 20px;
    }
  }
}
.el-pagination.is-background {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
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

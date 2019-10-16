<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <div class="text item">
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="标题">
            <el-input v-model="ruleForm.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <!-- bidirectional data binding（双向数据绑定） -->
            <quill-editor v-model="ruleForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面">
            <!-- 上传组件 -->
            <el-button class="avatar-uploader" @click="dialogVisible = true">
              <img v-if="ruleForm.cover.images[0]" :src="ruleForm.cover.images[0]" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-button>
          </el-form-item>
          <el-form-item label="选择频道">
            <!-- 频道列表组件 -->
            <channels @channel_idChange="getchannel_id" :mychannel="this.ruleForm.channel_id"></channels>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="publish(false)">发表</el-button>
            <el-button @click="publish(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-card>

    <!-- 封面选择弹出框 -->
    <el-dialog :visible.sync="dialogVisible" width="50%" top="15vh" @open="getMaterials">
      <span slot="title" class="header">
        <div class="left">
          <el-button type="primary">全部素材</el-button>
        </div>
        <div class="right">
          <el-button type="primary" @click="uploadImg">上传素材</el-button>
        </div>
      </span>
      <span class="content">
        <!-- 放置素材组件 -->
        <el-row :gutter="40">
          <!-- 一行 -->
          <el-col
            :span="6"
            v-for="(item, index) in materials"
            :key="index"
            class="imgItem"
            @click.native="chooseCover(item.url)"
          >
            <!-- 一列 -->
            <el-card class="mycard">
              <!-- 图片 -->
              <img class="myimg" :src="item.url" alt />
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
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
          <!-- 上传素材弹出框 -->
      <el-dialog
        title="上传图片"
        :visible.sync="innerVisible"
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
          <el-button type="primary" @click="innerVisible = false">关闭</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import channels from '@/components/channels'
export default {
  name: 'ArticlePublish',
  data () {
    return {
      ruleForm: {
        // 文章标题
        title: '',
        // 文章内容
        content: '',
        // 文章频道
        channel_id: '',
        // 编辑文章id
        target: '',
        // 封面路径
        cover: {
          // 封面类型
          type: 1,
          // 封面类型
          images: []
        }

      },
      // 素材数据
      materials: [],
      // 素材总条数
      total_count: 0,
      // 当前页
      page: 1,
      // 页容量,每页数量,介于10-50之间
      per_page: 8,
      // 加载状态
      loading: false,
      // 禁用状态
      disabled: false,
      // 对话框
      dialogVisible: false,
      // 上传图片对话框
      innerVisible: false,
      // 上传图片预览
      imageUrl: '',
      // 上传的请求头
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
      }
    }
  },
  created () {
    // 判断是否为编辑页面
    if (this.$route.path.includes('edit')) {
      // 编辑页面
      this.getEditId()
      this.getArtcleById()
    }
  },
  methods: {
    // 获取子组件传过来的频道id
    getchannel_id (value) {
      this.ruleForm.channel_id = value
    },
    // 按钮绑定的方法
    publish (draft) {
      // 判断是否为编辑页面
      if (this.$route.path.includes('edit')) {
        // 编辑页面调用编辑文章方法
        this.editArticle(draft)
      } else {
        // 发布文章页面调用发布文章方法
        this.pubArticle(draft)
      }
    },
    // 发表文章的方法
    async pubArticle (draft) {
      await this.$Http.pubArticle({
        params: { draft },
        data: this.ruleForm
      })
      this.$message({
        message: draft ? '成功存入草稿' : '发表成功',
        type: 'success'
      })
      // 跳转到内容页
      this.$router.push('/article/list')
    },
    // 获取编辑文章ID的方法
    getEditId () {
      this.target = this.$route.params.id
    },
    // 编辑文章的方法
    async editArticle (draft) {
      console.log(this.ruleForm)
      await this.$Http.editArticle({
        target: this.target,
        params: { draft },
        data: this.ruleForm
      })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      // 跳转到 list
      this.$router.push('/article/list')
    },
    // 获取指定文章
    async getArtcleById () {
      let res = await this.$Http.getArticleById({
        target: this.target
      })
      console.log(res)
      this.ruleForm = res
    },
    // 得到素材的方法
    async getMaterials () {
      let res = await this.$Http.getMaterials({
        params: {
          page: this.page,
          per_page: this.per_page
        }
      })
      // 保存素材数据
      this.materials = res.results
      this.total_count = res.total_count
    },
    // 选中图片的方法
    chooseCover (img) {
      this.ruleForm.cover.images[0] = img
      this.$message({
        message: '图片选择成功',
        type: 'success'
      })
      this.dialogVisible = false
    },
    // 上一页
    pervClick () {
      this.page--
      this.getMaterials()
    },
    // 下一页
    nextClick () {
      this.page++
      this.getMaterials()
    },
    // 点击页面
    pageChange (currentPage) {
      this.page = currentPage
      this.getMaterials()
    },
    // 上传按钮的点击事件
    uploadImg () {
      // 打开上传面板关闭图片选择面板
      this.innerVisible = true
      this.dialogVisible = false
    },
    // 当上传图片之前的钩子函数
    beforeAvatarUpload () {
      this.loading = true
    },
    // 当上传图片成功后的钩子函数
    handleAvatarSuccess (response, file, fileList) {
      // response: 上传成功后返回的数据
      this.imageUrl = this.ruleForm.cover.images[0] = response.data.url
      this.loading = false
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
      // 先关闭
      this.dialogVisible = this.innerVisible = false
      // 清空预览中的图片
      this.imageUrl = ''
    },
    // 当上传图片失败后的钩子函数
    handleAvatarError () {
      // err: 上传失败后返回的数据
      this.loading = false
      this.$message({
        message: '图片上传失败,请检查图片格式后重试',
        type: 'error'
      })
    },
    // 关闭面板时触发
    closePanle () {
      // 先关闭
      this.dialogVisible = this.innerVisible = false
      // 清空预览中的图片
      this.imageUrl = ''
    }
  },
  components: {
    channels
  },
  // 侦听器,侦听路由变化来判断是否为发表文章页面,因为从编辑路由跳转到发表文章路由Vue为了性能会优先重用组件中的dom结构,导致编辑文章留下的input框中的值也会遗留下来,所以要清空页面,或者给每个input框指定唯一的key值
  watch: {
    $route: function () {
      // 如果是发布新文章
      if (this.$route.path.includes('publish')) {
        // 清空数据
        this.ruleForm.title = this.ruleForm.content = this.ruleForm.channel_id = ''
      }
    }
  }
}
</script>

<style lang="less">
.ql-editor {
  height: 200px;
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
.el-dialog__body {
  padding: 30px 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .right {
    margin-right: 20px;
  }
}
.mycard {
  margin-top: 20px;
  .myimg {
    width: 100%;
    height: 150px;
  }
}
.el-pagination.is-background {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

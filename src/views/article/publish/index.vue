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
            <label>封面暂无</label>
          </el-form-item>
          <el-form-item label="选择频道">
            <!-- 频道列表组件 -->
            <channels @channel_idChange="getchannel_id" :mychannel="this.ruleForm.channel_id"></channels>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="publish('false')">发表</el-button>
            <el-button @click="publish('true')">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
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
        target: ''
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
        data: {
          title: this.ruleForm.title,
          content: this.ruleForm.content,
          channel_id: this.ruleForm.channel_id,
          cover: { // 图片：写死的
            type: 1,
            images: ['http://toutiao.meiduo.site/Fhp5OXHbYJzUdd8pCJGjX4i9K_7y']
          }
        }
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
</style>

<template>
  <div>
    <!-- 顶部区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!-- form表单区域 -->
      <el-form ref="form" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio v-model="status" label>全部</el-radio>
          <el-radio v-model="status" label="0">草稿</el-radio>
          <el-radio v-model="status" label="1">待审核</el-radio>
          <el-radio v-model="status" label="2">审核通过</el-radio>
          <el-radio v-model="status" label="3">审核失败</el-radio>
        </el-form-item>
        <el-form-item label="频道列表">
          <!-- 频道列表组件 -->
          <channels @channel_idChange="getchannel_id"></channels>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-button
        class="searchBtn"
        type="primary"
        round
        @click="searchArtcles"
        :loading="loading"
        :disabled="disabled"
      >搜索</el-button>
    </el-card>
    <!-- 文章显示区域 -->
    <el-card class="box-card mycard">
      <div slot="header" class="clearfix">
        <span>共找到{{total_count}}条符合条件的内容</span>
      </div>
      <!-- 表格区域 -->
      <el-table
        :data="articels"
        :stripe="true"
        :border="true"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="图片" align="center" width="180">
          <!-- 表单将来当前行不是显示 prop 属性对应的数据，而是显示 tempalte 中的内容 -->
          <!-- 给 template 设置属性： slot-scope -->
          <!-- 如果在 template 中需要使用到数据的话，必须通过 scope.row 属性来使用-->
          <!-- scope.row 是当前行的数据源 -->
          <template slot-scope="scope">
            <img class="myimg" :src="scope.row.cover.images[0]" alt />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题" width="180"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">草稿</span>
            <span v-if="scope.row.status === 1">待审核</span>
            <span v-if="scope.row.status === 2">审核通过</span>
            <span v-if="scope.row.status === 3">审核失败</span>
            <span v-if="scope.row.status === 4">已删除</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="pubdate" label="发布日期" width="180"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" round @click="editArticle(scope.row.id)">
              <i class="el-icon-edit"></i>修改
            </el-button>
            <el-button size="mini" round @click="delArticle(scope.row.id)">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total_count"
        @current-change="pageChange"
        @prev-click="pervClick"
        @next-click="nextClick"
        :disabled="disabled"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import channels from '@/components/channels'
export default {
  name: 'ArticleList',
  data () {
    return {
      // 频道id，不传为全部
      channel_id: '',
      // 起始&结束时间
      dateTime: [],
      // 加载动画
      loading: false,
      // 是否禁用分页
      disabled: false,
      // 文章列表
      articels: [],
      // 文章总条数
      total_count: 0,
      // 当前页
      page: 1,
      // 页容量,每页数量,介于10-50之间
      per_page: 10,
      // 文章状态,不传为全部
      status: '',
      // 起始时间
      begin_pubdate: '',
      // 截止时间
      end_pubdate: '',
      // 频道列表
      channels: ''
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    // 获取文章列表
    async getArticles () {
      this.loading = this.disabled = true
      let res = await this.$Http.getArticles({
        params: {
          page: this.page,
          per_page: this.per_page
        }
      })
      this.articels = res.results
      this.total_count = res.total_count
      this.loading = this.disabled = false
    },
    // 获取子组件的选择的频道
    getchannel_id (value) {
      this.channel_id = value
    },
    // 搜索文章
    async searchArtcles () {
      this.loading = this.disabled = true
      let paramsObj = {}
      // 判断搜索条件是否存在
      if (this.status) {
        paramsObj.status = this.status
      }
      if (this.channel_id) {
        paramsObj.channel_id = this.channel_id
      }
      if (this.dateTime) {
        [paramsObj.begin_pubdate, paramsObj.end_pubdate] = this.dateTime
      }
      let res = await this.$Http.getArticles({
        params: {
          page: this.page,
          per_page: this.per_page,
          ...paramsObj
        }
      })
      this.articels = res.results
      this.total_count = res.total_count
      this.loading = this.disabled = false
    },
    // 上一页
    pervClick () {
      this.page--
      this.searchArtcles()
    },
    // 下一页
    nextClick () {
      this.page++
      this.searchArtcles()
    },
    // 点击页面
    pageChange (currentPage) {
      this.page = currentPage
      this.searchArtcles()
    },
    // 删除文章
    async delArticle (target) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$Http.delArticle({ target })
        this.$message({ type: 'success', message: '删除成功!' })
        this.searchArtcles()
      } catch (err) {
        this.$message({
          message: '用户信息修改成功',
          type: 'success'
        })
      }
    },
    // 编辑文章
    editArticle (id) {
      this.$router.push(`/article/edit/${id}`)
    }
  },
  components: {
    channels
  }
}
</script>

<style scoped lang="less">
.mycard {
  margin-top: 20px;
}
.myimg {
  width: 150px;
  height: 100px;
}
.searchBtn {
  width: 50%;
}
</style>

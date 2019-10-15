<template>
  <el-card>
    <!-- 评论表格 -->
    <el-table v-loading="loading" :data="comments" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column label="评论状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.comment_status" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
      <el-table-column prop="fans_comment_count" label="粉丝评论数据"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="editCommentsStatus(scope.row)"
            type="text"
          >{{ scope.row.comment_status ? '关闭评论': '开启评论' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
</template>

<script>
export default {
  data () {
    return {
      // 评论的列表
      comments: [],
      // 文章总条数
      total_count: 0,
      // 当前页
      page: 1,
      // 页容量,每页数量,介于10-50之间
      per_page: 10,
      // 加载状态
      loading: false,
      // 禁用状态
      disabled: false
    }
  },
  methods: {
    // 得到评论数据的方法
    async getComments () {
      this.loading = this.disabled = true
      let res = await this.$Http.getComments({
        params: {
          page: this.page,
          per_page: this.per_page,
          response_type: 'comment'
        }
      })
      this.loading = this.disabled = false
      // 得到评论的列表
      this.total_count = res.total_count
      this.comments = res.results
    },
    // 修改文章评论状态的方法
    async editCommentsStatus (row) {
      let res = await this.$Http.editCommentsStatus({
        params: {
          // row是一个对象,取对象的id属性要转换为字符串
          article_id: row.id.toString()
        },
        data: {
          allow_comment: !row.comment_status
        }
      })
      console.log(res)
      // 重新请求评论数据
      this.getComments()
      // 显示提示信息
      this.$message({
        message: res.allow_comment ? '开启评论成功' : '关闭评论成功',
        type: 'success'
      })
    },
    // 上一页
    pervClick () {
      this.page--
      this.getComments()
    },
    // 下一页
    nextClick () {
      this.page++
      this.getComments()
    },
    // 点击页面
    pageChange (currentPage) {
      this.page = currentPage
      this.getComments()
    }
  },
  created () {
    // 获取评论数据
    this.getComments()
  }
}
</script>

<style>
.el-pagination.is-background {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

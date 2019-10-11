<template>
  <div>
    <!-- 顶部区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!-- form表单区域 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 文章显示区域 -->
    <el-card class="box-card mycard">
      <div slot="header" class="clearfix">
        <span>共找到{{totalCount}}条符合条件的内容</span>
      </div>
      <!-- 表格区域 -->
      <el-table :data="articels" :stripe="true" :border="true" style="width: 100%">
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
          <template>
            <el-button size="mini" round>
              <i class="el-icon-edit"></i>修改
            </el-button>
            <el-button size="mini" round>
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        region: '',
        resource: ''
      },
      value1: '',
      // 文章列表
      articels: [],
      // 文章总条数
      totalCount: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      let res = await this.$Http.getArticles()
      this.articels = res.results
      this.totalCount = res.total_count
    }
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
</style>

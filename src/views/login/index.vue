<template>
  <!-- 登录页面 -->
  <div class="login">
    <div class="login-warp">
      <!-- logo 区域 -->
      <div class="logo">
        <img src="./img/logo_index.png" alt />
      </div>
      <!-- el-form: 管理所有表单元素的父容器  ref: vue 中提供的操作 dom 的方式 model: 表单元素的数据源 label-width： 描述文本的宽度 -->
      <el-form ref="form" :model="form" :rules="rules" class="form">
        <!-- el-form-item：表单域 label: 当前选项的描述文字 -->
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- 一行 -->
          <el-row>
            <el-col :span="12">
              <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button
                class="code-btn"
                :disabled="!!timer"
                @click="getCode"
              >{{timer?`${formatTime}秒后获取`:'获取验证码'}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="read">
          <el-checkbox v-model="form.read" class="read">
            <span>我已阅读并同意</span>
            <a href="#">用户协议</a>
            <span>和</span>
            <a href="#">隐私条款</a>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" @click="login" type="primary" :loading="loginloading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      // 表单的参数
      form: {
        mobile: '13911111111',
        code: '246810',
        read: false
      },
      // 定义规则
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '长度必须为11', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度必须为6', trigger: 'blur' }
        ],
        read: [
          { pattern: /true/, message: '请阅读并同意用户协议', trigger: 'change' }
        ]
      },
      // 加载登录loading状态
      loginloading: false,
      // 倒计时的时间
      codeTime: 10,
      // 加载登录loading状态
      timer: null
    }
  },
  methods: {
    // 映射vuex中mutation中的方法
    ...mapMutations(['updateUserInfo']),
    // 用户登录
    login () {
      // 得到 el-form 元素
      // validate: 验证当前表单元素中所有的规则
      this.$refs['form'].validate(valid => {
        // 如果 valid 为 true 说明验证通过
        // 如果 valid 为 false 说明验证不通过
        if (valid) {
          this.submitData()
        } else {
          // 结束当前方法
          return false
        }
      })
    },
    // 数据的提交
    async submitData () {
      // 将加载状态设置为 true
      this.loginloading = true
      // 发送请求到服务器
      let res = await this.$Http.postLogin({ data: this.form })
      // res 中有一个属性叫做 data, 在 data 中有两个属性后面我们会用上： token , refresh_token
      // 只要进入到这个方法中说明登录成功
      this.updateUserInfo(res)
      this.$message({
        message: '登录成功',
        type: 'success'
      })
      // 将加载状态改为 false
      this.loginloading = false
      // 跳转到主页
      this.$router.push('/')
    },
    // 验证手机号码是否存在
    getCode () {
      // 获取 form 表单
      // validateField(field, callback)
      // field: 要验证的字段
      // callback：验证后的回调函数
      //    errMsg：验证不通过时的提示文本
      this.$refs['form'].validateField('mobile', errMsg => {
        if (errMsg) {
          // 说明验证不通过
          return
        }
        // 验证通过
        this.timer = setInterval(() => {
          this.codeTime--
          if (this.codeTime <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.codeTime = 10
          }
        }, 1000)
      })
    }
  },
  computed: {
    formatTime: function () {
      return this.codeTime.toString().padStart(2, '0')
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("./img/login_bg.jpg");
  .login-warp {
    background-color: #fff;
    padding: 30px;
    min-width: 300px;
    box-sizing: border-box;
    width: 400px;
    .logo {
      text-align: center;
      img {
        width: 150px;
        margin-bottom: 20px;
      }
    }
    .form {
      box-sizing: border-box;
      .login-btn {
        width: 100%;
      }
      .code-btn {
        width: 100%;
      }
      .read {
        color: #999;
        span {
          font-size: 14px;
        }
        a {
          color: #3296fa;
          font-size: 14px;
        }
      }
    }
  }
}
</style>

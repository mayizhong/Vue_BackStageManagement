<template>
  <div class="login-container">

    <!-- logo区域 -->
    <div class="logo">
      <a href="https://github.com/mayizhong/vue/blob/master/README.md" target="_blank">
        <img src="../assets/image/logo.png" alt="">
      </a>
    </div>

    <!-- 登录的表单 -->
    <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="loginform_style">
      <!-- 登录名 -->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username"
        placeholder="请输入用户名：admin"
        >
          <!-- 使用 slot 为 输入框设置图标 -->
          <i slot="prefix" class="iconfont icon-user"></i>
        </el-input>
      </el-form-item>
      <!-- 登录密码 -->
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder=" （可点击logo图标，查看详情）">
          <i slot="prefix" class="iconfont icon-3702mima"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>

       <el-popover
  ref="popover1"
  placement="top-start"
  title="关注公众号"
  width="260"
  trigger="hover"
  content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"><span>回复<span style="color:red;">体验</span>获取账号密码</span><img src="../assets/image/gongzhonghao.jpg" alt="">
</el-popover>

        <el-button type="info" v-popover:popover1>体验</el-button>
      </el-form-item>
    </el-form>
    <!--  -->
    <div id="introduce">
      <!-- <a href="https://github.com/mayizhong/vue/blob/master/README.md">点击查看项目介绍</a>  -->
      <!-- display: flex;
    justify-content: center; -->
    </div>
    <span style="width: 100%;color: gray; position: fixed; bottom: 0; right: 0;font-size: 12px;text-align: center;"><br>该项目为黑马教程下的【vue从入门到项目实战】，本人亲自维护，有源码素材+高清视频教程+接口文档，若有需要,！有偿8.8！，请联系qq:532526447</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录的表单绑定到的数据对象
      loginForm: {
        username: '',
        password: '',
        visible2: false
      },
      // 登录表单的验证规则
      loginFormRules: {
        // 登录名的校验规则
        username: [
          { required: true, message: '请输入登录名：admin', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        // 登录密码的校验规则
        password: [
          { required: true, message: '请点击‘体验’按钮获取体验账号', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    var lett = this
    document.onkeydown = function(e) {
      var key = window.event.keyCode
      if (key === 13) {
        lett.login()
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单项
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击按钮登录
    login() {
      /* eslint-disable */
      //this.$http.post({ method: 'get', url: '/index/Operation/index', baseURL: 'http://www.building.com', data: {}, responseType: 'json' }).then((response) => {}).catch(() => { alert(111) })
      //this.$http.post('http://129.226.76.172:9981/index/Operation/index')
      //this.$http.post('http://www.building.com/index/Operation/index')
      /* eslint-disable */
      // 验证表单
      this.$refs.loginFormRef.validate(async valid => {
        // 验证失败，立即return
        if (!valid) return
        // 发起登录的请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 登录失败
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 登录成功
        this.$message.success(res.meta.msg)
        // 把登录成功后的令牌，保存到 sessionStorage， 供后续接口使用
        window.sessionStorage.setItem('token', res.data.token)
        // 使用 JS API 实现登录跳转   this.$router
        // 跳转到 后台主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  width: 450px;
  height: 314px;
  background-color: #fff;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;

  .logo {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-60px);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .loginform_style {
    padding: 0 20px;
    margin-top: 110px;
  }

  .btns {
    display: flex;
    justify-content: center;
  }

  #introduce {
    position: absolute;
    top: 27%;
    width: 100%;
    text-align: center;
    a {
    text-decoration: none;
    }
  }
}
</style>

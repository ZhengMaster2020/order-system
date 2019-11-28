<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <div class="header">
          <img src="../assets/images/logo.png" class="logo" />
        </div>
        <div class="welcome">
          <img src="../assets/images/login-title.png" />
        </div>
        <div class="body form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="Username">
              <span slot="prepend">
                <img src="../assets/images/login-icon_people.png" />
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                v-model="form.password"
                type="password"
                placeholder="Password"
              >
              <span slot="prepend">
                <img src="../assets/images/login-icon_lock.png" />
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                long
                :loading="loading"
                @click="handleSubmit"
              >
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
      <div class="swiper">
        <Carousel autoplay>
          <Carousel-item>
            <div class="demo-carousel">
              <img src="../assets/images/login_swiper_01.jpg" />
            </div>
          </Carousel-item>
          <Carousel-item>
            <div class="demo-carousel">
              <img src="../assets/images/login_swiper_02.jpg" />
            </div>
          </Carousel-item>
          <Carousel-item>
            <div class="demo-carousel">
              <img src="../assets/images/login_swiper_03.jpg" />
            </div>
          </Carousel-item>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  layout: 'full',
  data() {
    return {
      loading: false,
      form: {},
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit() {
      console.log(123)
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // this.loading = true
          // window.localStorage.removeItem('menus')
          // setTimeout(() => {
          //   this.loading = false
          // }, 6000)
          // if (this.form.username === 'admin') {
          //     Cookies.set('access', 0);
          // } else {
          //     Cookies.set('access', 1);
          // }
          const LoginForm = {}
          LoginForm.LoginForm = this.form
          this.$API.login(LoginForm).then((res) => {
            if (res.code === 200) {
              // Cookies.set('user', this.form.username, { expires: 1 })
              Cookies.set('authorization', res.data, {
                expires: 1
              })
              // Cookies.set('real_name', res.data.real_name, { expires: 1 })
              this.$Message.success(res.message)
              // this.$store.commit(
              //   'setAvator',
              //   'https://oa.fandow.com/public/img/logo-min.png'
              // )
              this.$router.push({ path: '/' })
            } else {
              this.loading = false
            }
          })
        }
      })
    }
  }
}
</script>

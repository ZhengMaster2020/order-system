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
import { FILE_BASE_URL } from '../api/config';
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
      },
      client_id: 'af9fc0a207c018fb244e8d3b5c7d815c', // 应用ID
      client_secret: '1cfdb85d6ca1595dfa72fee59e7e9c67', // 应用Secret
      grant_type: 'password'
    }
  },
  methods: {
    handleSubmit() {
      // console.log(123)
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
          LoginForm.username	 = this.form.username
          LoginForm.password = this.form.password
          LoginForm.client_id = this.client_id
          LoginForm.client_secret = this.client_secret
          LoginForm.grant_type = this.grant_type
          this.$API.login(LoginForm).then((res) => {
            if (!res.code) {
              // Cookies.set('user', this.form.username, { expires: 1 })
              Cookies.set('authorization', res.access_token, {
                expires: 1
              })
              // Cookies.set('real_name', res.data.real_name, { expires: 1 })
              this.$API.getUserInfo().then((res) => {
                if (res.code === 0) {
                  this.$Message.success('登录成功!')
                  res.data.nowLoginAt = this.$format(new Date().getTime() / 1000, 'yyyy-MM-dd hh:mm:ss')
                  res.data.lastVisitAt = this.$format(res.data.lastVisitAt, 'yyyy-MM-dd hh:mm:ss')
                  window.localStorage.setItem('userInfo', JSON.stringify(res.data))
                  this.$router.push({path: '/'})
                }
              })
              // this.$store.commit(
              //   'setAvator',
              //   'https://oa.fandow.com/public/img/logo-min.png'
              // )
            } else {
              this.$Message.error('账号或者密码错误!')
              this.loading = false
            }
          }).catch(err => {
            console.log(err);
          })
        }
      })
    }
  }
}
</script>

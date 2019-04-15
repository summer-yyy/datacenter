<template>
  <div class="login">
    <div class="form">
      <p class="title">数据中心</p>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" @keydown.enter.native="handleSubmit('formInline')">
        <FormItem prop="username" required>
            <Input style="height: 36px; font-size: 14px;" type="text" v-model="formInline.username" placeholder="用户名">
            </Input>
        </FormItem>
        <FormItem prop="password" required>
            <Input style="height: 36px; font-size: 14px;" type="password" v-model="formInline.password" placeholder="密码">
            </Input>
        </FormItem>
        <FormItem>
            <Button style="width: 100%; height:36px; font-size: 16px;" type="primary" @click="handleSubmit('formInline')">登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import urlList from '@/http/apiUrl.js';

@Component({
  components: {
  },
})
export default class Login extends Vue {
  formInline: object = {
      username: '',
      password: ''
  }
  ruleInline: object = {
      username: [
          { required: true, message: ' ', trigger: 'blur' }
      ],
      password: [
          { required: true, message: ' ', trigger: 'blur' },
      ]
  }
  handleSubmit(name: string): void {
      let form: any = this.$refs[name as string]
      form.validate((valid: boolean) => {
          if (valid) {
            this.login();
          } else {
              // this.$Message.error('Fail!');
          }
      })
  }
  login (): void {
    urlList.common.login(this.formInline).then(res => { // sueccess 回调
      if (res.status == 1) {
        this.$Message.success('登录成功！');
        sessionStorage.isLogin = 1;
        this.$router.push({name: 'nodeList'});  
      } else {
        this.$Message.error(res.message);
      }
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
}
</script>
<style lang="less" scoped>
  @import '../assets/less/public';
  .login {
    height: 100%;
    background: url("../assets/images/bg_login.jpg") no-repeat center/cover;
    .form {
      background: rgba(0, 0, 0, 0.3);
      padding: 24px 50px;
      border-radius: 10px;
      .title {
        font-size: 24px;
        color: #fff;
        text-align: center;
        margin-bottom: 24px; 
      }
      width: 400px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
</style>

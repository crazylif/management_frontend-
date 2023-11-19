<template>
    <q-page class="flex flex-center">
      <q-card class="bg-grey-2 my-card q-px-md p-py-md">
      <div class="flex flex-center">
        <q-icon name="account_circle" color="grey-6" size="4rem" />
      </div>
      <q-card-section>
        <q-form @submit.prevent="onSubmit" 
        @reset="onReset" 
        class="q-gutter-md"
        ref="loginForm">
          <div>
            <q-input
              v-model="username"
              type="text"
              label="Your Username"
              lazy-rules
              :rules="[requiredValidate]"
            />
          </div>
          <div>
            <q-input
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="Your Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length >= 6) || 'Must be 6 characters at least.',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  @click="isPwd = !isPwd"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                />
              </template>
            </q-input>
          </div>
          <div>
            <q-btn label="Submit" type="submit" color="primary" style="width: 100%;" />
          </div>
          <div>
            <text-caption class="text-cyan-8">Not registered?
              <a href="/register">Create an Account</a>
            </text-caption>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { useLoginUserStore } from "../stores/loginUserStrore" 
  import { Notify } from 'quasar'
  import { requiredValidate } from "../utils/validations";
  export default defineComponent({
    name: 'LoginPage',
    data(){
      return{
        storeLogUser: useLoginUserStore(),
        isPwd: true,
        password: null,
        username: null
      }
    },
    methods:{
      requiredValidate,
      onReset(){
        this.username = null;
        this.password = null;
        this.isPwd = true;
      },
      onSubmit(){
        const data = {
          username: this.username,
          password: this.password
        }
        this.$api
        .post("/auth/login", data)
        .then((res)=>{
          if(res.status == 200){
            Notify.create({
              type: "positive",
              message: "Login sucessfully"
            });
            this.storeLogUser.userid = res.data.id;
            this.storeLogUser.fullname = res.data.fullname;
            this.storeLogUser.accessToken = res.data.accessToken;
            if(res.data.img != null){
              this.storeLogUser.avatar = this.$RESTAPI + "/file/" + res.data.img;
            }
            else{
              this.storeLogUser.avatar = "default-avatar.png";
            }
            this.$router.push("/user");
          }
        })
        .catch((err)=>{
          console.log(err);
          Notify.create({
            type: "negative",
            message: "Invalid username or password"
          });
        });
        this.$refs.loginForm.reset();
      }
    }
  })
  </script>
  
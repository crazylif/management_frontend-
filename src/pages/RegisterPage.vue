<template>
  <q-page class="flex flex-center">
    <q-card dark bordered class="bg-grey-2 my-card q-px-md p-py-md">
      <div class="flex flex-center" v-if="isShowIcon">
        <q-icon name="account_circle" color="grey-6" size="4rem" />
      </div>
      <div v-else>
        <q-img
          :src="imageUrl"
          :ratio="4 / 3"
          spinner-color="primary"
          spinner-size="82px"
        />
      </div>
      <q-card-section>
        <q-form
          @submit.prevent="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          ref="registerForm"
        >
          <div>
            <q-input
              v-model="fullname"
              type="text"
              label="Your Fullname"
              lazy-rules
              :rules="[requiredValidate]"
            />
          </div>
          <div>
            <q-input
              v-model="email"
              type="text"
              label="Your Email"
              lazy-rules
              :rules="[emailValidate, requiredValidate]"
            />
          </div>
          <div>
            <q-input
              v-model="username"
              type="text"
              label="Your Username"
              lazy-rules
              :rules="[requiredValidate]"
            />
            <text-caption
              style="font-size: 0.9em"
              v-if="usernameCaption.showStatus"
              :class="[
                usernameCaption.showClass ? 'text-positive' : 'text-negative',
              ]"
            >
              <q-icon :name="usernameCaption.icon" size="1.5em" />
              {{ usernameCaption.msg }}
            </text-caption>
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
            <!-- file size = 1MB -->
            <q-file
              outlined
              label="Your avatar"
              v-model="upload_avatar"
              accept=".jpg, .jpeg, .png"
              max-file-size="1048576"
              @rejected="onRejected"
              @update:model-value="updateFile()"
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
          <div>
            <text-caption class="text-cyan-8"
              >I already have an account
              <a href="">Login</a>
            </text-caption>
          </div>
        </q-form>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        {{ lorem }}
      </q-card-section>
    </q-card>
    <dialog-component
      v-model="showDialog"
      :propDialog="dialog"
    ></dialog-component>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { emailValidate, requiredValidate } from "../utils/validations";
import { Notify } from "quasar";
import DialogComponent from "src/components/DialogComponent.vue";
import { useLoginUserStore } from "../stores/loginUserStrore";
export default defineComponent({
  name: "RegisterPage",
  data() {
    return {
      fullname: null,
      email: null,
      username: null,
      password: null,
      isPwd: true,
      upload_avatar: null,
      isShowIcon: true,
      imageUrl: "",
      usernameCaption: {
        showStatus: false,
        showClass: false,
        icon: null,
        msg: null,
      },
      showDialog: false,
      dialog: {
        icon: "",
        msg: "",
        btnType: "",
        iconColor: "primary",
      },
      storeLogUser: useLoginUserStore(),
    };
  },
  methods: {
    emailValidate,
    requiredValidate,
    onRejected(rejectedEntries) {
      let msg;
      if (rejectedEntries[0].failedPropValidation == "accept")
        msg = "Only images (jpg, jpeg, png) are allowed";
      else if (rejectedEntries[0].failedPropValidation == "max-file-size")
        msg = "File size cannot be larger than 1MB";
      Notify.create({
        type: "negative",
        message: msg,
      });
    },
    updateFile() {
      this.isShowIcon = false;
      this.imageUrl = URL.createObjectURL(this.upload_avatar);
    },
    usernameValidate() {
      if (this.username) {
        this.$api
          .get("/auth/" + this.username)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            if (response.data.valid) {
              this.usernameCaption.showStatus = true;
              this.usernameCaption.showClass = true;
              this.usernameCaption.icon = "check_circle";
              this.usernameCaption.msg = "This username is Available.";
            } else {
              this.usernameCaption.showStatus = true;
              this.usernameCaption.showClass = false;
              this.usernameCaption.icon = "highlight_off";
              this.usernameCaption.msg = "This username is NOT Available.";
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.resetUserCaption();
      }
    },
    resetUserCaption() {
      this.usernameCaption.showStatus = false;
      this.usernameCaption.showClass = false;
      this.usernameCaption.icon = null;
      this.usernameCaption.msg = null;
    },
    onReset() {
      this.fullname = null;
      this.email = null;
      this.username = null;
      this.password = null;
      this.isPwd = true;
      this.resetUserCaption();
      this.upload_avatar = null;
      this.isShowIcon = true;
      this.imageUrl = "";
    },
    onSubmit() {
      // 1. upload file API
      // 2. user registration API
      if (this.upload_avatar == "") this.upload_avatar = null;
      if (this.upload_avatar) {
        //call upload file API
        const headers = {
          "Content-Type": "multipart/form-data",
        };
        const formData = new FormData();
        formData.append("singlefile", this.upload_avatar);
        this.$api
          .post("/file/upload", formData, { headers })
          .then((response) => {
            if (response.status == 200) {
              // call user registration API
              this.submitData(response.data.uploadFileName);
            }
          })
          .catch((err) => {
            console.log(err);
            this.showErrorDialog(err);
          });
      } else {
        //not call upload file API
        // call user registration API
        this.submitData(null);
      }
    },
    submitData(filename) {
      const data = {
        fullname: this.fullname,
        email: this.email,
        username: this.username,
        password: this.password,
        img: filename,
      };
      console.log(JSON.stringify(data));
      console.log("p1:" + data.password + " p2: " + this.password);
      this.$api
        .post("/auth/signup", data)
        .then((response) => {
          if (response.status == 200) {
            this.showDialog = true;
            this.dialog.icon = "task_alt";
            this.dialog.iconColor = "primary";
            this.dialog.msg =
              "<div class='text-h6'>Welcome, <br>" +
              response.data.fullname +
              "</div>Your account has been created successfully.";
            this.dialog.btnType = "Signup";
            this.storeLogUser.userid = response.data.id;
            this.storeLogUser.fullname = response.data.fullname;
            this.storeLogUser.accessToken = response.data.accessToken;
            if (response.data.img != null) {
              this.storeLogUser.avatar =
                this.$RESTAPI + "/file/" + response.data.img;
            } else {
              this.storeLogUser.avatar = "default-avatar.png";
            }
          }
          this.$refs.registerForm.reset();
        })
        .catch((err) => {
          console.log(err);
          this.showErrorDialog(err);
        });
    },
    showErrorDialog(err) {
      this.showDialog = true;
      this.dialog.icon = "error";
      this.dialog.msg = err;
      this.dialog.iconColor = "negative";
      this.dialog.btnType = "Error";
    },
  },
  watch: {
    username() {
      this.usernameValidate();
    },
  },
  components: { DialogComponent },
});
</script>

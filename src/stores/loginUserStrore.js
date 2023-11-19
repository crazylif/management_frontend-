import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
export const useLoginUserStore = defineStore("loginuser", {
  state: () => ({
    userid: useStorage("userid", ""),
    fullname: useStorage("fullname", ""),
    accessToken: useStorage("accessToken", ""),
    avatar: useStorage("avatar", ""),
  }),
  getters: {
    getFullname: (state) => {
      return state.fullname;
    },
    getUserid: (state) => {
      return state.userid;
    },
    getAccessToken: (state) => {
      return state.accessToken;
    },
    getAvatar: (state) => {
      return state.avatar;
    },
  },
  actions: {
    clearStorage() {
      this.userid = "";
      this.fullname = "";
      this.accessToken = "";
      this.avatar = "";
    },
  },
});

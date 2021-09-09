import { auth, storage, firebaseAuth } from "../instances/firebase";
import axios from "../instances/axios";
import userApi from "~/APIs/user";
/* eslint-disable */

const userStorageRef = storage.ref("users");

export const state = () => ({
  email: null,
  entityId: null,
  organization: null,
  location: {
    address: "",
    position: null
  },
  image: null,
  type: null,
  adminContact: {
    name: "",
    phone: "",
    alt: ""
  },
  citizenContact: {
    phone: "",
    website: "",
    lineId: "",
    facebook: "",
    email: ""
  },
  reserveMode:0,
  reserveValue:1,
  reserveDate:null,
  reserveTime:null,
  active: false,
  authListener: null
});

export const mutations = {
  setState(state, { stateName, value }) {
    state[stateName] = value;
  }
};

export const actions = {
  async fetchUserInfo({ state, commit }) {
    const entityInfo = await userApi()._getEntity(state.entityId);
    for (const info in entityInfo.data) {
      commit("setState", { stateName: info, value: entityInfo.data[info] });
    }
  },
  async updateUserInfo({ state, commit, dispatch }, updatePayload) {
    try {
      dispatch("appState/toggleIsLoading", null, { root: true });
      const payload = { ...updatePayload, entityId: state.entityId };
      if (payload.image instanceof File) {
        const imageRef = userStorageRef.child(`${state.entityId}/logo.jpg`);
        const resizeRef = userStorageRef.child(
          `${state.entityId}/logo_360x120.jpg`
        );
        await imageRef.put(updatePayload.image);
        await new Promise(resolve => setTimeout(resolve, 7000));
        const imageUrl = await resizeRef.getDownloadURL();
        payload.image = imageUrl;
      }
      await userApi()._putEntity(payload);
      for (const field in payload) {
        commit("setState", { stateName: field, value: payload[field] });
      }
      dispatch(
        "appState/toggleNotification",
        {
          content: "บันทึกข้อมูลสำเร็จ",
          type: "success",
          delay: 3000
        },
        { root: true }
      );
    } catch (error) {
      dispatch(
        "appState/toggleNotification",
        {
          content: "error occured",
          type: "error",
          delay: 3000
        },
        { root: true }
      );
    }finally{
      dispatch("appState/toggleIsLoading", null, { root: true });
    }
  },
  async init({ dispatch }) {
    await dispatch("getAuthUser");
    dispatch("report/fetchReport", null, { root: true });
    dispatch("preRegister/init", null, { root: true });
    dispatch("queueTable/init", null, { root: true });

    console.log("init user success");
  },
  getAuthUser({ state, commit, dispatch }) {
    return new Promise(resolve => {
      const authListener = auth.onAuthStateChanged(async user => {
        if (user) {
          const token = await user.getIdToken();
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          if (!state.entityId) {
            const { data } = await userApi()._get(user.uid);
            commit("setState", { stateName: "entityId", value: data.entityId });
            commit("setState", { stateName: "email", value: user.email });
            commit("setState", {
              stateName: "authListener",
              value: authListener
            });
            await dispatch("fetchUserInfo");
            console.log("success");
          }
          resolve();
        }
      });
    });
  },
  async signup({ state, commit, dispatch }, signupForm) {
    try {
      dispatch("appState/toggleIsLoading", null, { root: true });
      if (state.authListener) {
        state.authListener();
      }
      const { email, password,mobile } = signupForm;
      const { user} = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const token = await auth.currentUser.getIdToken();
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const userInfo = { uid: user.uid, email: user.email,mobile};
      const { data } = await userApi()._post(userInfo);
      const entityInfo = { entityId: data.entityId };
      for (const info in entityInfo) {
        commit("setState", { stateName: info, value: entityInfo[info] });
      }
      dispatch(
        "appState/toggleNotification",
        {
          content: "สมัครสมาชิกสำเร็จ",
          type: "success",
          delay: 3000
        },
        { root: true }
      );
      dispatch("init")
      setTimeout(()=>{
        this.$router.push({name:'entity'})
      },2000)
    } catch (error) {
      let errorMessage = "error occured";
      if (error.message) {
        errorMessage = error.message;
      }
      dispatch(
        "appState/toggleNotification",
        {
          content: errorMessage,
          type: "error",
          delay: 3000
        },
        { root: true }
      );
    } finally {
      dispatch("appState/toggleIsLoading", null, { root: true });
    }
  },
  changePassword({ dispatch }, { oldPassword, newPassword }) {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch("appState/toggleIsLoading", null, { root: true });
        const user = auth.currentUser;
        const credential = firebaseAuth.EmailAuthProvider.credential(
          user.email,
          oldPassword
        );
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
        dispatch("appState/toggleIsLoading", null, { root: true });
        dispatch(
          "appState/toggleNotification",
          {
            content: "เปลี่ยนหรัสผ่านเรียบร้อย",
            type: "success",
            delay: 3000
          },
          { root: true }
        );
        resolve();
      } catch (error) {
        dispatch("appState/toggleIsLoading", null, { root: true });
        dispatch(
          "appState/toggleNotification",
          {
            content: `${error}`,
            type: "error",
            delay: 3000
          },
          { root: true }
        );
        reject();
      }
    });
  },
  async resetPassword({ dispatch }, email) {
    return new Promise(async resolve => {
      try {
        await auth.sendPasswordResetEmail(email);
        dispatch(
          "appState/toggleNotification",
          {
            content: `ระบบได้ทำการส่งอีเมล์ไปที่ ${email}`,
            type: "success",
            delay: 3000
          },
          { root: true }
        );
        resolve();
      } catch (error) {
        console.log(error);
        dispatch(
          "appState/toggleNotification",
          {
            content: "error occured",
            type: "error",
            delay: 3000
          },
          { root: true }
        );
      }
    });
  },
  async signin({ dispatch }, signinForm) {
    try {
      const { email, password } = signinForm;
      await auth.signInWithEmailAndPassword(email, password);
      await dispatch("init");
    } catch (error) {
      dispatch(
        "appState/toggleNotification",
        {
          content: `${error}`,
          type: "error",
          delay: 3000
        },
        { root: true }
      );
    }
  }
};

export const getters = {};

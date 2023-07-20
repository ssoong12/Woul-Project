import {configureStore, createSlice } from '@reduxjs/toolkit'


let voice = createSlice({
    name : 'voice',
    initialState : {voiceID : 0},
    reducers : {
        changeVoiceID(state, action){
            state.voiceID = action.payload
        }
    }
});

let inner_login=createSlice({
  name:'inner_login',
  initialState:{id:"hhh",isLogin:false},
  
  reducers:{
      innerLoginUser(state,action){
          state.id=action.payload.inner_id;
          state.isLogin=true
      },
      clearUser(state,action){
          state.id="";
          state.isLogin=false;
      }
  }
});
export let { changeVoiceID } = voice.actions
export let { innerLoginUser } = inner_login.actions

export default configureStore({
  reducer: { 
    voice : voice.reducer,
    inner_login:inner_login.reducer
    }
})


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    nickname: null,
    firstname: null,
    lastname: null,
    email: null,
    clerkId: null,
    picture: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateNickname: (state, action) => {
      state.value.nickname = action.payload;
    },
    updateFirstname: (state, action) => {
      state.value.firstname.push(action.payload);
    },
    updateLastname: (state, action) => {
      state.value.lastname = action.payload;
    },
    updateEmail: (state, action) => {
      state.value.email = action.payload;
    },
    updatePicture: (state, action) => {
      state.value.picture = action.payload;
    },
  },
});

export const {
  updateNickname,
  updateFirstname,
  updateLastname,
  updateEmail,
  updatePicture,
} = userSlice.actions;
export default userSlice.reducer;

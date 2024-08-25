import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: undefined,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setUserData: (state,action) => {
            state.userData = action.payload;
        },
        updateUserData: (state, action) => {
            state.userData = { ...state.userData, status: action.payload };
        },
    }
})
export const {
    setUserData,
    updateUserData
} = authSlice.actions;

export const selectedUserData = (state) => state.auth.userData;

export default authSlice.reducer;
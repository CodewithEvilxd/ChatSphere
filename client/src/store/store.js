import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import usersReducer from "./slices/usersSlice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        users: usersReducer,
    },
})
export default store;

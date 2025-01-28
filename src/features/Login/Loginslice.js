import { createSlice } from "@reduxjs/toolkit";
//import { instance } from "../../../utils"
//import { useDispatch, useSelector } from "react-redux";


const LoginSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        data: {},
        token: null
    },
    reducers: {
        LoginRequest: (state, action) => {
            return { ...state, loading: true }
        },
        LoginSuccess: (state, action) => {
            return { ...state, loading: false, data: action.payload.result, token: action.payload.token }
        },
        UpdateProfile: (state, action) => {

            return { ...state, loading: false, data: action.payload.result }
        },
        LoginFail: (state, action) => {
            return { ...state, loading: false, data: {}, token: null }
        },
        logoutRequest: (state, action) => {
            return { ...state, loading: true }
        },
        logoutSucces: (state, action) => {
            return { ...state, loading: false, data: {}, token: null }
        }
    }
})

export const { LoginRequest, LoginSuccess, LoginFail, logoutRequest, logoutSucces, UpdateProfile } = LoginSlice.actions;
export default LoginSlice.reducer;
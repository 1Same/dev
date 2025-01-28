import { createSlice } from "@reduxjs/toolkit";


const countrySlice = createSlice({
    name: 'country',
    initialState: {
        country: {}
    },
    reducers: {
        setCounrtyData: (state, action) => {
            return { ...state, country: action.payload }
        }
    }
})

export const { setCounrtyData } = countrySlice.actions;
export default countrySlice.reducer;
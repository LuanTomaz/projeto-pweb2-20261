import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null
    token: string | null
    loading: boolean
    error: string | null
}    

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
})

export default authSlice.reducer
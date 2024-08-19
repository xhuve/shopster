import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: USERS_URL + '/login',
                method: 'POST',
                body: data
            }),
            keepUnusedDataFor: 5
        }),
        register: builder.mutation({
            query: (data) => ({
                url: USERS_URL,
                method: 'POST',
                body: data
            }),
            keepUnusedDataFor: 5
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'GET'
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                URL: `${USERS_URL}/profile`,
                method: "PUT",
                body: data
            })
        })
    }),
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation } = usersApiSlice
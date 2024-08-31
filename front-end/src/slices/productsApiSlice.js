import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword, pageNumber }) => ({
                url: PRODUCTS_URL,
                params: { pageNumber, keyword }
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`
            }),
            keepUnusedDataFor: 5
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: "POST"
            }),
            invalidatesTags: ['Products']
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data._id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Products']
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: '/api/upload',
                method: 'POST',
                body: data
            })
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Products']
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Products']
        }),
        getTopProduts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`
            })
        })
    }),
})

export const { useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProdutsQuery
} = productsApiSlice
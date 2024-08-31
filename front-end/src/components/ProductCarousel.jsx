import React from 'react'
import { useGetTopProdutsQuery } from '../slices/productsApiSlice'
import Loader from './Loader'
import Message from './Message'
import { Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ProductCarousel = () => {
    const { data: products, error, isLoading} = useGetTopProdutsQuery()


    return isLoading ? <Loader /> : error ? <Message>{error?.data?.message || error?.error}</Message> : (
        <Carousel pause='hover' className='bg-dark my-3'>
            { products.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className='carousel-caption'>
                            <h2>{product.name} (${product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            )) }
        </Carousel>
    )
}

export default ProductCarousel
import React from 'react'
import { useGetTopProdutsQuery } from '../slices/productsApiSlice'
import Loader from './Loader'
import Message from './Message'
import { Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ProductCarousel = () => {
    const { data: products, error, isLoading} = useGetTopProdutsQuery()


    return isLoading ? <Loader /> : error ? <Message>{error?.data?.message || error?.error}</Message> : (
        <Carousel pause='hover' className='mx-auto bg-dark my-3 w-75' variant='dark'>
            { products.map((product) => {
                const promoPath = product.image.replace(/(\/[^\/]+)(\.jpg)$/, "$1-promo$2")
                return (
                <Carousel.Item key={product._id}>
                    <Link className="text-center" to={`/product/${product._id}`}>
                        <Image style={{height: 400, width: "100%"}} className='mh-75 mx-auto d-block' src={promoPath} alt={product.name} fluid />
                        <Carousel.Caption className='carousel-caption text-white'>
                            <h2>{product.name} (${product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            )})
            }
        </Carousel>
    )
}

export default ProductCarousel
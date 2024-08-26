import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Message from '../components/Message'

const HomeScreen = () => {
    const { data: products, isError, isLoading  } = useGetProductsQuery()

    return (
    <>
        { isLoading ? (<Loader />) : 
        isError ? (
        <Message>
            { isError?.data?.message || isError?.isError }
        </Message> ) : (
            <>
                <h1>Latest Products</h1>
                <Row>
                    {products.map((x) => (
                        <Col key={x._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={x}>{x.name}</Product>
                        </Col>
                    ))}
                </Row>
            </>
        ) }
    </>
    )
}

export default HomeScreen
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Message from '../components/Message'
import { Link, useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams()
    const { data, isError, isLoading  } = useGetProductsQuery({ keyword, pageNumber })

    return (
    <>
        { !keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Go Back</Link> }
        { isLoading ? (<Loader />) : 
        isError ? (
        <Message>
            { isError?.data?.message || isError?.isError }
        </Message> ) : (
            <>
                <h1>Latest Products</h1>
                <Row>
                    {data.products.map((x) => (
                        <Col key={x._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={x}>{x.name}</Product>
                        </Col>
                    ))}
                </Row>
                <Paginate pages={data.pages} page={data.page} keyword={keyword}/>
            </>
        ) }
    </>
    )
}

export default HomeScreen
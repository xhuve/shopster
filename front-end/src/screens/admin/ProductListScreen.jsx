import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'
import { useCreateProductMutation, useGetProductsQuery } from '../../slices/productsApiSlice'


const ProductListScreen = () => {

    const {data: products, isLoading, error, refetch } = useGetProductsQuery()

    const [createProduct, { isLoading: createLoading, error: createError}] = useCreateProductMutation()

    const handleDelete = (id) => {
        console.log(id)
    }

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct()
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    return (
        <>
            <Row>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-end'>
                    <Button onClick={createProductHandler} className='btn-sm m-3'>
                        <FaEdit /> Create Product
                    </Button>
                </Col>
            </Row>

            
            { isLoading ? <Loader /> : error ? 
                <Message variant='danger'>{error}</Message> : (
                <>
                    <Table striped hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='info' className='btn-sm justify-content-center align-items-center'>
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button onClick={() => handleDelete(product._id)} variant='danger' className='btn-sm'>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {createLoading && <Loader />}
                </>
            )}
        </>
    )
}

export default ProductListScreen
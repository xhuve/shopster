import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap"
import { useGetProductByIdQuery } from "../slices/productsApiSlice"
import { useDispatch } from "react-redux"
import { useState } from "react"
import { addToCart } from "../slices/cartSlice"
import Rating from '../components/Rating'
import Loader from "../components/Loader"
import Message from "../components/Message"

const ProductScreen = () => {
    const { id:productId } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [qty, setQty] = useState(1)
    
    const {data: product, isLoading, isError} = useGetProductByIdQuery(productId)
    
    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
    }


    return (
        <>
            {isLoading ? <Loader /> : isError ? <Message variant='danger'>{isError?.data?.message || isError.error}</Message> :
            <>
                <Link className="btn btn-light my-3" to="/">
                    Go Back
                </Link>
                <Row>
                    <Col md={5}>
                        <Image src={product?.image} alt={product.name} fluid className="rounded" />
                    </Col>
                    <Col md={4}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating rating={product.rating} text={`${product.numReviews}`} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: {product.price} $
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                                <Form.Control 
                                                as='select'
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                                >
                                                    { [...Array(product.countInStock)].map((x, i) => {
                                                        i += 1
                                                        return <option key={i} value={i}>{i}</option>
                                                    }) }
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                <ListGroup.Item>
                                    <Button className="btn-block" type='block'
                                        disabled={product.countInStock === 0}
                                        onClick={addToCartHandler}
                                    >
                                        Add to Cart
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
            }
        </>
    )
}

export default ProductScreen
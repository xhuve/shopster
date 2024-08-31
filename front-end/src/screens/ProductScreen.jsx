import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap"
import { useCreateReviewMutation, useGetProductByIdQuery } from "../slices/productsApiSlice"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useState } from "react"
import { addToCart } from "../slices/cartSlice"
import Rating from '../components/Rating'
import Loader from "../components/Loader"
import Meta from "../components/Meta"
import Message from "../components/Message"

const ProductScreen = () => {
    const { id:productId } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [reviewDetails, setReviewDetails ] = useState({ rating: 0, comment: '' }) 

    const { userInfo } = useSelector(state => state.auth)

    const [qty, setQty] = useState(1)
    
    const {data: product, isLoading, isError, refetch} = useGetProductByIdQuery(productId)

    const [createReview, { isLoading: reviewLoading, isError: reviewError }] = useCreateReviewMutation()
    
    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
    }

    const submitHandler = async (e) => {
        try {
            await createReview({...reviewDetails, productId: productId}).unwrap()
            refetch()
            toast.success("Review submitted")
            setReviewDetails({ rating: 0, comment: '' })
        } catch (error) {
            toast.error(error.data?.message || error.error)
        }
    }

    return (
        <>
            {isLoading ? <Loader /> : isError ? <Message variant='danger'>{isError?.data?.message || isError.error}</Message> :
            <>
                <Meta title={product.name} />
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
                <Row className="review">
                    <Col md={6}>
                        <h2>Reviews</h2>
                        {product.reviews.length === 0 ? <Message>No Reviews</Message> : (
                            <ListGroup variant='flush'>
                                {product.reviews.map(review => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating rating={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                        <ListGroup.Item>
                            <h2>Write a Review</h2>

                            {reviewLoading && <Loader />}

                            {reviewError && <Message>`${reviewError}`</Message>}

                            { userInfo ? (
                                <Form onSubmit={submitHandler}>
                                    <Form.Group>
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control
                                            as='select'
                                            value={reviewDetails.rating}
                                            onChange={(e) => setReviewDetails({ ...reviewDetails, rating: e.target.value })}
                                        >
                                            <option value=''>Select...</option>
                                            <option value='1'>1 - Poor</option>
                                            <option value='2'>2 - Fair</option>
                                            <option value='3'>3 - Good</option>
                                            <option value='4'>4 - Very Good</option>
                                            <option value='5'>5 - Excellent</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            value={reviewDetails.comment}
                                            onChange={(e) => setReviewDetails({ ...reviewDetails, comment: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Button disabled={reviewLoading} type='submit' variant='primary'>
                                        Submit
                                    </Button>
                                </Form>
                            ) : (
                                <Message>Please log in to review</Message>
                            ) }
                        </ListGroup.Item>
                    </Col>
                </Row>
            </>
            }
        </>
    )
}

export default ProductScreen
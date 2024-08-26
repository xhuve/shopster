import { Link, useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../slices/cartSlice'

const CartScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart)
    const { cartItems } = cart

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({...product, qty}))
    }

    const removeToCartHandler = async (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = (e) => {
        navigate("/login?redirect=/shipping")
    }

    return (
        <Row>
            <Col md={8}>
                <h1 style={{marginTop: '20px'}}> Shopping cart </h1>
                { cartItems.length === 0 ? (
                    <Message>
                        Your cart is empty <Link to='/'>Go back</Link>
                    </Message>
                ) : (
                    <ListGroup variant='flush'>
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item._id}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={ item.image } alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                    </Col>
                                    <Col>{item.price}</Col>
                                    <Col>
                                        <Form.Control 
                                        as='select'
                                        value={item.qty}
                                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                        >
                                            { [...Array(item.countInStock)].map((x, i) => {
                                                i += 1
                                                return <option key={i} value={i}>{i}</option>
                                            }) }
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button onClick={() => removeToCartHandler(item._id)} type="button" variant='white'>
                                            <FaTrash />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card className='mt-5'>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({ cartItems.reduce((a, c) => a + c.qty, 0) }) items
                            </h2>
                            ${ cartItems.reduce((a, c) => a + c.price * c.qty, 0) }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button onClick={checkoutHandler} type='button' className='btn-block' disabled={cartItems.length === 0  }>
                                Proceed to Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
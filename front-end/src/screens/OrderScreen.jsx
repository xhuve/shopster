import { useParams } from "react-router-dom"
import { ListGroup, Row, Col, Image, Card, Button } from "react-bootstrap"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from "../slices/ordersApiSlice"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useEffect } from "react"
import { useSelector } from "react-redux"

// Work on date management
const OrderScreen = () => {
    const { id: orderId } = useParams()
    const { data: order, refetch, error, isLoading } = useGetOrderDetailsQuery(orderId)

    const { userInfo } = useSelector(state => state.auth)

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation()

    const [ deliverOrder, { isLoading: loadingDeliver } ] = useDeliverOrderMutation()

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

    const { data: paypal, isLoading: loadingPaypal, error: errorPayPal } = useGetPayPalClientIdQuery()

    useEffect(() => {
        console.log("🚀 ~ useEffect ~ paypal:", paypal)
        if (!errorPayPal && !loadingPaypal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD"
                    }
                })
                paypalDispatch({ type: "setLoadingStatus", value: "pending" })
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript()
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPaypal, errorPayPal])

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {
                await payOrder({ orderId, details})
                refetch()
                toast.success("Payment successful")
            } catch (error) {
                console.log("🚀 ~ returnactions.order.capture ~ error:", error)
                toast.error(error?.data?.message || error?.message)
            }
        })
    }

    const onApproveTest = async () => {
        await payOrder({ orderId, details: { payer: {}}})
        refetch()
        toast.success("Payment successful")
    }

    const onError = (error) => {
        toast.error(error.message)
    }

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice
                    }
                }
            ]
        }).then((orderId) => {
            return orderId
        })
    }

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId)
            refetch()
            toast.success("Order delivered")
        } catch (error) {
            toast.error(error?.data?.message || error?.message)
        }
    }

    return isLoading ? <Loader /> : error ? (
        <Message variant='danger'>{error}</Message>
        ) : (
            <>
                <h1>Order</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name:</strong> {order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong> { order.user.email }
                                </p>
                                <p>
                                    <strong>Address:</strong> { order.shippingAddress.address } , { order.shippingAddress.city },
                                    { order.shippingAddress.postalCode } , { order.shippingAddress.country }
                                </p>
                                { order.isDelivered ? (
                                    <Message variant='success'>Delivered on { order.deliveredAt }</Message>
                                ) : (
                                    <Message variant='danger'>Not Delivered</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method:</strong> { order.paymentMethod }
                                </p>
                                { order.isPaid ? (
                                    <Message variant='success'>Paid on { order.paidAt }</Message>
                                ) : (
                                    <Message variant='danger'>Not Paid</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                { order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x ${item.price} = ${item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )) }
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                { !order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}

                                        { isPending ? <Loader /> : (
                                            <div>
                                                <Button onClick={ onApproveTest } style={{marginBottom: '10px'}}>
                                                    Test Pay Order
                                                </Button>
                                                <PayPalButtons 
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                />
                                            </div>
                                        ) }
                                    </ListGroup.Item>
                                )}

                                { loadingDeliver && <Loader /> }

                                { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                                            Mark as delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
        )
}

export default OrderScreen
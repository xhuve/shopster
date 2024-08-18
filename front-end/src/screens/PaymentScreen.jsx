import { useEffect, useState } from "react"
import FormContainer from "../components/FormContainer"
import { Button, Form, Col } from "react-bootstrap"
import CheckoutSteps from "../components/CheckoutSteps"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { savePaymentMethod } from "../slices/cartSlice"

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal')
    const { shippingAddress } = useSelector(state => state.cart)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/place-order')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check 
                            type='radio'
                            className='my-2'
                            label='PayPal or Credit Card'
                            name='paymentMethod'
                            id='PayPal'
                            value='Paypal'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary'>Continue</Button>
            </Form>
        </FormContainer>
      )
}

export default PaymentScreen
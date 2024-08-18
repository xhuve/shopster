import { useState } from "react"
import FormContainer from "../components/FormContainer"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { saveShippingAddress } from "../slices/cartSlice"
import { useNavigate } from "react-router-dom"
import CheckoutSteps from "../components/CheckoutSteps"

const ShippingScreen = () => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const [shippingForm, setShippingForm] = useState({ address: shippingAddress?.address || '', city: shippingAddress?.city || '', 
        postalCode: shippingAddress?.postalCode ||'', country: shippingAddress?.country || '' })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        console.log("🚀 ~ handleSubmit ~ shippingForm:", shippingForm)
        e.preventDefault()
        dispatch(saveShippingAddress(shippingForm))
        navigate('/payment')
    }

    const handleChange = (e) => {
        setShippingForm({ ...shippingForm, [e.target.name]: e.target.value })
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <Form onSubmit={handleSubmit}>
                <Form.Group className='my-2'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your address'
                        name='address'
                        value={shippingForm.address}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className='my-2'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your city'
                        name='city'
                        value={shippingForm.city}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className='my-2'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your country'
                        name='country'
                        value={shippingForm.country}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className='my-2'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your postal code'
                        name='postalCode'
                        value={shippingForm.postalCode}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button className='my-2' type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
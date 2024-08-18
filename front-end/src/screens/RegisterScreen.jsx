import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useRegisterMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import { useDispatch, useSelector } from "react-redux"

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, { isLoading }] = useRegisterMutation()

    const { userInfo } = useSelector((state) => state.auth)

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])
 

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            if (password !== confirmPassword) {
                toast.error('Passwords do not match')
                return
            }
            const res = await register({ name, email, password }).unwrap()
            dispatch(setCredentials({ ...res }))
            navigate(redirect)
        } catch (error) {
            toast.error(error?.data?.message || error?.error)
        }
    }

    return (
        <FormContainer>
            <h1>Sign up</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group className='my-3'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm your password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <Button className='mt-2' type='submit' variant='primary' disabled={isLoading}>
                    Register
                </Button>

                { isLoading && <Loader />}
                <Row className='py-3'>
                    <Col>
                        Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign in</Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    )
}

export default RegisterScreen
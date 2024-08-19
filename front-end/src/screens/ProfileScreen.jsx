import { useEffect, useState } from "react"
import { Row, Col, Button, Form, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useUpdateProfileMutation } from "../slices/usersApiSlice"
import { setCredentials } from '../slices/authSlice'
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice"
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { LinkContainer } from "react-router-bootstrap"

const ProfileScreen = () => {
    const [profileData, setProfileData] = useState({ name: '', email: '', password: '', confirmPassword: ''})

    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)

    const { data: myOrders, isLoading, error } = useGetMyOrdersQuery()

    useEffect(() => {
        if (userInfo) {
            setProfileData({...profileData, email: userInfo.email, name: userInfo.name})
        } 
    }, [userInfo, userInfo.name, userInfo.email])

    const [updateProfile, { isLoading: loadingUpdateProfile, }] = useUpdateProfileMutation()

    const submitHandler = async (e) => {
        e.preventDefault()
        if (profileData.password !== profileData.confirmPassword) {
            toast.error("Passwords do not match")
        } else {
            try {
                const res = await updateProfile({ _id: userInfo._id, name: profileData.name, email: profileData.email, password: profileData.password }).unwrap()
                dispatch(setCredentials(res))
                toast.success("Profile updated successfully")
            } catch (error) {
                toast.error(error?.data?.message || error?.message)
            }
        }
    }

    const handleChange = (e) => {
        setProfileData({...profileData, [e.target.name]: e.target.value})
    }

    return (
        <>
            <Row>
                <Col md={3} className='my-2'>
                    <h2>User Profile</h2>

                    <Form onSubmit={submitHandler}>
                        <Form.Group className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type='name'
                                name='name'
                                placeholder="Enter name"
                                value={profileData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className='my-2'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type='email'
                                name='email'
                                placeholder="Enter email"
                                value={profileData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className='my-2'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type='password'
                                name='password'
                                placeholder="Enter password"
                                value={profileData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className='my-2'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type='password'
                                name='confirmPassword'
                                placeholder="Enter your password again"
                                value={profileData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        { loadingUpdateProfile && <Loader /> }

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                </Col>
                <Col md={9}>
                    { isLoading ? <Loader /> : error ? (
                        <Message variant='danger'>
                            { error?.data?.message || error.error }
                        </Message>
                    ) : (
                        <Table striped hover responsive className='table-,'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { myOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                            <i className='fas fa-times' style={{color: 'red'}}></i>
                                        )}</td>
                                        <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                            <i className='fas fa-times' style={{color: 'red'}}></i>
                                        )}</td>
                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button className='btn-sm' variant='light'>Details</Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </>
    )
}

export default ProfileScreen
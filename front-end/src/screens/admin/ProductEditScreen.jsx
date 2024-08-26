import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useGetProductByIdQuery, useUpdateProductMutation } from '../../slices/productsApiSlice'
import FormContainer from "../../components/FormContainer"
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

const ProductEditScreen = () => {
    const { id: productId } = useParams()

    const [formData, setFormData] = useState({ name: '', price: 0, brand: '', countInStock: 0, category: '', description: '' })

    const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(productId)

    const [updateProduct, { isLoading: updateLoading, error: updateError }] = useUpdateProductMutation()

    const navigate = useNavigate()

    useEffect(() => {
      if (product) {
        setFormData(product)
      }

      console.log(product)
    }, [product])

    const submitHandler = async (e) => {
      e.preventDefault()

      try {
        const result = await updateProduct({ _id: productId, ...formData })
        navigate('/admin/productlist')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
        navigate('/admin/productlist')
      }
    }

    return (
      <>
        <Link to='/admin/products' className='btn btn-light my-3'>
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit Product</h1>
          {updateLoading && <Loader />}

          {isLoading ? <Loader /> : error ? <Message variant='danger'>error</Message> : (
            <Form className='d-flex flex-column gap-2' onSubmit={submitHandler}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter name'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter price'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                ></Form.Control>
              </Form.Group>
              {/* image input */}
              <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter brand'
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Count in stock</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter Stock'
                  value={formData.countInStock}
                  onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter brand'
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary'>
                Update
              </Button>
            </Form>
          )}
        </FormContainer>
      </>
    )
}

export default ProductEditScreen
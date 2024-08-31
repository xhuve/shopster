import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: 0,
    brand: "",
    countInStock: 0,
    category: "",
    description: "",
  });

  const {
    data: product,
    isLoading,
    error
  } = useGetProductByIdQuery(productId);

  const [ uploadProductImage ] =
    useUploadProductImageMutation();

  const [updateProduct, { isLoading: updateLoading, error: updateError }] =
    useUpdateProductMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault()
    
    try {
      await updateProduct({ _id: productId, ...formData });
      toast.success("Product updated");
      navigate("/admin/productlist");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formDataObj = new FormData();
    formDataObj.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formDataObj).unwrap();
      toast.success(res.message);
      setFormData({...formData, image: res.path});
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {updateLoading && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">error</Message>
        ) : (
          <Form className="d-flex flex-column gap-2" onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name='name'
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name='price'
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                name='image'
                placeholder="Enter image url"
                value={formData.image}
                onChange={handleChange}
              ></Form.Control>
              <Form.Control
                type="file"
                onChange={uploadFileHandler}
                label='Choose image'
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name='brand'
                placeholder="Enter brand"
                value={formData.brand}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Count in stock</Form.Label>
              <Form.Control
                type="number"
                name='countInStock'
                placeholder="Enter Stock"
                value={formData.countInStock}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name='category'
                placeholder="Enter brand"
                value={formData.category}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name='description'
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;

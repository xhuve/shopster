import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useGetUserDetailsQuery, useUpdateUserMutation } from "../../slices/usersApiSlice";

const UserEditScreen = () => {
    const { id: userId } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        isAdmin: false,
    });

    const { data: user, error, isLoading } = useGetUserDetailsQuery(userId)

    const [updateUser, { isLoading: updateLoading, error: updateError }] = useUpdateUserMutation()

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
        console.log(user);
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            console.log(formData)
            await updateUser({ _id: userId, ...formData });
            toast.success("User updated");
            navigate("/admin/userlist");
        } catch (error) {
            toast.error(error?.data?.message || error.error);
            navigate("/admin/userlist");
        }
    };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {updateLoading && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">Error</Message>
        ) : (
          <Form className="d-flex flex-column gap-2" onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Is Admin</Form.Label>
              <Form.Check
                type='checkbox'
                label='is Admin'
                checked={formData.isAdmin}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
              />
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

export default UserEditScreen;

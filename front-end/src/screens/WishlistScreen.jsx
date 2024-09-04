import { Col, ListGroup, Row, Button, Image, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUserWishlistQuery } from "../slices/usersApiSlice";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const WishlistScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: product.qty }));
    navigate("/cart");
  };

  const { data: products, isLoading, error } = useGetUserWishlistQuery({ id });

  return (
    <>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <h3>Wishlist</h3>
        </ListGroup.Item>
        {products ? (
          products.map((item) => (
            <ListGroup.Item key={item._id}>
              <Row>
                <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded />
                </Col>
                <Col md={3}>
                  <Link to={`/product/${item._id}`}>{item.name}</Link>
                </Col>
                <Col>{item.price}</Col>
                <Col>
                  <Form.Control as="select" value={item.qty}>
                    {[...Array(item.countInStock)].map((x, i) => {
                      i += 1;
                      return (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button
                    className="btn me-3"
                    type="block"
                    disabled={item.countInStock === 0}
                    onClick={() => addToCartHandler(item, item.qty)}
                  >
                    Add to Cart
                  </Button>
                  <Button type="button" variant="white">
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))
        ) : (
          <Message> No items on your wishlist </Message>
        )}
      </ListGroup>
    </>
  );
};

export default WishlistScreen;

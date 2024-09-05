import { Col, ListGroup, Row, Button, Image, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteFromWishlistMutation,
  useGetUserWishlistQuery,
} from "../slices/usersApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useEffect, useState } from "react";

const WishlistScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deletingItemId, setDeletingItemId] = useState("");

  const [deleteFromWishlist, { isLoading: deletingWish }] =
    useDeleteFromWishlistMutation();

  const { data: products, status, refetch } = useGetUserWishlistQuery({ id });
  console.log("🚀 ~ WishlistScreen ~ products:", products);

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: product.qty }));
    navigate("/cart");
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <h3>Wishlist</h3>
        </ListGroup.Item>
        {products &&
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
                <Col md={2}>
                  <Button
                    className="btn me-3"
                    type="block"
                    disabled={item.countInStock === 0}
                    onClick={() => addToCartHandler(item, item.qty)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    type="button"
                    variant="white"
                    onClick={() => {
                      setDeletingItemId(item._id);
                      deleteFromWishlist({ productId: item._id, id: id });
                    }}
                  >
                    {deletingWish && deletingItemId === item._id ? (
                      <Loader widthSize="2rem" heightSize="2rem" />
                    ) : (
                      <FaTrash />
                    )}
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        {products?.length === 0 && (
          <Message> No items on your wishlist </Message>
        )}
      </ListGroup>
    </>
  );
};

export default WishlistScreen;

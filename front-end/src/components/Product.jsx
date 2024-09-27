import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import Rating from "./Rating"

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
        <Link to={`product/${product._id}`}>
            <Card.Img style={{height: 204, width: 256}} src={product.image} variant='top' />
        </Link>

        <Card.Body>
            <Link to={`product/${product._id}`} className="text-black">
                <Card.Title className="product-title">
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as='div'>
                <Rating rating={product.rating} text={product.numReviews}/>
            </Card.Text>

            <Card.Text as='h3'>
                {product.price}$
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product
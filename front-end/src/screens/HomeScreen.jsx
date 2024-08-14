import { Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Product from '../components/Product'
import axios from 'axios'

const HomeScreen = () => {

  const [products, setProducts] = useState([])

  useEffect(() => {
      axios.get('/api/products')
      .then((res) => {
          setProducts(res.data)
      })
      .catch((err) => {
          console.log(err)
      })
  }, []);
  
  
  return (
    <>
        <h1>Latest Products</h1>
        <Row>
            {products.map((x) => (
                <Col key={x._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={x}>{x.name}</Product>
                </Col>
            ))}
        </Row>
    </>
  )
}

export default HomeScreen
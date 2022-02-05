import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Carousel, Image} from "react-bootstrap"
import {Link} from "react-router-dom"
import {listTopProducts} from "../actions/productActions"
import Loader from './Loader'
import Message from './Message'

const ProductCarousel = () => {

    const dispatch = useDispatch()

    const productTopRated = useSelector(state => state.productTopRated)
    const {products, loading, error} = productTopRated

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])

    return loading ? <Loader/> : error ? <Message variant="dangere">{error}</Message> : (
        <Carousel pause="hover" className="bg-dark">
            {products.map(product => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className="carousel-caption">
                            <h2>{product.name} (${product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel

import React, {Fragment, useEffect} from 'react'
import {Link} from "react-router-dom"
import Loader from "../components/Loader"
import Message from "../components/Message"
import {Row, Col} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Product from "../components/Product"
import {listProducts} from "../actions/productActions"
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'

const HomeScreen = ({match}) => {

    // define some variables
    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    
    const {loading, error, products, page, pages} = productList

    // define some functions
    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch,, keyword, pageNumber])

    return (
        <Fragment>
            <Meta/>
            {!keyword ? <ProductCarousel/> : <Link to="/" className="btn btn-light">Go Back</Link>}
            <h1>Latest Products</h1>
            {loading ? <Loader/> : error ? <Message variant="danger">{error}</Message> : (
            <>
            <Row>
                {products.map(product => (
                    <Fragment key={product._id}>
                        <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                            <Product product={product}/>
                        </Col>
                    </Fragment>
                ))}
            </Row>
            <Paginate pages={pages} page={page} keyword={keyword ? keyword : ""}/>
            </>
            )}
        </Fragment>
    )
}

export default HomeScreen

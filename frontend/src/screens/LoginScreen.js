import React, {useState, useEffect} from 'react'
import {Link, Redirect} from "react-router-dom"
import {Form, Button, Col, Row} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import {login} from "../actions/userActions"
import Message from "../components/Message"
import Loader from "../components/Loader"
import FormContainer from '../components/FormContainer'
import queryString from 'query-string'

const LoginScreen = ({location, history}) => {

    // define some variables
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const parsed = queryString.parse(location.search)
    const redirect = parsed.redirect
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const {loading, error, userInfo} = userLogin

    useEffect(() => {
        console.log(location.search);
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = e => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader/>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary">
                    Sign In 
                </Button>
            </Form>
            <Row class="py-3">
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen

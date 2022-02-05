import asyncHandler from "express-async-handler"
import Product from "../models/productModel.js"

const getProducts = asyncHandler(async (request, response) => {
    const pageSize = 10
    const page = Number(request.query.pageNumber) || 1
    const keyword = request.query.keyword ? {
        name: {
            $regex: request.query.keyword,
            $options: "i"
        }
    } : {}
    const count = await Product.countDocuments({...keyword})
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))
    response.json({products, page, pages: Math.ceil(count / pageSize)})
})

const getProductById = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id)
    if (product) {
        response.json(product)
    }
    else {
        response.status(400)
        throw new Error("Product not found")
    }
})

const deleteProduct = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id)
    if (product) {
        await product.remove()
        response.json({
            msg: "Product removed"
        })
    }
    else {
        response.status(400)
        throw new Error("Product not found")
    }
})

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    })
  
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  })

const updateProduct = asyncHandler(async (request, response) => {
    const {name, price, description, image, brand, category, countInStock} = request.body
    const product = await Product.findById(request.params.id)
    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        response.json(updatedProduct)
    }
    else {
        response.status(404)
        throw new Error("Product not found")
    }
})

const createProductReview = asyncHandler(async (request, response) => {
    const {rating, comment} = request.body
    const product = await Product.findById(request.params.id)
    if (product) {
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === request.user._id.toString())
        if (alreadyReviewed) {
            response.status(400)
            throw new Error("Product already reviewed")
        }
        const review = {
            name: request.user.name,
            rating: Number(rating),
            comment,
            user: request.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length
        await product.save()
        response.status(201)
        response.json({
            msg: "Review added"
        })
    }
    else {
        response.status(404)
        throw new Error("Product not found")
    }
})

const getTopProducts = asyncHandler(async (request, response) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3)
    response.json(products)
})

export {getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts}
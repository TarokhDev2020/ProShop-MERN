const notFound = (request, response, next) => {
    const error = new Error(`Not Found - ${request.originalUrl}`)
    response.status(404)
    next(error)
}

const errorHandler = (err, request, response, next) => {
    const statusCode = response.statusCode === 200 ? 500 : response.statusCode
    response.status(statusCode)
    response.json({
        msg: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}

export {notFound, errorHandler}


// const errorMiddleware = (err, req, res, next) => {
//     if (!err) {
//         next();
//         return;
//     }

//     if (err instanceof ResponseError) {
//         res.status(err.status).json({ success: false, errors: err.message }).end();
//     } else {
//         res
//             .status(500)
//             .json({
//             success: false,
//             errors: err.message,
//             message: "Internal Server Error",
//             })
//             .end();
//     }
// };


const errorMiddleware =(err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
}

export default errorMiddleware;

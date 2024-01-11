const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404); // Set the status code to 404
  next(error); // Pass the error to the next middleware
};
const errorHandler = (err, req, res, next) => {
  // Set the status code to 500 if not already set
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  //Check for Mongoose CastError
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Resource not found.";
  }
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
export { notFound, errorHandler };

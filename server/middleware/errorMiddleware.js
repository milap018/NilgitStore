export function notFound(req, res, next) {
// If no route matched, create a 404 error and hand it to the shared error handler.
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(error, req, res, next) {
// Keep the response consistent: if nothing set a status code, treat it as server error.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: error.message || "Server error"
  });
}

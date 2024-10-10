class CustomError extends Error {
  constructor(message, statusCode) {
    super(message || "Internal Server Error!");
    this.statusCode = statusCode || 500;
    this.status = statusCode >= 400 && statusCode < 500 ? "Fail" : "Error";
  }
}
export default CustomError;

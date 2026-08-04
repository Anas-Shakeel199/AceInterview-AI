import HTTP_STATUS from "../constants/httpStatus.js";
import ApiError from "../utils/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Validation failed",
          errors
        )
      );
    }

    req.body = result.data;

    next();
  };
};

export default validate;
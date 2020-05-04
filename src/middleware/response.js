const { Response } = require("../utils");
const { ResponseFormatter } = require("../formatters");

const responseMiddleware = (_, res, next) => {
  const formatter = {};
  const responseLists = Response.get();

  for (const response of responseLists) {
    const { name, code, status, isSuccess } = response;

    if (isSuccess) {
      formatter[name] = (data, paging) => {
        res
          .status(code)
          .json(ResponseFormatter.getSuccessResponse(status, data, paging));
      };
    } else {
      formatter[name] = error => {
        res
          .status(code)
          .json(ResponseFormatter.getErrorResponse(status, error));
      };
    }
  }

  res.formatter = formatter;
  next();
};

module.exports = responseMiddleware;

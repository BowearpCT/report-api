class Response {
  static get() {
    return [
      {
        name: "ok",
        code: 200,
        status: "ok",
        isSuccess: true
      },
      {
        name: "notFound",
        code: 200,
        status: "not found",
        isSuccess: true
      },
      {
        name: "created",
        code: 201,
        status: "created",
        isSuccess: true
      },
      {
        name: "noContent",
        code: 204,
        status: "no content",
        isSuccess: true
      },
      {
        name: "badRequest",
        code: 400,
        status: "bad request",
        isSuccess: false
      },
      {
        name: "unAuthorized",
        code: 401,
        status: "unauthorized",
        isSuccess: false
      },
      {
        name: "serverError",
        code: 500,
        status: "internal server error",
        isSuccess: false
      }
    ];
  }
}

module.exports = Response;

class ResponseFormatter {
  static getSuccessResponse(status, data = {}, paging = null) {
    return paging
      ? {
          status,
          data,
          paging
        }
      : { status, data };
  }

  static getErrorResponse(status, error) {
    return {
      status,
      error
    };
  }
}

module.exports = ResponseFormatter;

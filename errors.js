class MangaError extends Error {
  code;

  constructor(errorCode, message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = errorCode;
  }
}

class InvalidIdError extends MangaError {
  constructor(id) {
    super('INVALID_ID', `'${id}' is not a valid Poketo ID`);
  }
}

class InvalidUrlError extends MangaError {
  constructor(url) {
    super('INVALID_URL', `Unable to parse '${url}'`);
  }
}

class HTTPError extends MangaError {
  statusCode;
  url; // eslint-disable-line lines-between-class-members

  constructor(statusCode, message, url) {
    super('HTTP_ERROR', message);
    this.statusCode = statusCode;
    this.url = url;
  }
}

class RequestError extends MangaError {
  constructor(url) {
    super('REQUEST_ERROR', `Failed to make a request to '${url}'`);
  }
}

class LicenseError extends MangaError {
  constructor() {
    super(
      'LICENSE_ERROR',
      'Series or chapter is not available due to licensing restrictions',
    );
  }
}

class NotFoundError extends HTTPError {
  constructor(url) {
    super(404, 'Not Found', url);
  }
}

class TimeoutError extends MangaError {
  url;

  constructor(message, url) {
    super('TIMEOUT', message);
    this.url = url;
  }
}

class UnsupportedSiteError extends MangaError {
  constructor(url) {
    super('UNSUPPORTED_SITE', `Site '${url}' is not supported`);
  }
}

class UnsupportedOperationError extends MangaError {
  constructor(siteName, operationName) {
    super(
      'UNSUPPORTED_OPERATION',
      `${siteName} does not support ${operationName}`,
    );
  }
}

module.export = {
  MangaError,
  HTTPError,
  InvalidIdError,
  InvalidUrlError,
  NotFoundError,
  LicenseError,
  RequestError,
  TimeoutError,
  UnsupportedSiteError,
  UnsupportedOperationError,
};

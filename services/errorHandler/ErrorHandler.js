import ApplicationError from '../../errors/ApplicationError.js';
import ValidationError from '../../errors/ValidationError.js';

class ErrorHandler {
  async handleError(error, responseStream) {
    const processedError = this.processError(error, responseStream);
    await this.sendResponse(processedError, responseStream);
  }

  processError(error) {
    if (error instanceof ValidationError) {
      this.context = error.context;
    }
    if (error instanceof ApplicationError)
      return this.processApplicationError(error);

    return this.processGenericError(error);
  }

  async sendResponse(error, response) {
    const { message, statusCode } = error;
    if (response) {
      await response
        .status(statusCode)
        .json({ msg: message, context: this.context });
      delete this.context;
    }
  }

  processGenericError(error) {
    return {
      name: error.name || 'Error',
      message: error.message || 'Ocurio un error inesperado',
      statusCode: 500,
      errorCode: 'GENERIC_ERROR',
    };
  }

  processApplicationError(error) {
    let message;
    const { methodName, objectName, statusCode, errorCode, name } = error;
    message = error.message;
    return {
      name,
      objectName,
      methodName,
      message,
      statusCode,
      errorCode,
    };
  }
}

export default ErrorHandler;

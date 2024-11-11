import ApplicationError from './ApplicationError.js';

/**
 * Objeto de error con información referente al caso de una busqueda con resultadfos nulos.
 * @class
 * @extends ApplicationError
 */
class ValidationError extends ApplicationError {
  /**
   *
   * @param {String} message
   */
  constructor(validationData = { message: 'Datos invalidos' }) {
    super(validationData.message);
    this.message = validationData.message;
    this.validationData = validationData;
  }

  /**
   * Codigo HTTP de error a enviar en la respuesta de una solicitud de red.
   * @type {Number}
   */
  get statusCode() {
    return 401;
  }

  /**
   * Objeto de negocio donde se produjo el error.
   * @type {String}
   */
  get objectName() {
    return this.stack.split(' at')[1].split('\\')[4];
  }

  /**
   * Mensaje de error utilizado para identificar el error.
   * @type {String}
   */
  get errorCode() {
    return 'INVALID_DATA';
  }

  get context() {
    if (!Reflect.has(this.validationData, 'details')) return null;

    const context = this.validationData.details.map(({ context }) => context);

    if (context.length === 0) return null;

    return context;
  }
}

export default ValidationError;

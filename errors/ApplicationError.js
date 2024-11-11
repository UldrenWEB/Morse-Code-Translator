/**
 * Contiene información base necesaria para registrar los diferentes errores ocurridos durante
 * la ejecución ded la aplicación.
 * @class
 * @constructor
 * @public
 * @extends Error
 */
class ApplicationError extends Error {
  /**
   *
   * @param {String} message
   */
  constructor(message) {
    super(message);
  }

  /**
   * Nombre de la clase del error.
   * @type {String}
   */
  get name() {
    return this.constructor.name;
  }

  /**
   * Objeto de negocio donde se produjo el error.
   * @type {String}
   */
  get objectName() {
    return this.stack.split(' at ')[1].split(' ')[0].split('.')[0];
  }

  /**
   * Metodo en donde se produjo el error.
   * @type {String}
   */
  get methodName() {
    return this.stack.split(' at ')[1].split(' ')[0];
  }

  /**
   * Mensaje pasado como argumento al contructor.
   * @type {String}
   */
  get message() {
    return this.constructor.message;
  }

  /**
   * Codigo HTTP de error a enviar en la respuesta de una solicitud de red.
   * @type {Number}
   */
  get statusCode() {
    return 500;
  }

  /**
   * Mensaje de error utilizado para identificar el error.
   * @type {String}
   */
  get errorCode() {
    return 'APPLICATION_ERROR';
  }
}
export default ApplicationError;

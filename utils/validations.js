import ValidationError from '../errors/ValidationError.js';
import errors from '../errors/errors.json' with { type: 'json' };
import Joi from 'joi';

/**
 * Contiene metodo utilitarios para la validación de esquemas
 */
export class Validator {
  /**
   *
   * @param {Object} basicSchema Esquema para validar el nombre del objeto,
   * del método y los parametros que este recibe
   */
  constructor(basicSchema) {
    this.basicSchema = basicSchema;
    this.validationOptions = {
      errors: {
        labels: true,
        language: 'es',
      },
      messages: {
        es: errors.joiErrors.es,
        en: errors.joiErrors.en,
      },
    };
  }

  /**
   * Devuelve una copia del esquema esquema objetivo concatenado con el esquema fuente.
   * @param {Object} schemaTarget Esquema objetivo.
   * @param {Object} schemaSource Esquema fuente.
   * @returns {Object}
   */
  mergeSchema(schemaTarget, schemaSource) {
    return schemaTarget.concat(schemaSource);
  }

  /**
   * Valida el esquema, arrojando error en caso de que esta falle.
   * @param {Object} schema
   * @param {Object} body
   * @throws {ValidationError} Instancia de la clase ValidationError.
   */
  validate(schema, body) {
    const { error } = schema.validate(body, this.validationOptions);
    if (error) throw new ValidationError(error);
  }

  validateDelete = (body) => {
    const deleteSchema = Joi.object({
      id: Joi.alternatives()
        .try(
          Joi.number().integer().positive().required(),
          Joi.array().items(Joi.number().integer().positive()).required(),
        )
        .required(),
    });
    this.validate(deleteSchema, body);
  };
}

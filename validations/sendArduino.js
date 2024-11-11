import { Validator } from '../utils/validations.js';
import Joi from 'joi';

class ValidatorSendArduino extends Validator {
  validateSendArduino = (body) => {
    const schema = Joi.object({
      path: Joi.string().valid('COM4', 'COM5', 'COM6').required(),
      message: Joi.string().required(),
    });

    this.validate(schema, body);
  };
}

export default ValidatorSendArduino;

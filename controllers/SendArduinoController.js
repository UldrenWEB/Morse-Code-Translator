import { SerialPort } from 'serialport';
import ValidatorSendArduino from '../validations/sendArduino.js';
import ApplicationError from '../errors/ApplicationError.js';
import letterToMorse from '../json/letterToMorse.json' with { type: 'json' };
import { port } from '../services/received/receivedMorse.js';

const validator = new ValidatorSendArduino();

class SendArduinoController {
  static sendArduino = (req, res, next) => {
    try {
      validator.validateSendArduino(req.body);
      const { path, message } = req.body;

      const binaryMessage = message
        .split('')
        .map((char) => letterToMorse[char.toUpperCase()])
        .join('');

      const buffer = Buffer.from(binaryMessage, 'binary');

      port.write(buffer, (err) => {
        if (err) {
          next(new ApplicationError(`Error escribiendo al puerto: ${err.message}`));
        }

        setTimeout(() => {
          res.status(200).json({
            msg: 'Datos enviados correctamente',
          });
        }, 100);
      });
    } catch (error) {
      next(error);
    }
  };
}

export default SendArduinoController;
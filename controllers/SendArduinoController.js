import { SerialPort } from 'serialport';
import ValidatorSendArduino from '../validations/sendArduino.js';
import ApplicationError from '../errors/ApplicationError.js';
import letterToMorse from '../json/letterToMorse.json' with { type: 'json' };
import { port } from '../services/received/receivedMorse.js';

const validator = new ValidatorSendArduino();

let isValidRequest = true;

class SendArduinoController {
  static sendArduino = (req, res, next) => {
    try {

      if(!isValidRequest) throw new ApplicationError('Debe esperar que termine de transmitir mensaje anterior para enviar');

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

        isValidRequest = false;

        setTimeout(() => {
          res.status(200).json({
            msg: 'Datos enviados correctamente',
          });
          setTimeout(() => isValidRequest = true, 2500);
        }, 500);
      });

    } catch (error) {
      next(error);
    }
  };
}

export default SendArduinoController;
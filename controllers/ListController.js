import { SerialPort } from 'serialport';

class ListController {
  static listPortsAvailable = async (_req, res, next) => {
    try {
      const ports = await SerialPort.list();
      const portsFiltered = ports.filter((port) => port.serialNumber);

      const portsAvailable = portsFiltered.map((port) => port.path);
      res.status(200).json({
        msg: 'Puertos Disponibles',
        data: portsAvailable,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ListController;

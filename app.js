import { SerialPort, ReadlineParser } from 'serialport';

const morseToLetter = {
  '.-': 'A',
  '-...': 'B',
  '-.-.': 'C',
  '-..': 'D',
  '.': 'E',
  '..-.': 'F',
  '--.': 'G',
  '....': 'H',
  '..': 'I',
  '.---': 'J',
  '-.-': 'K',
  '.-..': 'L',
  '--': 'M',
  '-.': 'N',
  '---': 'O',
  '.--.': 'P',
  '--.-': 'Q',
  '.-.': 'R',
  '...': 'S',
  '-': 'T',
  '..-': 'U',
  '...-': 'V',
  '.--': 'W',
  '-..-': 'X',
  '-.--': 'Y',
  '--..': 'Z',
  '-----': '0',
  '.----': '1',
  '..---': '2',
  '...--': '3',
  '....-': '4',
  '.....': '5',
  '-....': '6',
  '--...': '7',
  '---..': '8',
  '----.': '9',
};

const letterToMorse = {
  A: '10111',
  B: '111010101',
  C: '11101011101',
  D: '1110101',
  E: '1',
  F: '101011101',
  G: '111011101',
  H: '1010101',
  I: '101',
  J: '1011101110111',
  K: '111010111',
  L: '101110101',
  M: '1110111',
  N: '11101',
  O: '11101110111',
  P: '10111011101',
  Q: '1110111010111',
  R: '1011101',
  S: '10101',
  T: '111',
  U: '1010111',
  V: '101010111',
  W: '101110111',
  X: '11101010111',
  Y: '1110101110111',
  Z: '11101110101',
  0: '1110111011101110111',
  1: '10111011101110111',
  2: '101011101110111',
  3: '1010101110111',
  4: '10101010111',
  5: '101010101',
  6: '11101010101',
  7: '1110111010101',
  8: '111011101110101',
  9: '11101110111011101',
  ' ': '000',
};

// Convertir la palabra "TE AMO" a binario
const message = 'TE AMO';
const binaryMessage = message
  .split('')
  .map((char) => letterToMorse[char])
  .join('');

// Convertir la cadena binaria a un buffer
const buffer = Buffer.from(binaryMessage, 'binary');

SerialPort.list()
  .then((ports) => {
    console.log('Puertos disponibles:');
    ports.forEach((port) => {
      if (port.serialNumber) {
        console.log(port.path);
      }
    });
  })
  .catch((err) => {
    console.error('Error listando puertos:', err.message);
  });

const port = new SerialPort({
  path: 'COM6',
  baudRate: 9600,
});

const MorseCode = {
  1: '.',
  111: '-',
  '000': ' ',
  '0000000': ' / ',
};

let receivedData = '';
let morseBuffer = '';
let letterBuffer = '';
let messageBuffer = '';

port.on('readable', () => {
  let data;
  while ((data = port.read())) {
    receivedData = data.toString('binary');
  }

  morseBuffer = receivedData;
  // console.log('Datos recibidos:', morseBuffer);

  // Procesar los datos recibidos

  if (morseBuffer === '00000000') {
    // Fin de transmisión
    //! socket.emit('message', 'Transmission ended');
    console.log(`Mensaje para MiMor ❤️  ${messageBuffer}`);
    receivedData = '';
    morseBuffer = '';
    letterBuffer = '';
    messageBuffer = '';
  } else if (morseBuffer === '11111111') {
    // Inicio de transmisión
    //! socket.emit('message', 'Transmission started');
    receivedData = '';
    morseBuffer = '';
    letterBuffer = '';
    messageBuffer = '';
    console.log('Comenzo Transmision');
  } else if (MorseCode[morseBuffer]) {
    if (morseBuffer === '000') {
      // Espacio entre letras
      if (letterBuffer) {
        const letter = morseToLetter[letterBuffer];
        if (letter) {
          messageBuffer += letter;
          //! socket.emit('message', letter);
          // console.log(letter);
        }
        letterBuffer = '';
      }
    } else if (morseBuffer === '0000000') {
      // Espacio entre palabras
      if (letterBuffer) {
        const letter = morseToLetter[letterBuffer];
        if (letter) {
          messageBuffer += letter;
          //! socket.emit('message', letter);
        }
        letterBuffer = '';
      }
      //! socket.emit('message', ' ');
      messageBuffer += ' ';
    } else {
      letterBuffer += MorseCode[morseBuffer];
    }
    morseBuffer = '';
  }
});

// port.on('readable', () => {
//   let data;
//   while (data = port.read()) {
//     receivedData = data.toString('binary');
//   }

//     const message = receivedData
//     console.log('Datos recibidos:', message);
// });

setTimeout(() => {
  port.write(buffer, (err) => {
    if (err) {
      return console.error('Error escribiendo al puerto:', err.message);
    }
    console.log('Datos binarios enviados:', buffer);
  });
}, 5000);

port.on('open', () => {
  console.log('Puerto abierto');
});

port.on('error', (err) => {
  console.error('Error del puerto:', err.message);
});

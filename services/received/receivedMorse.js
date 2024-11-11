import { SerialPort } from 'serialport';
import MorseCode from '../../json/morseCode.json' with { type: 'json' };
import morseToLetter from '../../json/morseToLetter.json' with  { type: 'json' };
import { socketServer } from '../../appi.js';

export const port = new SerialPort({
    path: 'COM6',
    baudRate: 9600,
});

const listenSerialPort = () => {
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
        
        if (morseBuffer === '00000000') {
            socketServer.sendMessage('message', 'end');
            console.log('Termino Transmision');
            receivedData = '';
            morseBuffer = '';
            letterBuffer = '';
            messageBuffer = '';
        } else if (morseBuffer === '11111111') {
            socketServer.sendMessage('message', 'init');
            console.log('Comenzo Transmision');
            receivedData = '';
            morseBuffer = '';
            letterBuffer = '';
            messageBuffer = '';
        } else if (MorseCode[morseBuffer]) {
            if (morseBuffer === '000') {
                if (letterBuffer) {
                    const letter = morseToLetter[letterBuffer];
                    if (letter) {
                        messageBuffer += letter;
                        socketServer.sendMessage('message', letter);
                    }
                    letterBuffer = '';
                }
            } else if (morseBuffer === '0000000') {
                if (letterBuffer) {
                    const letter = morseToLetter[letterBuffer];
                    if (letter) {
                        messageBuffer += letter;
                        socketServer.sendMessage('message', letter);
                    }
                    letterBuffer = '';
                }
                socketServer.sendMessage('message', ' ');
                messageBuffer += ' ';
            } else {
                letterBuffer += MorseCode[morseBuffer];
            }
            morseBuffer = '';
        }
    });
}

export default listenSerialPort;



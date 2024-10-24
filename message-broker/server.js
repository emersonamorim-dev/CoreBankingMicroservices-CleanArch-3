const broker = require('./src/broker');
const startGiftcardQueue = require('./src/queues/giftcardQueue');
const startMultasQueue = require('./src/queues/multasQueue');
const startRecargaQueue = require('./src/queues/recargaQueue');

async function init() {
    try {
        await broker.connect();

        // Inicia os consumidores de mensagens
        startGiftcardQueue();
        startMultasQueue();
        startRecargaQueue();

        console.log('Message Broker ready');
    } catch (error) {
        console.error('Erro ao inicializar message broker:', error);
    }
}

init();

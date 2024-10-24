const axios = require('axios');
const startConsumer = require('../consumer');

async function processGiftcardMessage(message) {
    console.log('Mensagem de processamento de giftcard:', message);
    
    // mensagem pode ser processada ou validada conforme necessário
    const processedMessage = {
        giftcardId: message.giftcardId,  
        action: message.action   
    };

    try {
        const response = await axios.post('http://localhost:9081/comprar-giftcard', processedMessage);
        console.log(`Resposta do serviço de cartões: ${response.data}`);
    } catch (error) {
        console.error(`Mensagem de erro ao processar cartões: ${error.message}`);
    }
}

module.exports = () => startConsumer('giftcard', processGiftcardMessage);

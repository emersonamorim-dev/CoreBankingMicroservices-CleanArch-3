const axios = require('axios');
const startConsumer = require('../consumer');

async function processRecargaMessage(message) {
    console.log('Processando mensagem de Recarga:', message);

    const processedMessage = {
        recargaId: message.recargaId,   
        valor: message.valor,         
        operadora: message.operadora, 
        telefone: message.telefone    
    };

    try {
        const response = await axios.post('http://localhost:8087/api/recargas', processedMessage);

        console.log(`Resposta do serviço de Recarga: ${response.data}`);
    } catch (error) {
        console.error(`Erro ao processar mensagem de Recarga: ${error.message}`);
    }
}

module.exports = () => startConsumer('recarga', processRecargaMessage);

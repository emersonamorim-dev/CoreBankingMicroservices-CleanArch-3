const axios = require('axios');
const startConsumer = require('../consumer');

async function processMultasMessage(message) {
    console.log('Processando mensagem de Multas:', message);
    
    const processedMessage = {
        multasId: message.multasId,  
        multas: message.multas        
    };

    try {
        const response = await axios.post('http://localhost:8018/veiculos', processedMessage);

        console.log(`Resposta do serviço de Multas: ${response.data}`);
    } catch (error) {
        console.error(`Erro ao processar mensagem de Multas: ${error.message}`);
    }
}

module.exports = () => startConsumer('multas', processMultasMessage);

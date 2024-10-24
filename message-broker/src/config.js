module.exports = {
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5681', 
        exchange: 'message-broker'
    },
    services: {
        giftcard: {
            queue: 'giftcardQueue',
            routingKey: 'giftcard_key'
        },
        multas: {
            queue: 'multasQueue',
            routingKey: 'multas_key'
        },
        recarga: {
            queue: 'recargaQueue',
            routingKey: 'recarga_key'
        }
    }
};

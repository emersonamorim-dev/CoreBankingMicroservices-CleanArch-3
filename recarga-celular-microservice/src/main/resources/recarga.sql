CREATE TABLE recarga (
    id UUID PRIMARY KEY,
    numero_celular VARCHAR(15) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    operadora_id UUID,
    data_recarga TIMESTAMP NOT NULL,
    FOREIGN KEY (operadora_id) REFERENCES operadora(id)
);


CREATE TABLE operadora (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(10) NOT NULL
);

CREATE TABLE metodo_pagamento (
    id UUID PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    numero_cartao VARCHAR(20),
    nome_titular VARCHAR(100),
    validade VARCHAR(5),
    cvv VARCHAR(4)
);

ALTER TABLE recarga
    RENAME COLUMN numero_celular TO telefone;

ALTER TABLE recarga
    ADD COLUMN metodo_pagamento_id UUID,
    ADD COLUMN id_transacao UUID,
    DROP COLUMN operadora_id,
    ADD COLUMN operadora VARCHAR(100) NOT NULL,
    ADD CONSTRAINT fk_metodo_pagamento
    FOREIGN KEY (metodo_pagamento_id)
    REFERENCES metodo_pagamento(id);


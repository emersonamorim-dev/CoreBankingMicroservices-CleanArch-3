-- Inserir operadoras disponíveis
INSERT INTO operadora (id, nome, codigo) VALUES
    (uuid_generate_v4(), 'Operadora A', 'OPA'),
    (uuid_generate_v4(), 'Operadora B', 'OPB'),
    (uuid_generate_v4(), 'Operadora C', 'OPC');

-- Inserir recargas fictícias
INSERT INTO recarga (id, numero_celular, valor, operadora_id, data_recarga) VALUES
    (uuid_generate_v4(), '11999990001', 50.00, (SELECT id FROM operadora WHERE nome = 'Operadora A'), now()),
    (uuid_generate_v4(), '11999990002', 30.00, (SELECT id FROM operadora WHERE nome = 'Operadora B'), now()),
    (uuid_generate_v4(), '11999990003', 25.00, (SELECT id FROM operadora WHERE nome = 'Operadora C'), now());



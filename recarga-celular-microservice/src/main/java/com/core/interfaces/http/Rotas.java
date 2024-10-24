package com.core.interfaces.http;


public class Rotas {

    // Rota base para as operações de recarga
    public static final String BASE_RECARGAS = "/api/recargas";

    // Rotas específicas para recargas
    public static final String REALIZAR_RECARGA = BASE_RECARGAS;
    public static final String BUSCAR_RECARGA_POR_ID = BASE_RECARGAS + "/{id}";
    public static final String DELETAR_RECARGA = BASE_RECARGAS + "/{id}";
    public static final String LISTAR_OPERADORAS = BASE_RECARGAS + "/operadoras";
    public static final String LISTAR_RECARGAS = BASE_RECARGAS;
}

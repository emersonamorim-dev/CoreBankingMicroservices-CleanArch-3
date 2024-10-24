package com.core.interfaces.controllers;

import com.core.application.services.RecargaService;
import com.core.domain.entities.Recarga;
import com.core.interfaces.http.Rotas;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path(Rotas.BASE_RECARGAS) // Usando a rota base centralizada
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RecargaController {

    @Inject
    RecargaService recargaService;

    @POST
    public Response realizarRecarga(Recarga recarga) {
        try {
            Recarga novaRecarga = recargaService.realizarRecarga(recarga);
            return Response.status(Response.Status.CREATED).entity(novaRecarga).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Erro ao realizar a recarga: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response buscarRecargaPorId(@PathParam("id") UUID id) {
        Recarga recarga = recargaService.buscarRecargaPorId(id);
        if (recarga != null) {
            return Response.ok(recarga).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Recarga não encontrada").build();
        }
    }

    @GET
    public Response listarRecargas() {
        List<Recarga> recargas = recargaService.listarRecargas();
        return Response.ok(recargas).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deletarRecarga(@PathParam("id") UUID id) {
        try {
            recargaService.deletarRecarga(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND).entity("Erro ao deletar recarga: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/operadoras")
    public Response listarOperadoras() {
        List<String> operadoras = recargaService.listarOperadoras();
        return Response.ok(operadoras).build();
    }
}

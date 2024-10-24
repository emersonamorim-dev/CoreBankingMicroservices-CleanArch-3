package com.core.infrastructure.db;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

@ApplicationScoped
public class ConexaoPostgreSQL {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConexaoPostgreSQL.class);

    @Inject
    EntityManager entityManager;

    public EntityManager getEntityManager() {
        return entityManager;
    }

    @Transactional
    public <T> T salvar(T entidade) {
        try {
            LOGGER.info("Salvando entidade no banco de dados: {}", entidade);
            entityManager.persist(entidade);
            return entidade;
        } catch (Exception e) {
            LOGGER.error("Erro ao salvar entidade no banco de dados", e);
            throw e;
        }
    }

    @Transactional
    public <T> T atualizar(T entidade) {
        try {
            LOGGER.info("Atualizando entidade no banco de dados: {}", entidade);
            return entityManager.merge(entidade);
        } catch (Exception e) {
            LOGGER.error("Erro ao atualizar entidade no banco de dados", e);
            throw e;
        }
    }

    public <T> T buscarPorId(Class<T> clazz, UUID id) {
        try {
            LOGGER.info("Buscando entidade com ID {} no banco de dados");
            return entityManager.find(clazz, id);
        } catch (Exception e) {
            LOGGER.error("Erro ao buscar entidade com ID {}");
            return null;
        }
    }

    @Transactional
    public <T> void deletar(Class<T> clazz, UUID id) {
        try {
            T entidade = entityManager.find(clazz, id);
            if (entidade != null) {
                LOGGER.info("Deletando entidade com ID {} no banco de dados");
                entityManager.remove(entidade);
            } else {
                LOGGER.warn("Entidade com ID {} não encontrada para deletar", id);
            }
        } catch (Exception e) {
            LOGGER.error("Erro ao deletar entidade com ID {}");
            throw e;
        }
    }
}

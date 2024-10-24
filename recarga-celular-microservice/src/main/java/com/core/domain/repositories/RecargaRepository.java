package com.core.domain.repositories;

import com.core.domain.entities.Recarga;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

@ApplicationScoped
public class RecargaRepository implements PanacheRepositoryBase<Recarga, UUID> {

    private static final Logger LOGGER = LoggerFactory.getLogger(RecargaRepository.class);

    @Transactional
    public Recarga salvar(Recarga recarga) {
        if (recarga.getDataRecarga() == null) {
            recarga.setDataRecarga(LocalDateTime.now());
        }
    
        if (recarga.getId() == null) {
            persist(recarga); 
        } else if (!isPersistent(recarga)) {
            recarga = getEntityManager().merge(recarga); 
        }
        return recarga;
    }
    


    public Optional<Recarga> buscarPorId(UUID id) {
        LOGGER.info("Buscando recarga por ID: {}", id);
        return findByIdOptional(id);
    }

    @Transactional
    public void atualizar(Recarga recarga) {
        LOGGER.info("Atualizando recarga: {}", recarga);
        getEntityManager().merge(recarga);
    }

    @Transactional
    public void deletarPorId(UUID id) {
        LOGGER.info("Deletando recarga por ID: {}", id);
        deleteById(id);
    }

    public List<Recarga> listarTodas() {
        LOGGER.info("Listando todas as recargas");
        return listAll();
    }
}

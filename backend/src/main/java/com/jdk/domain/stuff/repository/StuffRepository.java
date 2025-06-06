package com.jdk.domain.stuff.repository;

import com.jdk.domain.stuff.entity.Stuff;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StuffRepository extends JpaRepository<Stuff, Integer> {
    Optional<Stuff> findByStuffName(@Size(max = 100) @NotNull String stuffName);
}

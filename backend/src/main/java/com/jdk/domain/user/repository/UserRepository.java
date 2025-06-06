package com.jdk.domain.user.repository;

import com.jdk.domain.user.entity.Role;
import com.jdk.domain.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByLoginId(@NotBlank String loginId);

    List<User> findAllByRole(Role role);

}

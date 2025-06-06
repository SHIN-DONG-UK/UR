package com.jdk.domain.user.repository;

import com.jdk.domain.classroom.entity.ClassRoom;
import com.jdk.domain.user.entity.Teacher;
import com.jdk.domain.user.entity.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
    Optional<Teacher> findByUser(User user);

    Teacher findByClassRoom(@NotNull ClassRoom classRoom);
}

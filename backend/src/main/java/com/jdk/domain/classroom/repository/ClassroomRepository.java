package com.jdk.domain.classroom.repository;

import com.jdk.domain.classroom.entity.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassroomRepository extends JpaRepository<ClassRoom, Integer> {

    Optional<ClassRoom> findByClassName(String className);
}

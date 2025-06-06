package com.jdk.domain.stuff.repository;

import com.jdk.domain.child.entity.Child;
import com.jdk.domain.stuff.entity.ChildStuff;
import com.jdk.domain.stuff.entity.ChildStuffId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildStuffRepository extends JpaRepository<ChildStuff, ChildStuffId> {
    List<ChildStuff> findAllByChild(Child child);
}

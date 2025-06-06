package com.jdk.domain.child.repository;

import com.jdk.domain.child.entity.Child;
import com.jdk.domain.child.entity.ParentChild;
import com.jdk.domain.child.entity.ParentChildId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParentChildRepository extends JpaRepository<ParentChild, ParentChildId> {
    List<ParentChild> findByUserId(int userId);

    boolean existsByIdUserIdAndIdChildId(Integer userId, Integer childId);

    List<ParentChild> findByChild(Child child);

}

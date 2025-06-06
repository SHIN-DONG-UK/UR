package com.jdk.domain.child.repository;

import com.jdk.domain.child.entity.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChildRepository extends JpaRepository<Child, Integer> {

    Optional<Child> findByChildName(String childName);

    @Query("""
        select distinct c
        from Child c
        left join fetch c.parentChildren pc
        left join fetch pc.user u
    """)
    List<Child> findAllWithParents();

    @Query("""
        select distinct c
        from Child c
        left join fetch c.parentChildren pc
        left join fetch pc.user u
        where c.id in :ids
    """)
    List<Child> findAllByIdWithParents(@Param("ids") List<Integer> ids);
}

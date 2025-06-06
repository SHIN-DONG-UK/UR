package com.jdk.domain.child.repository;

import com.jdk.domain.child.entity.ChildNote;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChildNoteRepository extends MongoRepository<ChildNote, String> {
    Optional<ChildNote> findByChildId(Integer childId);
}

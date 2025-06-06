package com.jdk.domain.faceembedding.repository;

import com.jdk.domain.faceembedding.entity.FaceEmbedding;
import com.jdk.domain.faceembedding.entity.FaceEmbeddingId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaceEmbeddingRepository extends JpaRepository<FaceEmbedding, FaceEmbeddingId> {
}

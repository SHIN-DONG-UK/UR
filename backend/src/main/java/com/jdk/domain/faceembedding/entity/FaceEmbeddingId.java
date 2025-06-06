package com.jdk.domain.faceembedding.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class FaceEmbeddingId implements java.io.Serializable {
    @Serial
    private static final long serialVersionUID = -4418102667440086276L;
    @NotNull
    @Column(name = "child_id", nullable = false)
    private Integer childId;

    @NotNull
    @Column(name = "file_id", nullable = false)
    private Integer fileId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        FaceEmbeddingId entity = (FaceEmbeddingId) o;
        return Objects.equals(this.childId, entity.childId) &&
                Objects.equals(this.fileId, entity.fileId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(childId, fileId);
    }

}
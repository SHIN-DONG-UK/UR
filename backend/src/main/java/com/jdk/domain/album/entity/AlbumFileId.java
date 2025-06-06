package com.jdk.domain.album.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class AlbumFileId implements java.io.Serializable {
    private static final long serialVersionUID = -8629716936366499216L;
    @NotNull
    @Column(name = "album_id", nullable = false)
    private Integer albumId;

    @NotNull
    @Column(name = "file_id", nullable = false)
    private Integer fileId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        AlbumFileId entity = (AlbumFileId) o;
        return Objects.equals(this.albumId, entity.albumId) &&
                Objects.equals(this.fileId, entity.fileId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(albumId, fileId);
    }

}
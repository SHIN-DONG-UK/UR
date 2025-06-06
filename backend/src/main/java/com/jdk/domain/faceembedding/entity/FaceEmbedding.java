package com.jdk.domain.faceembedding.entity;

import com.jdk.domain.child.entity.Child;
import com.jdk.domain.file.entity.File;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Table(name = "face_embedding")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaceEmbedding {

    @EmbeddedId
    private FaceEmbeddingId id;

    @MapsId("childId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @MapsId("fileId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    @Lob
    @NotNull
    @Column(name = "embedding", nullable = false, columnDefinition = "BLOB")
    private byte[] embedding;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "create_dttm", nullable = false)
    private LocalDateTime createDttm;

}

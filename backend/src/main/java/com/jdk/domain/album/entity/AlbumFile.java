package com.jdk.domain.album.entity;

import com.jdk.domain.file.entity.File;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "album_file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumFile {

    @EmbeddedId
    @Builder.Default
    private AlbumFileId id = new AlbumFileId();

    @MapsId("albumId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @MapsId("fileId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

}

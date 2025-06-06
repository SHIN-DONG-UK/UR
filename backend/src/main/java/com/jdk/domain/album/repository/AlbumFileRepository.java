package com.jdk.domain.album.repository;

import com.jdk.domain.album.entity.Album;
import com.jdk.domain.album.entity.AlbumFile;
import com.jdk.domain.album.entity.AlbumFileId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlbumFileRepository extends JpaRepository<AlbumFile, AlbumFileId> {

    Boolean existsByAlbum_IdAndFile_Id(int albumId, int fileId);

    List<AlbumFile> findByAlbum(Album album);

    List<AlbumFile> findByAlbumIn(List<Album> albums);
}

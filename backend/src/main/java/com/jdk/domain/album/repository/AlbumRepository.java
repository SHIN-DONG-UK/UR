package com.jdk.domain.album.repository;

import com.jdk.domain.album.entity.Album;
import com.jdk.domain.album.entity.AlbumType;
import com.jdk.domain.child.entity.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {
    Optional<Album> findByTypeAndChild_IdAndCreateAt(AlbumType type, Integer childId, LocalDate createAt);
    Optional<Album> findByTypeAndClassroomIdAndCreateAt(AlbumType type, Integer classRoomId, LocalDate createAt);

    List<Album> findByChildIn(List<Child> children);

    Album findByChild(Child child);

    List<Album> findAllByChild(Child child);
}

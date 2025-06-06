package com.jdk.domain.album.entity;

import com.jdk.domain.child.entity.Child;
import com.jdk.domain.classroom.entity.ClassRoom;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Entity
@Table(name = "album")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "album_id", nullable = false)
    private Integer id;

    @NotNull
    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AlbumType type;

    @Size(max = 100)
    @NotNull
    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @NotNull
    @ColumnDefault("(curdate())")
    @Column(name = "create_at", nullable = false)
    private LocalDate createAt;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id")
    private Child child;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id")
    private ClassRoom classroom;

}

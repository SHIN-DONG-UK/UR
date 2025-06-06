package com.jdk.domain.child.entity;

import com.jdk.domain.classroom.entity.ClassRoom;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "child")
public class Child {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "child_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_room_id", nullable = false)
    private ClassRoom classRoom;

    @Size(max = 50)
    @NotNull
    @Column(name = "child_name", nullable = false, length = 50)
    private String childName;

    @NotNull
    @Column(name = "birth_dt", nullable = false)
    private LocalDate birthDt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Size(max = 11)
    @Column(name = "contact", length = 11)
    private String contact;

    @OneToMany(mappedBy = "child", fetch = FetchType.LAZY)
    private List<ParentChild> parentChildren;


    @Size(max = 255)
    @Column(name = "profile_path")
    private String profilePath;

}

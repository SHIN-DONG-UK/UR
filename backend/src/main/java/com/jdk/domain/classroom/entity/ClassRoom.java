package com.jdk.domain.classroom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "classroom")
public class ClassRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "classroom_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "classroom_name", nullable = false, length = 50)
    private String className;

}
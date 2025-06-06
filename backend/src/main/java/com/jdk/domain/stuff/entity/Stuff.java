package com.jdk.domain.stuff.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "stuff")
public class Stuff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stuff_id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "stuff_name", nullable = false, length = 100)
    private String stuffName;

}

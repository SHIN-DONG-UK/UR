package com.jdk.domain.file.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Table(name = "file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "origin_name", nullable = false)
    private String originName;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "create_dttm", nullable = false, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime createDttm;

    @Size(max = 255)
    @NotNull
    @Column(name = "file_path", nullable = false)
    private String filePath;

    @NotNull
    @Lob
    @Column(name = "type", nullable = false)
    private String type;

}

package com.jdk.domain.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer id;

    @Size(max = 60)
    @NotNull
    @Column(name = "login_id", nullable = false, length = 60)
    private String loginId;

    @Size(max = 60)
    @NotNull
    @Column(name = "password", nullable = false, length = 60)
    private String password;

    @Size(max = 50)
    @NotNull
    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Size(max = 11)
    @NotNull
    @Column(name = "contact", nullable = false, length = 11)
    private String contact;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private Role role;

    @NotNull
    @Column(name = "create_dttm", nullable = false)
    private LocalDateTime createDttm;

    @Column(name = "delete_dttm")
    private LocalDateTime deleteDttm;

    @Size(max = 100)
    @NotNull
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "password_changed", nullable = false)
    private int passwordChanged;

    @Size(max = 255)
    @Column(name = "fcm_token")
    private String fcmToken;

}

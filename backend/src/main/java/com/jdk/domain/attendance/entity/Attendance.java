package com.jdk.domain.attendance.entity;

import com.jdk.domain.child.entity.Child;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id", nullable = false)
    private Integer id;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "checked_dttm", nullable = false)
    private LocalDateTime checkedDttm;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;


    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_type")
    private AttendanceType attendanceType;

}

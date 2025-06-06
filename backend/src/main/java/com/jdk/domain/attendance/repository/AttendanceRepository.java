package com.jdk.domain.attendance.repository;

import com.jdk.domain.attendance.entity.Attendance;
import com.jdk.domain.attendance.entity.AttendanceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    List<Attendance> findAllByCheckedDttmBetween(LocalDateTime start, LocalDateTime end);

    boolean existsByChildIdAndAttendanceTypeAndCheckedDttmBetween(Integer id, AttendanceType type, LocalDateTime localDateTime, LocalDateTime localDateTime1);
}

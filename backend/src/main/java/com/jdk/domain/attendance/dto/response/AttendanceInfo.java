package com.jdk.domain.attendance.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceInfo {
    private int childId;
    private String childName;
    private LocalDateTime attendanceDate;
}

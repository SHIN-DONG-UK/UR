package com.jdk.domain.attendance.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAttendanceResponse {
    private List<AttendanceInfo> attendanceInfoList;
    private LocalDate date;
}

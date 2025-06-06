package com.jdk.domain.attendance.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAttendanceRequest {
    private LocalDate date;
}

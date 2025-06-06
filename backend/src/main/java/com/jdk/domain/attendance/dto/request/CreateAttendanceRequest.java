package com.jdk.domain.attendance.dto.request;

import com.jdk.domain.attendance.entity.AttendanceType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAttendanceRequest {
    private String childName;
    private String[] stuffList;
    private AttendanceType Type;
}

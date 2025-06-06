package com.jdk.domain.attendance.service;

import com.jdk.domain.alert.dto.SendAlertRequest;
import com.jdk.domain.alert.service.AlertService;
import com.jdk.domain.attendance.dto.request.CreateAttendanceRequest;
import com.jdk.domain.attendance.dto.request.GetAttendanceRequest;
import com.jdk.domain.attendance.dto.response.AttendanceInfo;
import com.jdk.domain.attendance.dto.response.GetAttendanceResponse;
import com.jdk.domain.attendance.entity.Attendance;
import com.jdk.domain.attendance.entity.AttendanceType;
import com.jdk.domain.attendance.repository.AttendanceRepository;
import com.jdk.domain.child.entity.Child;
import com.jdk.domain.child.repository.ChildRepository;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final ChildRepository childRepository;
    private final AlertService alertService;

    @Transactional
    public MessageOnlyResponse createAttendance(CreateAttendanceRequest createAttendanceRequest){
        Child child = childRepository.findByChildName(createAttendanceRequest.getChildName())
                .orElseThrow(() -> new IllegalArgumentException("wrong childId"));

        LocalDate today = LocalDate.now();
        AttendanceType type = createAttendanceRequest.getType();

        if(type == AttendanceType.AM ) {
            alertService.sendAlert(child.getChildName());
        }else{
            alertService.sendAlert(SendAlertRequest.builder()
                            .childName(child.getChildName())
                            .stuffList(createAttendanceRequest.getStuffList())
                            .build());
        }

        boolean alreadyExists = attendanceRepository.existsByChildIdAndAttendanceTypeAndCheckedDttmBetween(
                child.getId(),
                type,
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay()
        );

        if (alreadyExists) {
            throw new IllegalStateException("이미 " + type + " 출석이 등록되었습니다.");
        }

        Attendance attendance = Attendance.builder()
                .child(child)
                .checkedDttm(LocalDateTime.now())
                .attendanceType(type)
                .build();

        attendanceRepository.save(attendance);

        return MessageOnlyResponse.builder().message("attendance created successful").build();
    }


    @Transactional(readOnly = true)
    public GetAttendanceResponse getAttendanceResponse(GetAttendanceRequest getAttendanceRequest){
        LocalDate targetDate = (getAttendanceRequest == null || getAttendanceRequest.getDate() == null)
                ? LocalDate.now()
                : getAttendanceRequest.getDate();

        LocalDateTime start = targetDate.atStartOfDay();
        LocalDateTime end   = targetDate.plusDays(1).atStartOfDay();

        List<AttendanceInfo> attendanceInfoList = attendanceRepository.findAllByCheckedDttmBetween(start, end)
                .stream().map(attendance -> AttendanceInfo.builder()
                        .childId(attendance.getChild().getId())
                        .childName(attendance.getChild().getChildName())
                        .attendanceDate(attendance.getCheckedDttm())
                        .build()
                ).toList();

        return GetAttendanceResponse.builder()
                .attendanceInfoList(attendanceInfoList)
                .date(targetDate)
                .build();
    }
}

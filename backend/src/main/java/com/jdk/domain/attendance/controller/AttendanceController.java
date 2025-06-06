package com.jdk.domain.attendance.controller;

import com.jdk.domain.attendance.dto.request.CreateAttendanceRequest;
import com.jdk.domain.attendance.dto.request.GetAttendanceRequest;
import com.jdk.domain.attendance.dto.response.GetAttendanceResponse;
import com.jdk.domain.attendance.service.AttendanceService;
import com.jdk.global.dto.response.ApiResponse;
import com.jdk.global.dto.response.MessageOnlyResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/attendance")
@Slf4j
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping("/create")
    @SecurityRequirement(name = "ApiKeyAuth")
    public ApiResponse<MessageOnlyResponse> createAttendance(@RequestBody CreateAttendanceRequest createAttendanceRequest){
        return ApiResponse.success(attendanceService.createAttendance(createAttendanceRequest));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/select")
    public ApiResponse<GetAttendanceResponse> getAttendanceResponse(@RequestBody GetAttendanceRequest getAttendanceRequest){
        return ApiResponse.success(attendanceService.getAttendanceResponse(getAttendanceRequest));

    }
}

package com.jdk.domain.classroom.controller;

import com.jdk.domain.classroom.dto.response.GetClassroomListResponse;
import com.jdk.domain.classroom.service.ClassroomService;
import com.jdk.global.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/classroom")
@Slf4j
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomService classroomService;

    @GetMapping("/select")
    public ApiResponse<GetClassroomListResponse> getClassroomListResponseApi(){
        return ApiResponse.success(classroomService.getClassroomList());
    }
}

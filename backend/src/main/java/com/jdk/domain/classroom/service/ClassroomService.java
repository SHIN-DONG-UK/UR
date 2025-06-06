package com.jdk.domain.classroom.service;

import com.jdk.domain.classroom.dto.response.ClassroomInfo;
import com.jdk.domain.classroom.dto.response.GetClassroomListResponse;
import com.jdk.domain.classroom.repository.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;

    public GetClassroomListResponse getClassroomList(){

        List<ClassroomInfo> classroomInfoList = classroomRepository.findAll().stream()
                .map(cr -> ClassroomInfo.builder()
                        .classroomId(cr.getId())
                        .classroomName(cr.getClassName())
                        .build())
                .toList();

        return GetClassroomListResponse.builder().classroomList(classroomInfoList).build();
    }
}

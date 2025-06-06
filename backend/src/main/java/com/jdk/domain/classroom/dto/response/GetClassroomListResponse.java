package com.jdk.domain.classroom.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetClassroomListResponse {
    List<ClassroomInfo> classroomList;
}

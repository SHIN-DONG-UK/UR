package com.jdk.domain.classroom.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassroomInfo {

    private int classroomId;
    private String classroomName;
}

package com.jdk.domain.child.dto.request;

import com.jdk.domain.child.entity.Gender;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateChildRequest {
    private int classRoomId;

    private String childName;

    private LocalDate birthDt;

    private Gender gender;

    private String contact;
}

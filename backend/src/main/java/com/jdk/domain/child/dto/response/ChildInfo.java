package com.jdk.domain.child.dto.response;

import com.jdk.domain.child.entity.Gender;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ChildInfo {
    private int childId;
    private String classRoomName;
    private String childName;
    private Gender gender;
    private String contact;
    private LocalDate birthDt;
    private String noteText;
    private List<ParentInfo> parentList;
}

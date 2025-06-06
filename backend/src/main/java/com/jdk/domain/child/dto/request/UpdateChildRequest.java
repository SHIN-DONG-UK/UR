package com.jdk.domain.child.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateChildRequest {
    private int childId;
    private int classRoomId;
    private String contact;
    private String noteText;
}

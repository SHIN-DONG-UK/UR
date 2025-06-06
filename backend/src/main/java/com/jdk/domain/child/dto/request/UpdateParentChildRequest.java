package com.jdk.domain.child.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateParentChildRequest {
    private int childId;
    private int parentId;
}

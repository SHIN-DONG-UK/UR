package com.jdk.domain.child.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentInfo {
    private int parentId;
    private String parentName;
    private String parentContact;
}

package com.jdk.domain.child.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetChildResponse {
    private List<ChildInfo> childList;
}

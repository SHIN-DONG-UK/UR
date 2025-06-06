package com.jdk.domain.child.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetChildDetailRequest {
    private int childId;
}

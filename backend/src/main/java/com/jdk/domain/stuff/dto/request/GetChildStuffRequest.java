package com.jdk.domain.stuff.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetChildStuffRequest {
    private String childName;
}

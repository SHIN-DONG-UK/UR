package com.jdk.domain.stuff.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAndDeleteChildStuffRequest {
    private String childName;
    private String[] stuffName;
}

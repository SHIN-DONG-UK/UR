package com.jdk.domain.stuff.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildStuffInfo {
    private String childName;
    private String stuffName;
}

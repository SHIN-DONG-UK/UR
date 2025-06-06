package com.jdk.domain.alert.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendAlertRequest {
    private String childName;
    private String[] stuffList;
    private String Type;
}

package com.jdk.domain.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateParentResponse {
    private int userId;
    private String loginId;
}

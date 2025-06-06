package com.jdk.domain.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetMyProfileResponse {
    private int userId;
    private String loginId;
    private String name;
    private String contact;
    private String email;
    private String role;
}

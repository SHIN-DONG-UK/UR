package com.jdk.domain.user.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateProfileRequest {
    private String contact;
    private String email;

}

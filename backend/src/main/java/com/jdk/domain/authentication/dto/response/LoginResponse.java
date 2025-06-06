package com.jdk.domain.authentication.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class LoginResponse {

    private final int userId;
    private final String role;
    private final String accessToken;
    private int passwordChanged;
}

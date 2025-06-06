package com.jdk.domain.authentication.controller;

import com.jdk.domain.authentication.dto.request.LoginRequest;
import com.jdk.domain.authentication.dto.response.LoginResponse;
import com.jdk.domain.authentication.service.AuthenticationService;
import com.jdk.global.dto.response.ApiResponse;
import com.jdk.global.dto.response.MessageOnlyResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name="Authentication", description="인증")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    //로그인
    @PostMapping("/login")
    @Operation(summary = "Login 로그인", description = "로그인")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest loginRequest){
        return ApiResponse.success(authenticationService.login(loginRequest));
    }


    //로그아웃
    @PostMapping("/logout")
    @Operation(summary = "Logout 로그아웃", description = "로그아웃")
    public MessageOnlyResponse logout(){
        return MessageOnlyResponse.builder()
                .message(authenticationService.logout())
                .build();
    }

}

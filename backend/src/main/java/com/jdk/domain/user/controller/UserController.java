package com.jdk.domain.user.controller;

import com.jdk.domain.user.dto.request.CreateParentRequest;
import com.jdk.domain.user.dto.request.UpdatePasswordRequest;
import com.jdk.domain.user.dto.request.UpdateProfileRequest;
import com.jdk.domain.user.dto.response.GetMyProfileResponse;
import com.jdk.domain.user.dto.response.ParentListResponse;
import com.jdk.domain.user.service.UserService;
import com.jdk.global.dto.response.ApiResponse;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //c
    //교사의 학부모 계정 생성
    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/create/parent")
    public ApiResponse<MessageOnlyResponse> createParent(@RequestBody CreateParentRequest createParentRequest){
        return ApiResponse.success(userService.createParent(createParentRequest));
    }

    //r
    //학부모 목록 조회
    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping("/select/parent-list")
    public ApiResponse<ParentListResponse> getParentList(){
        return ApiResponse.success(userService.getParentList());
    }

    @GetMapping("/select/my-profile")
    public ApiResponse<GetMyProfileResponse> getMyProfile(){
        return ApiResponse.success(userService.getMyProfile());
    }

    //u
    //정보 수정
    @PostMapping("/update/profile")
    public ApiResponse<MessageOnlyResponse> updateProfile(@RequestBody UpdateProfileRequest updateProfileRequest){
        return ApiResponse.success(userService.updateProfile(updateProfileRequest));
    }

    @GetMapping("/update/fcm-token")
    public ApiResponse<MessageOnlyResponse> updateFcmToken(@RequestParam String fcmToken){
        return ApiResponse.success(userService.updateFcmToken(fcmToken));
    }

    //비밀번호 변경
    @PostMapping("/update/password")
    public ApiResponse<MessageOnlyResponse> updatePassword(@RequestBody UpdatePasswordRequest updatePasswordRequest){
        return ApiResponse.success(userService.updatePassword(updatePasswordRequest));
    }

    //d
    //학부모 탈퇴
    @PreAuthorize("hasRole('PARENT')")
    @DeleteMapping("/delete/parent")
    public ApiResponse<MessageOnlyResponse> deleteParent(){
        return ApiResponse.success(userService.deleteParent());
    }
}

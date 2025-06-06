package com.jdk.domain.user.service;

import com.jdk.domain.user.dto.request.CreateParentRequest;
import com.jdk.domain.user.dto.request.UpdatePasswordRequest;
import com.jdk.domain.user.dto.request.UpdateProfileRequest;
import com.jdk.domain.user.dto.response.GetMyProfileResponse;
import com.jdk.domain.user.dto.response.ParentListResponse;
import com.jdk.domain.user.dto.response.ParentListResponse.ParentInfo;
import com.jdk.domain.user.entity.Parent;
import com.jdk.domain.user.entity.Role;
import com.jdk.domain.user.entity.User;
import com.jdk.domain.user.repository.ParentRepository;
import com.jdk.domain.user.repository.UserRepository;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ParentRepository parentRepository;

    public MessageOnlyResponse createParent(@RequestBody CreateParentRequest createParentRequest){
        userRepository.findByLoginId(createParentRequest.getLoginId()).ifPresent(u -> {throw new IllegalArgumentException("LoginId is already exist");});

        String tempPassword = passwordEncoder.encode(UUID.randomUUID().toString().substring(0, 8));

        User parentUser = User.builder()
                .loginId(createParentRequest.getLoginId())
                .password(tempPassword)
                .name(createParentRequest.getName())
                .contact(createParentRequest.getContact())
                .role(Role.PARENT)
                .email(createParentRequest.getEmail())
                .createDttm(LocalDateTime.now())
                .passwordChanged(0)
                .build();

        userRepository.save(parentUser);

        Parent parent = Parent.builder()
                .user(parentUser)
                .build();

        parentRepository.save(parent);

        return MessageOnlyResponse.builder().message("학부모 계정 생성이 완료되었습니다. LoginId: " + parentUser.getLoginId()).build();
    }

    @Transactional(readOnly = true)
    public ParentListResponse getParentList(){
        List<ParentInfo> parentInfos = userRepository.findAllByRole(Role.PARENT).stream()
                .map(
                        u -> ParentInfo.builder()
                                .userId(u.getId())
                                .name(u.getName())
                                .email(u.getEmail())
                                .contact(u.getContact())
                                .createDttm(u.getCreateDttm())
                                .build()
                )
                .toList();

        return ParentListResponse.builder().parentList(parentInfos).build();
    }

    @Transactional(readOnly = true)
    public GetMyProfileResponse getMyProfile(){
        User user = getUser();

        return GetMyProfileResponse.builder()
                .userId(user.getId())
                .loginId(user.getLoginId())
                .name(user.getName())
                .contact(user.getContact())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public MessageOnlyResponse updateProfile(UpdateProfileRequest updateProfileRequest){
        User user = getUser();
        user.setContact(updateProfileRequest.getContact());
        user.setEmail(updateProfileRequest.getEmail());

        return MessageOnlyResponse.builder().message("Profile updated successfully").build();

    }

    @Transactional
    public MessageOnlyResponse updatePassword(UpdatePasswordRequest updatePasswordRequest){
        User user = getUser();
        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getNewPassword()));

        return MessageOnlyResponse.builder().message("Password updated successfully").build();
    }

    @Transactional
    public MessageOnlyResponse deleteParent(){
        User user = getUser();
        userRepository.delete(user);

        return MessageOnlyResponse.builder().message("Parent account deleted successfully").build();
    }

    public User getUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !authentication.isAuthenticated()){
            throw new IllegalArgumentException("wrong authentication");
        }

        String loginId = authentication.getName();

        return userRepository.findByLoginId(loginId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public MessageOnlyResponse updateFcmToken(String fcmToken){
        User user = getUser();
        user.setFcmToken(fcmToken);
        return MessageOnlyResponse.builder().message("FCM token updated successfully").build();
    }

}

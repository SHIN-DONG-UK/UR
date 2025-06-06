package com.jdk.domain.authentication.service;

import com.jdk.domain.authentication.dto.request.LoginRequest;
import com.jdk.domain.authentication.dto.response.LoginResponse;
import com.jdk.domain.user.entity.User;
import com.jdk.domain.user.repository.UserRepository;
import com.jdk.global.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String REFRESH_TOKEN_PREFIX = "refresh_token:";

    @Transactional
    public LoginResponse login(LoginRequest loginRequest){
        User user = userRepository.findByLoginId(loginRequest.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("Password is not correct");
        }

        String refreshToken = jwtUtil.generateRefreshToken(user.getLoginId(), user.getRole().name());
        String accessToken = jwtUtil.generateAccessToken(user.getLoginId(), user.getRole().name());

        redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + user.getLoginId(), refreshToken, Duration.ofMillis(jwtUtil.getRefreshExpirationTime()));

        return LoginResponse.builder()
                .userId(user.getId())
                .accessToken(accessToken)
                .role(user.getRole().name())
                .passwordChanged(user.getPasswordChanged())
                .build();
    }

    public String logout(){
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
        String bearerToken = request.getHeader("Authorization");

        if(bearerToken == null || !bearerToken.startsWith("Bearer ")){
            throw new IllegalArgumentException("Invalid bearer token");
        }

        String accessToken = bearerToken.substring(7);

        String loginUser = jwtUtil.validateToken(accessToken);

        redisTemplate.delete(REFRESH_TOKEN_PREFIX + loginUser);
        SecurityContextHolder.clearContext();

        return "Logout success. Login user : " + loginUser;
    }
}

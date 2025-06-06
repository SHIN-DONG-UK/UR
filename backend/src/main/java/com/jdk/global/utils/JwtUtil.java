package com.jdk.global.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.algorithm}")
    private String jwtAlgorithm;

    private Key jwtKey;
    private long accessExpirationTime;
    private long refreshExpirationTime;

    @PostConstruct
    public void init() {
        jwtKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        accessExpirationTime = 1000L * 60 * 15; //15분
        refreshExpirationTime = 1000L * 60 * 60 * 24; //24시간
    }

    public String generateAccessToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessExpirationTime))
                .signWith(jwtKey, SignatureAlgorithm.forName(jwtAlgorithm))
                .compact();
    }

    public String generateRefreshToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationTime))
                .signWith(jwtKey, SignatureAlgorithm.forName(jwtAlgorithm))
                .compact();
    }

    public String validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            logger.warn("JWT 토큰이 만료되었습니다: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.warn("지원되지 않는 JWT 형식입니다: {} ", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.warn("잘못된 JWT 서명입니다: {}", e.getMessage());
        } catch (SecurityException e) {
            logger.warn("JWT 서명 검증 실패: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.warn("JWT 토큰이 비어있거나 잘못되었습니다: {}", e.getMessage());
        }
        return null;
    }

    public boolean isValidToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(jwtKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.warn("JWT 검증 실패: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(jwtKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();

            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            logger.error("토큰 만료 여부 확인 중 오류 발생: {}", e.getMessage());
            return true;
        }
    }

    public long getRemainExpiredTime(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            long expirationTime = claims.getExpiration().getTime();
            long currentTime = System.currentTimeMillis();
            return Math.max(expirationTime - currentTime, 0);
        } catch (ExpiredJwtException e) {
            return 0;
        } catch (Exception e) {
            logger.error("남은 만료 시간 계산 실패: {}", e.getMessage());
            return -1;
        }
    }

    public String getUsername(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            logger.error("사용자를 가져올 수 없습니다: {}", e.getMessage());
            return null;
        }
    }

    public Long getRefreshExpirationTime(){
        return refreshExpirationTime;
    }

    public String getClaim(String token, String claimKey) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Object value = claims.get(claimKey);
            return value != null ? value.toString() : null;
        } catch (Exception e) {
            logger.error("클레임 [{}] 을(를) 가져오는 중 오류: {}", claimKey, e.getMessage());
            return null;
        }
    }

}


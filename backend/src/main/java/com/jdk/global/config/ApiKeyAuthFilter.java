package com.jdk.global.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    @Value("${hardware.api.key}")
    private String validApiKey;

    /* ── API-Key로 보호할 ‘접두사’ 목록 ───────────────────────── */
    private static final List<String> PROTECTED_PREFIXES = List.of(
            "/attendance/create",
            "/file/upload",
            "/album/create",
            "/face-embedding/select/init-data",
            "/stuff/"                      // ← /stuff 로 시작하는 모든 URI
    );

    private static final String APIKEY_PREFIX = "ApiKey ";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String uri = req.getRequestURI();

        /* ① 보호 대상 경로인지 판별 (접두사 매칭) */
        boolean protectedPath = PROTECTED_PREFIXES.stream()
                .anyMatch(uri::startsWith);
        if (!protectedPath) {
            chain.doFilter(req, res);
            return;
        }

        /* ② 헤더 추출 */
        String apiKey = req.getHeader("X-API-KEY");
        String auth   = req.getHeader("Authorization");

        /* ③ Bearer JWT면 그대로 뒤 필터(JwtFilter)에서 처리 */
        if (auth != null && auth.startsWith(BEARER_PREFIX)) {
            chain.doFilter(req, res);
            return;
        }

        /* ④ ApiKey 헤더 형식 파싱 */
        if (apiKey == null && auth != null && auth.startsWith(APIKEY_PREFIX)) {
            apiKey = auth.substring(APIKEY_PREFIX.length());
        }

        /* ⑤ API-Key 검증 */
        if (apiKey == null || !apiKey.equals(validApiKey)) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("Invalid or missing API Key");
            return;
        }

        /* ⑥ ROLE_DEVICE 권한 주입 */
        var authToken = new UsernamePasswordAuthenticationToken(
                "hardware", null,
                List.of(new SimpleGrantedAuthority("ROLE_DEVICE")));
        SecurityContextHolder.getContext().setAuthentication(authToken);

        chain.doFilter(req, res);
    }
}

package com.jdk.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final ApiKeyAuthFilter apiKeyAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            org.springframework.security.config.annotation.web.builders.HttpSecurity http
    ) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable);

        http.sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        /* CORS */
        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration cfg = new CorsConfiguration();
            cfg.setAllowedOriginPatterns(List.of(
                    "http://localhost:*",
                    "http://127.0.0.1:*",
                    "https://c203ur.duckdns.org"
            ));
            cfg.addAllowedMethod(CorsConfiguration.ALL);
            cfg.addAllowedHeader(CorsConfiguration.ALL);
            cfg.addExposedHeader("Authorization");
            cfg.setAllowCredentials(true);
            return cfg;
        }));

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                /* 공개 엔드포인트 */
                .requestMatchers("/auth/login", "/auth/signup").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**",
                        "/swagger-resources/**", "/webjars/**").permitAll()

                /* API-Key  또는  JWT(교사) 둘 다 허용 */
                .requestMatchers("/attendance/create",
                        "/file/upload",
                        "/album/create",
                        "/face-embedding/select/init-data",
                        "/stuff/**")
                .hasAnyRole("DEVICE", "TEACHER")


                /* 그 외는 JWT 인증 */
                .anyRequest().authenticated()
        );

        /* 필터 순서: ApiKey → Jwt */
        http.addFilterBefore(apiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterAfter(jwtFilter, ApiKeyAuthFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}

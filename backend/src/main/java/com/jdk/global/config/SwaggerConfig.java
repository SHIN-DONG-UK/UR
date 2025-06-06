package com.jdk.global.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@OpenAPIDefinition(info = @io.swagger.v3.oas.annotations.info.Info(title = "API Documentation of C203 UR", version = "0.0"))
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        Info info = new Info()
                .title("ur")
                .description("<h3>ur</h3>")
                .version("v1");

        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .info(info);
    }

    @Bean
    public GroupedOpenApi authenticationApi() {
        return GroupedOpenApi.builder()
                .group("Authentication API")
                .pathsToMatch("/auth/**")
                .build();
    }

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                .group("user API")
                .pathsToMatch("/user/**")
                .build();
    }

    @Bean
    public GroupedOpenApi childApi() {
        return GroupedOpenApi.builder()
                .group("child API")
                .pathsToMatch("/child/**")
                .build();
    }

    @Bean
    public GroupedOpenApi classroomApi() {
        return GroupedOpenApi.builder()
                .group("classroom API")
                .pathsToMatch("/classroom/**")
                .build();
    }

    @Bean
    public GroupedOpenApi faceEmbeddingApi() {
        return GroupedOpenApi.builder()
                .group("faceEmbedding API")
                .pathsToMatch("/face-embedding/**")
                .build();
    }

    @Bean
    public GroupedOpenApi noticeApi() {
        return GroupedOpenApi.builder()
                .group("notice API")
                .pathsToMatch("/notice/**")
                .build();
    }

    @Bean
    public GroupedOpenApi attendanceApi() {
        return GroupedOpenApi.builder()
                .group("attendance API")
                .pathsToMatch("/attendance/**")
                .build();
    }

    @Bean
    public GroupedOpenApi fileApi() {
        return GroupedOpenApi.builder()
                .group("file API")
                .pathsToMatch("/file/**")
                .build();
    }

    @Bean
    public GroupedOpenApi albumApi() {
        return GroupedOpenApi.builder()
                .group("album API")
                .pathsToMatch("/album/**")
                .build();
    }

    @Bean
    public GroupedOpenApi stuffApi() {
        return GroupedOpenApi.builder()
                .group("stuff API")
                .pathsToMatch("/stuff/**")
                .build();
    }
}

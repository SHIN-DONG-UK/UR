package com.jdk.global.dto.response;

import lombok.*;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {

    private static final String DEFAULT_SUCCESS_MESSAGE = "success";

    private String code;
    private String message;
    private int status;
    private T result;

    public static <T> ApiResponse<T> success(T result) {
        return ApiResponse.<T>builder()
                .status(HttpStatus.OK.value())
                .code(String.valueOf(HttpStatus.OK.value()))
                .message(DEFAULT_SUCCESS_MESSAGE)
                .result(result)
                .build();
    }

    public static <T> ApiResponse<T> success(HttpStatus status, T result) {
        return ApiResponse.<T>builder()
                .status(status.value())
                .code(String.valueOf(status.value()))
                .message(DEFAULT_SUCCESS_MESSAGE)
                .result(result)
                .build();
    }

    public static <T> ApiResponse<T> success(T result, String message) {
        return ApiResponse.<T>builder()
                .status(HttpStatus.OK.value())
                .code(String.valueOf(HttpStatus.OK.value()))
                .message(message)
                .result(result)
                .build();
    }

}

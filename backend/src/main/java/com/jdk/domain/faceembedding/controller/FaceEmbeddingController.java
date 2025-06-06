package com.jdk.domain.faceembedding.controller;

import com.jdk.domain.faceembedding.dto.response.GetInitDataResponse;
import com.jdk.domain.faceembedding.service.FaceEmbeddingService;
import com.jdk.global.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/face-embedding")
@Slf4j
@RequiredArgsConstructor
public class FaceEmbeddingController {
    private final FaceEmbeddingService faceEmbeddingService;

    @GetMapping("/select/init-data")
    public ApiResponse<GetInitDataResponse> getInitData(){
        return ApiResponse.success(faceEmbeddingService.getInitData());
    }


}

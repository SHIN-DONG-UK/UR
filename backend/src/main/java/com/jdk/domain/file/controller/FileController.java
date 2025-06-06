package com.jdk.domain.file.controller;

import com.jdk.domain.file.dto.request.UploadFilesRequest;
import com.jdk.domain.file.dto.response.UploadFilesResponse;
import com.jdk.domain.file.service.FileService;
import com.jdk.global.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    @PostMapping(value="/upload",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UploadFilesResponse> uploadFiles(@ModelAttribute UploadFilesRequest uploadFilesRequest){
        return ApiResponse.success(fileService.uploadFiles(uploadFilesRequest));
    }
}

package com.jdk.domain.notice.controller;

import com.jdk.domain.notice.dto.request.CreateNoticeRequest;
import com.jdk.domain.notice.dto.request.DeleteNoticeRequest;
import com.jdk.domain.notice.dto.request.UpdateNoticeRequest;
import com.jdk.domain.notice.dto.response.GetNoticeListResponse;
import com.jdk.domain.notice.service.NoticeService;
import com.jdk.global.dto.response.ApiResponse;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<MessageOnlyResponse> createNotice(@RequestBody CreateNoticeRequest createNoticeRequest){
        return ApiResponse.success(noticeService.createNotice(createNoticeRequest));

    }

    @GetMapping("/select/notice-list")
    public ApiResponse<GetNoticeListResponse> getNoticeList(){
        return ApiResponse.success(noticeService.getNoticeList());
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/update")
    public ApiResponse<MessageOnlyResponse> updateNotice(@RequestBody UpdateNoticeRequest updateNoticeRequest){
        return ApiResponse.success(noticeService.updateNotice(updateNoticeRequest));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/delete")
    public ApiResponse<MessageOnlyResponse> deleteNotice(@RequestBody DeleteNoticeRequest deleteNoticeRequest){
        return ApiResponse.success(noticeService.deleteNotice(deleteNoticeRequest));
    }
}

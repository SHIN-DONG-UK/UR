package com.jdk.domain.child.controller;

import com.jdk.domain.child.dto.request.CreateChildRequest;
import com.jdk.domain.child.dto.request.GetChildDetailRequest;
import com.jdk.domain.child.dto.request.UpdateChildRequest;
import com.jdk.domain.child.dto.request.UpdateParentChildRequest;
import com.jdk.domain.child.dto.response.ChildInfo;
import com.jdk.domain.child.dto.response.GetChildResponse;
import com.jdk.domain.child.service.ChildService;
import com.jdk.global.dto.response.ApiResponse;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/child")
@Slf4j
@RequiredArgsConstructor
public class ChildController {

    private final ChildService childService;

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/creat")
    public ApiResponse<MessageOnlyResponse> createChild(@RequestBody CreateChildRequest createChildRequest){
        return ApiResponse.success(childService.createChild(createChildRequest));

    }

    @PostMapping("/update")
    public ApiResponse<MessageOnlyResponse> updateChild(@RequestBody UpdateChildRequest updateChildRequest){
        return ApiResponse.success(childService.updateChild(updateChildRequest));
    }

    @GetMapping("/select")
    public ApiResponse<GetChildResponse> getChild(){
        return ApiResponse.success(childService.getChildList());
    }

    @PostMapping("/detail")
    public ApiResponse<ChildInfo> getChildDetail(@RequestBody GetChildDetailRequest getChildDetailRequest){
        return ApiResponse.success(childService.getChildDetail(getChildDetailRequest));
    }

    @PostMapping("/update/parent-child")
    public ApiResponse<MessageOnlyResponse> updateParentChild(@RequestBody UpdateParentChildRequest updateParentChildRequest){
        return ApiResponse.success(childService.updateParentChild(updateParentChildRequest));
    }

}

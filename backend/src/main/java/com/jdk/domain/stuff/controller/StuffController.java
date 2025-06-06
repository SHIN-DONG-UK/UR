package com.jdk.domain.stuff.controller;

import com.jdk.domain.stuff.dto.request.CreateAndDeleteChildStuffRequest;
import com.jdk.domain.stuff.dto.request.GetChildStuffRequest;
import com.jdk.domain.stuff.dto.response.GetAndDeleteChildStuffResponse;
import com.jdk.domain.stuff.service.StuffService;
import com.jdk.global.dto.response.ApiResponse;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/stuff")
public class StuffController {

    private final StuffService stuffService;

    @PostMapping("/create")
    public ApiResponse<MessageOnlyResponse> createChildStuff(@RequestBody CreateAndDeleteChildStuffRequest createAndDeleteChildStuffRequest){
        return ApiResponse.success(stuffService.createChildStuff(createAndDeleteChildStuffRequest));
    }

    @PostMapping("/select")
    public ApiResponse<GetAndDeleteChildStuffResponse> getChildStuff(@RequestBody GetChildStuffRequest getChildStuffRequest){
        return ApiResponse.success(stuffService.getChildStuff(getChildStuffRequest));
    }

    @PostMapping("/delete")
    public ApiResponse<GetAndDeleteChildStuffResponse> deleteChildStuff(@RequestBody CreateAndDeleteChildStuffRequest createAndDeleteChildStuffRequest){
        return ApiResponse.success(stuffService.deleteChildStuff(createAndDeleteChildStuffRequest));
    }

}

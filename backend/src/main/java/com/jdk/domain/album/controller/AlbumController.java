package com.jdk.domain.album.controller;

import com.jdk.domain.album.dto.request.CreateAlbumRequest;
import com.jdk.domain.album.dto.request.GetChildAlbumItemsRequest;
import com.jdk.domain.album.dto.response.GetAlbumCoverListResponse;
import com.jdk.domain.album.dto.response.GetAlbumListResponse;
import com.jdk.domain.album.dto.response.GetChildAlbumItemResponse;
import com.jdk.domain.album.service.AlbumService;
import com.jdk.global.dto.response.ApiResponse;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/album")
@RequiredArgsConstructor
public class AlbumController {
    private final AlbumService albumService;

    @PostMapping("/create")
    public ApiResponse<MessageOnlyResponse> createAlbum(@RequestBody CreateAlbumRequest createAlbumRequest){
        return ApiResponse.success(albumService.createAlbum(createAlbumRequest));
    }

    @GetMapping("/select/covers")
    public ApiResponse<GetAlbumCoverListResponse> getAlbumCoverList(){
        return ApiResponse.success(albumService.getAlbumCoverList());
    }

    @GetMapping("/select/list")
    public ApiResponse<GetAlbumListResponse> getAlbumList(){
        return ApiResponse.success(albumService.getAlbumList());
    }

    @PostMapping("select/child-album-items")
    public ApiResponse<GetChildAlbumItemResponse> getChildAlbumItems(@RequestBody GetChildAlbumItemsRequest getChildAlbumItemsRequest){
        return ApiResponse.success(albumService.getChildAlbumItems(getChildAlbumItemsRequest));
    }
}

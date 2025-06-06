package com.jdk.domain.album.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAlbumListResponse {
    private List<AlbumListInfo> albumListInfoList;
}

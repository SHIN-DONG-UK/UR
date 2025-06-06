package com.jdk.domain.album.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAlbumCoverListResponse {
    private List<AlbumCover> childAlbumCoverList;
    private List<AlbumCover> classAlbumCoverList;

}

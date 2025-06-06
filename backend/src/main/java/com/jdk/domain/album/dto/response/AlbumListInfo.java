package com.jdk.domain.album.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumListInfo {
    private int albumId;
    private String title;
    private String thumbnail;
}

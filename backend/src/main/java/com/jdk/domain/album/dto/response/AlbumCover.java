package com.jdk.domain.album.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumCover {
    private int childId;
    private String title;
    private String className;
    private String thumbnail;
}

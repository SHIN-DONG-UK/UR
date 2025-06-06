package com.jdk.domain.album.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetChildAlbumItemsRequest {
    private int childId;
}

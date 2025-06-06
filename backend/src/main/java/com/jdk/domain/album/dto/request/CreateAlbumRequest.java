package com.jdk.domain.album.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAlbumRequest {
    private int fileId;
    private List<String> targetName;
    private String type;
}

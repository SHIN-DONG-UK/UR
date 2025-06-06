package com.jdk.domain.album.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildAlbumItem {
    private String[] filePath;
    private LocalDate uploadDate;
}

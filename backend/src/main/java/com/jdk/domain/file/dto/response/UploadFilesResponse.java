package com.jdk.domain.file.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadFilesResponse {
    private List<Integer> fileIds;
    private List<String>  filePaths;
}

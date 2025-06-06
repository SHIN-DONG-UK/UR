package com.jdk.domain.faceembedding.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetInitDataResponse {
    List<EmbeddingInfo> EmbeddingList;
}

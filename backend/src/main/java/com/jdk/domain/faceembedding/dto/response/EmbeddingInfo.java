package com.jdk.domain.faceembedding.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmbeddingInfo {
    private String childName;
    private float[] embedding;
}

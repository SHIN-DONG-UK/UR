package com.jdk.domain.faceembedding.service;

import com.jdk.domain.faceembedding.dto.response.EmbeddingInfo;
import com.jdk.domain.faceembedding.dto.response.GetInitDataResponse;
import com.jdk.domain.faceembedding.repository.FaceEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FaceEmbeddingService {

    private final FaceEmbeddingRepository faceEmbeddingRepository;

    public GetInitDataResponse getInitData() {
        List<EmbeddingInfo> embeddingInfoList = faceEmbeddingRepository.findAll().stream()
                .map(e -> EmbeddingInfo.builder()
                        .childName(e.getChild().getChildName())
                        .embedding(bytesToFloatArray(e.getEmbedding()))
                        .build())
                .toList();

        return GetInitDataResponse.builder()
                .EmbeddingList(embeddingInfoList)
                .build();
    }

    private static float[] bytesToFloatArray(byte[] bytes) {
        if (bytes == null) return new float[0];

        int dim = bytes.length / Float.BYTES;         // 보통 512
        float[] vec = new float[dim];

        ByteBuffer bb = ByteBuffer.wrap(bytes)
                .order(ByteOrder.LITTLE_ENDIAN);

        for (int i = 0; i < dim; i++) {
            vec[i] = bb.getFloat();
        }
        return vec;
    }
}

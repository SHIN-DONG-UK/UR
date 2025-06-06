package com.jdk.domain.user.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentListResponse {
    private List<ParentInfo> parentList;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ParentInfo {
        private int userId;
        private String name;
        private String contact;
        private String email;
        private LocalDateTime createDttm;
    }
}

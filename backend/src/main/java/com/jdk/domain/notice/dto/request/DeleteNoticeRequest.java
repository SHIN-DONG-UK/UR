package com.jdk.domain.notice.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteNoticeRequest {
    private int noticeId;
}

package com.jdk.domain.notice.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateNoticeRequest {
    private int noticeId;
    private String title;
    private String NoticeBody;
}

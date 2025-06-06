package com.jdk.domain.notice.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeInfo {
    private int noticeId;
    private String title;
    private String noticeBody;
    private LocalDateTime createDttm;
}

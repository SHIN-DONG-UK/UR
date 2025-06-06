package com.jdk.domain.notice.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateNoticeRequest {
    private String title;
    private String NoticeBody;
}

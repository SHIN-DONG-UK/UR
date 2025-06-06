package com.jdk.domain.notice.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetNoticeListResponse {
    List<NoticeInfo> noticeList;
}

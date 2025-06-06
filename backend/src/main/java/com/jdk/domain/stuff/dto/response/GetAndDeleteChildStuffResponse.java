package com.jdk.domain.stuff.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAndDeleteChildStuffResponse {
    private List<ChildStuffInfo> childStuffInfoList;
}

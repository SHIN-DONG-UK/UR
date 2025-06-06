package com.jdk.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateParentRequest {
    @NotBlank
    private String loginId;

    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String contact;
}

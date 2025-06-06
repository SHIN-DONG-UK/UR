package com.jdk.domain.child.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentChildId implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private int userId;

    private int childId;
}
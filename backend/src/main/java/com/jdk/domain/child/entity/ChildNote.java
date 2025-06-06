package com.jdk.domain.child.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "child_note")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ChildNote {
    @Id
    private String id;

    private Integer childId;

    private String childName;

    private String note;
}

package com.jdk.domain.child.entity;

import com.jdk.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parent_child")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentChild {

    @EmbeddedId
    private ParentChildId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("childId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

}

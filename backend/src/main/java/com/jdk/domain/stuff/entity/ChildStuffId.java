package com.jdk.domain.stuff.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ChildStuffId implements java.io.Serializable {
    @Serial
    private static final long serialVersionUID = -5584180342946891568L;
    @NotNull
    @Column(name = "child_id", nullable = false)
    private Integer childId;

    @NotNull
    @Column(name = "stuff_id", nullable = false)
    private Integer stuffId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ChildStuffId entity = (ChildStuffId) o;
        return Objects.equals(this.stuffId, entity.stuffId) &&
                Objects.equals(this.childId, entity.childId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(stuffId, childId);
    }

}
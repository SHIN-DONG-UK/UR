package com.jdk.domain.child.service;

import com.jdk.domain.child.dto.request.CreateChildRequest;
import com.jdk.domain.child.dto.request.GetChildDetailRequest;
import com.jdk.domain.child.dto.request.UpdateChildRequest;
import com.jdk.domain.child.dto.request.UpdateParentChildRequest;
import com.jdk.domain.child.dto.response.ChildInfo;
import com.jdk.domain.child.dto.response.GetChildResponse;
import com.jdk.domain.child.dto.response.ParentInfo;
import com.jdk.domain.child.entity.Child;
import com.jdk.domain.child.entity.ChildNote;
import com.jdk.domain.child.entity.ParentChild;
import com.jdk.domain.child.entity.ParentChildId;
import com.jdk.domain.child.repository.ChildNoteRepository;
import com.jdk.domain.child.repository.ChildRepository;
import com.jdk.domain.child.repository.ParentChildRepository;
import com.jdk.domain.classroom.entity.ClassRoom;
import com.jdk.domain.classroom.repository.ClassroomRepository;
import com.jdk.domain.user.entity.Role;
import com.jdk.domain.user.entity.User;
import com.jdk.domain.user.repository.UserRepository;
import com.jdk.domain.user.service.UserService;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChildService {

    private final UserService userService;
    private final ChildRepository childRepository;
    private final ClassroomRepository classroomRepository;
    private final ParentChildRepository parentChildRepository;
    private final ChildNoteRepository childNoteRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageOnlyResponse createChild(CreateChildRequest req) {
        ClassRoom classroom = classroomRepository.findById(req.getClassRoomId())
                .orElseThrow(() -> new IllegalArgumentException("ClassRoom not found"));

        Child child = Child.builder()
                .childName(req.getChildName())
                .birthDt(req.getBirthDt())
                .gender(req.getGender())
                .contact(req.getContact())
                .classRoom(classroom)
                .build();
        childRepository.save(child);

        childNoteRepository.save(ChildNote.builder()
                .childId(child.getId())
                .childName(child.getChildName())
                .note("")
                .build());

        return MessageOnlyResponse.builder()
                .message("Child created")
                .build();
    }

    @Transactional
    public MessageOnlyResponse updateChild(UpdateChildRequest req) {
        ClassRoom classroom = classroomRepository.findById(req.getClassRoomId())
                .orElseThrow(() -> new IllegalArgumentException("ClassRoom not found"));

        Child child = childRepository.findById(req.getChildId())
                .orElseThrow(() -> new IllegalArgumentException("Child not found"));

        child.setClassRoom(classroom);
        child.setContact(req.getContact());

        upsertChildNote(child, req.getNoteText());

        return MessageOnlyResponse.builder()
                .message("Child updated")
                .build();
    }

    public GetChildResponse getChildList() {
        User user = userService.getUser();
        List<ChildInfo> list;

        if (user.getRole() == Role.TEACHER) {
            list = childRepository.findAllWithParents()
                    .stream()
                    .map(this::mapToChildInfo)
                    .toList();

        } else if (user.getRole() == Role.PARENT) {
            List<Integer> childIds = parentChildRepository.findByUserId(user.getId()).stream()
                    .map(pc -> pc.getId().getChildId())
                    .toList();

            list = childRepository.findAllByIdWithParents(childIds)
                    .stream()
                    .map(this::mapToChildInfo)
                    .toList();
        } else {
            throw new AccessDeniedException("User role is not valid");
        }

        return GetChildResponse.builder()
                .childList(list)
                .build();
    }

    public ChildInfo getChildDetail(GetChildDetailRequest req) {
        User user = userService.getUser();
        int childId = req.getChildId();

        if (user.getRole() == Role.PARENT) {
            boolean ok = parentChildRepository
                    .existsByIdUserIdAndIdChildId(user.getId(), childId);
            if (!ok) {
                throw new AccessDeniedException("No permission");
            }
        } else if (user.getRole() != Role.TEACHER) {
            throw new AccessDeniedException("User role is not valid");
        }

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new IllegalArgumentException("Child not found"));

        String note = childNoteRepository.findByChildId(childId)
                .map(ChildNote::getNote)
                .orElse("");

        return mapToChildInfo(child).toBuilder()
                .noteText(note)
                .build();
    }

    public MessageOnlyResponse updateParentChild(UpdateParentChildRequest updateParentChildRequest){
        int parentId = updateParentChildRequest.getParentId();
        int childId = updateParentChildRequest.getChildId();

        User parent = userRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent not found"));

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new IllegalArgumentException("Child not found"));

        ParentChildId parentChildId = new ParentChildId(parentId,childId);
        if (parentChildRepository.existsById(parentChildId)) {
            return MessageOnlyResponse.builder()
                    .message("This child is already assigned to the parent.")
                    .build();
        }

        ParentChild parentChild = ParentChild.builder()
                .id(parentChildId)
                .user(parent)
                .child(child)
                .build();

        parentChildRepository.save(parentChild);

        return MessageOnlyResponse.builder()
                .message("Parent-Child relationship created successfully.")
                .build();
    }

    private ChildInfo mapToChildInfo(Child child) {
        List<ParentInfo> parents = child.getParentChildren()
                .stream()
                .map(pc -> ParentInfo.builder()
                        .parentId(pc.getUser().getId())
                        .parentName(pc.getUser().getName())
                        .parentContact(pc.getUser().getContact())
                        .build())
                .toList();
        String childNote = childNoteRepository.findByChildId(child.getId()).map(ChildNote::getNote).orElse("");

        return ChildInfo.builder()
                .childId(child.getId())
                .classRoomName(child.getClassRoom().getClassName())
                .childName(child.getChildName())
                .gender(child.getGender())
                .contact(child.getContact())
                .birthDt(child.getBirthDt())
                .noteText(childNote)
                .parentList(parents)
                .build();
    }

    private void upsertChildNote(Child child, String noteText) {
        ChildNote doc = childNoteRepository.findByChildId(child.getId())
                .map(existing -> existing.toBuilder()
                        .childName(child.getChildName())
                        .note(noteText)
                        .build()
                )
                .orElseGet(() -> ChildNote.builder()
                        .childId(child.getId())
                        .childName(child.getChildName())
                        .note(noteText)
                        .build()
                );
        childNoteRepository.save(doc);
    }
}

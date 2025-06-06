package com.jdk.domain.album.service;

import com.jdk.domain.album.dto.request.CreateAlbumRequest;
import com.jdk.domain.album.dto.request.GetChildAlbumItemsRequest;
import com.jdk.domain.album.dto.response.*;
import com.jdk.domain.album.entity.Album;
import com.jdk.domain.album.entity.AlbumFile;
import com.jdk.domain.album.entity.AlbumType;
import com.jdk.domain.album.repository.AlbumFileRepository;
import com.jdk.domain.album.repository.AlbumRepository;
import com.jdk.domain.child.entity.Child;
import com.jdk.domain.child.entity.ParentChild;
import com.jdk.domain.child.repository.ChildRepository;
import com.jdk.domain.child.repository.ParentChildRepository;
import com.jdk.domain.classroom.entity.ClassRoom;
import com.jdk.domain.classroom.repository.ClassroomRepository;
import com.jdk.domain.file.entity.File;
import com.jdk.domain.file.repository.FileRepository;
import com.jdk.domain.user.entity.Role;
import com.jdk.domain.user.entity.User;
import com.jdk.domain.user.service.UserService;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.TreeMap;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final FileRepository fileRepository;
    private final ChildRepository childRepository;
    private final ClassroomRepository classroomRepository;
    private final AlbumFileRepository albumFileRepository;
    private final UserService userService;
    private final ParentChildRepository parentChildRepository;

    @Transactional
    public MessageOnlyResponse createAlbum(CreateAlbumRequest req) {
        File file = fileRepository.findById(req.getFileId())
                .orElseThrow(() -> new IllegalArgumentException("wrong fileId"));

        LocalDate today = LocalDate.now();

        if (AlbumType.PERSONAL.name().equals(req.getType())) {

            for (String childName : req.getTargetName()) {
                Child child = childRepository.findByChildName(childName)
                        .orElseThrow(() -> new IllegalArgumentException("wrong childName: " + childName));

                Album album = albumRepository
                        .findByTypeAndChild_IdAndCreateAt(AlbumType.PERSONAL, child.getId(), today)
                        .orElseGet(() -> albumRepository.save(
                                Album.builder()
                                        .child(child)
                                        .classroom(child.getClassRoom())
                                        .type(AlbumType.PERSONAL)
                                        .title(child.getChildName() + " " + today)
                                        .createAt(today)
                                        .build()));

                if (!albumFileRepository.existsByAlbum_IdAndFile_Id(album.getId(), file.getId())) {
                    albumFileRepository.save(
                            AlbumFile.builder()
                                    .album(album)
                                    .file(file)
                                    .build());
                }
            }

        } else if (AlbumType.CLASS.name().equals(req.getType())) {

            for (String className : req.getTargetName()) {
                ClassRoom classroom = classroomRepository.findByClassName(className)
                        .orElseThrow(() -> new IllegalArgumentException("wrong classRoomId: " + className));

                Album album = albumRepository
                        .findByTypeAndClassroomIdAndCreateAt(AlbumType.CLASS, classroom.getId(), today)
                        .orElseGet(() -> albumRepository.save(
                                Album.builder()
                                        .classroom(classroom)
                                        .type(AlbumType.CLASS)
                                        .title(classroom.getClassName() + " " + today)
                                        .createAt(today)
                                        .build()));

                if (!albumFileRepository.existsByAlbum_IdAndFile_Id(album.getId(), file.getId())) {
                    albumFileRepository.save(
                            AlbumFile.builder()
                                    .album(album)
                                    .file(file)
                                    .build());
                }
            }

        } else {
            throw new IllegalArgumentException("wrong type");
        }

        return MessageOnlyResponse.builder()
                .message("album created / appended successfully")
                .build();
    }

    @Transactional(readOnly = true)
    public GetAlbumCoverListResponse getAlbumCoverList(){
        User user = userService.getUser();

        List<AlbumCover> classCoverList;
        List<AlbumCover> childCoverList;
        if(Role.PARENT.equals(user.getRole())){
            List<Child> children = parentChildRepository.findByUserId(user.getId()).stream()
                    .map(pc -> childRepository.findById(pc.getId().getChildId())
                            .orElseThrow(() -> new IllegalStateException("child not found")))
                    .toList();

            childCoverList = children.stream()
                    .map(child -> AlbumCover.builder()
                            .childId(child.getId())
                            .title(child.getChildName())
                            .className(child.getClassRoom().getClassName())
                            .thumbnail(child.getProfilePath())
                            .build())
                    .toList();

            classCoverList = children.stream()
                    .map(Child::getClassRoom)
                    .collect(Collectors.toMap(
                            ClassRoom::getId,
                            cr -> cr,
                            (a, b) -> a
                    ))
                    .values()
                    .stream()
                    .map(cr -> AlbumCover.builder()
                            .className(cr.getClassName())
                            .title(cr.getClassName() + " 활동사진")
                            .thumbnail("test-class")
                            .build())
                    .toList();

        } else if(Role.TEACHER.equals(user.getRole())){
            childCoverList = childRepository.findAll().stream()
                    .map(child ->
                            AlbumCover.builder()
                                    .childId(child.getId())
                                    .title(child.getChildName())
                                    .className(child.getClassRoom().getClassName())
                                    .thumbnail(child.getProfilePath())
                                    .build()
                    )
                    .toList();
            
            classCoverList = classroomRepository.findAll().stream()
                    .map(classroom ->
                            AlbumCover.builder()
                                    .thumbnail("tteesstt")
                                    .className(classroom.getClassName())
                                    .title(classroom.getClassName()+" 활동사진")
                                    .build()
                    )
                    .toList();
        }else {
            throw new IllegalArgumentException("no permission");
        }

        return GetAlbumCoverListResponse.builder()
                .childAlbumCoverList(childCoverList)
                .classAlbumCoverList(classCoverList)
                .build();
    }


    public GetAlbumListResponse getAlbumList(){
        User user = userService.getUser();

        List<Album> albumList;
        if(Role.PARENT.equals(user.getRole())){
            List<Child> children = parentChildRepository.findByUserId(user.getId())
                    .stream()
                    .map(ParentChild::getChild)   // 연관객체 바로 꺼냄
                    .toList();

            albumList = children.isEmpty()
                    ? List.of()
                    : albumRepository.findByChildIn(children);

        }else if(Role.TEACHER.equals(user.getRole())){
            albumList = albumRepository.findAll();
        }else {
            throw new IllegalArgumentException("no permission");
        }

        return GetAlbumListResponse.builder()
                .albumListInfoList(albumList.stream()
                        .map(album -> AlbumListInfo.builder()
                                .albumId(album.getId())
                                .title(album.getTitle())
                                .thumbnail(album.getChild() != null
                                        ? album.getChild().getProfilePath()
                                        : null)
                                .build())
                        .toList())
                .build();
    }

    @Transactional(readOnly = true)
    public GetChildAlbumItemResponse getChildAlbumItems(GetChildAlbumItemsRequest req) {

        /* 1) 아동 확인 */
        Child child = childRepository.findById(req.getChildId())
                .orElseThrow(() -> new IllegalStateException("child not found"));

        List<Album> albums = albumRepository.findAllByChild(child);
        if (albums.isEmpty()) {
            return new GetChildAlbumItemResponse(List.of());
        }

        List<AlbumFile> albumFileList = albumFileRepository.findByAlbumIn(albums);

        Map<LocalDate, List<String>> grouped = albumFileList.stream()
                .map(AlbumFile::getFile)
                .filter(f -> f.getCreateDttm() != null)
                .collect(Collectors.groupingBy(
                        f -> f.getCreateDttm().toLocalDate(),
                        TreeMap::new,
                        Collectors.mapping(File::getFilePath, Collectors.toList())
                ));

        List<ChildAlbumItem> itemList = grouped.entrySet().stream()
                .map(e -> ChildAlbumItem.builder()
                        .uploadDate(e.getKey())
                        .filePath(e.getValue().toArray(new String[0]))
                        .build())
                .toList();

        return GetChildAlbumItemResponse.builder()
                .childAlbumItemList(itemList)
                .build();
    }


}

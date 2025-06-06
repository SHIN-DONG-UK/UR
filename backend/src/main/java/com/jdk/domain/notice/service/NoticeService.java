package com.jdk.domain.notice.service;

import com.jdk.domain.notice.dto.request.CreateNoticeRequest;
import com.jdk.domain.notice.dto.request.DeleteNoticeRequest;
import com.jdk.domain.notice.dto.request.UpdateNoticeRequest;
import com.jdk.domain.notice.dto.response.GetNoticeListResponse;
import com.jdk.domain.notice.dto.response.NoticeInfo;
import com.jdk.domain.notice.entity.Notice;
import com.jdk.domain.notice.repository.NoticeRepository;
import com.jdk.domain.user.entity.Teacher;
import com.jdk.domain.user.entity.User;
import com.jdk.domain.user.repository.TeacherRepository;
import com.jdk.domain.user.service.UserService;
import com.jdk.global.dto.response.MessageOnlyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserService userService;
    private final TeacherRepository teacherRepository;

    @Transactional
    public MessageOnlyResponse createNotice(CreateNoticeRequest createNoticeRequest){
        User user = userService.getUser();
        Teacher teacher = teacherRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("teacher not found"));

        Notice notice = Notice.builder()
                .title(createNoticeRequest.getTitle())
                .noticeBody(createNoticeRequest.getNoticeBody())
                .user(teacher)
                .createDttm(LocalDateTime.now())
                .build();

        noticeRepository.save(notice);

        return MessageOnlyResponse.builder().message("notice created successful").build();
    }

    @Transactional(readOnly = true)
    public GetNoticeListResponse getNoticeList(){
        List<NoticeInfo> noticeList = noticeRepository.findAll().stream().map(
                notice -> NoticeInfo.builder()
                        .noticeId(notice.getId())
                        .title(notice.getTitle())
                        .noticeBody(notice.getNoticeBody())
                        .createDttm(notice.getCreateDttm())
                        .build()
        ).toList();

        return GetNoticeListResponse.builder().noticeList(noticeList).build();
    }

    @Transactional
    public MessageOnlyResponse updateNotice(UpdateNoticeRequest updateNoticeRequest){
        Notice notice = noticeRepository.findById(updateNoticeRequest.getNoticeId()).orElseThrow(() -> new IllegalArgumentException("notice not found"));
        notice.setTitle(updateNoticeRequest.getTitle());
        notice.setNoticeBody(updateNoticeRequest.getNoticeBody());

        return MessageOnlyResponse.builder().message("notice updated successful").build();
    }
    @Transactional
    public MessageOnlyResponse deleteNotice(DeleteNoticeRequest deleteNoticeRequest){
        Notice notice = noticeRepository.findById(deleteNoticeRequest.getNoticeId()).orElseThrow(() -> new IllegalArgumentException("notice not found"));
        noticeRepository.delete(notice);

        return MessageOnlyResponse.builder().message("notice deleted successful").build();
    }

}

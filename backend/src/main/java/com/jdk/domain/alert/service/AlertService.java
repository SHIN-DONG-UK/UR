package com.jdk.domain.alert.service;

import com.google.firebase.messaging.*;
import com.jdk.domain.alert.dto.SendAlertRequest;
import com.jdk.domain.child.entity.Child;
import com.jdk.domain.child.entity.ParentChild;
import com.jdk.domain.child.repository.ChildRepository;
import com.jdk.domain.child.repository.ParentChildRepository;
import com.jdk.domain.user.entity.Teacher;
import com.jdk.domain.user.entity.User;
import com.jdk.domain.user.repository.ParentRepository;
import com.jdk.domain.user.repository.TeacherRepository;
import com.jdk.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;
    private final ParentChildRepository parentChildRepository;
    private final FirebaseMessaging firebaseMessaging;
    private final TeacherRepository teacherRepository;

    public void sendAlert(SendAlertRequest sendAlertRequest) {
        Child child = childRepository.findByChildName(sendAlertRequest.getChildName())
                .orElseThrow(() -> new IllegalArgumentException("Child not found"));

        List<String> tokens = parentChildRepository.findByChild(child).stream()
                .map(ParentChild::getUser)
                .map(User::getFcmToken)
                .filter(Objects::nonNull)
                .toList();

        Teacher teacher = teacherRepository.findByClassRoom(child.getClassRoom());
        String teacherToken = (teacher != null && teacher.getUser() != null)
                ? teacher.getUser().getFcmToken() : null;
        log.info(teacherToken);

        String[] stuffList = sendAlertRequest.getStuffList();
        if (stuffList != null && stuffList.length > 0 && teacherToken != null) {
            String stuffText = String.join(", ", stuffList);

            Notification teacherNotification = Notification.builder()
                    .setTitle(sendAlertRequest.getChildName() + " 에게 누락 물품이 있습니다.")
                    .setBody(stuffText)
                    .build();

            Message teacherMsg = Message.builder()
                    .setToken(teacherToken)
                    .setNotification(teacherNotification)
                    .putData("alertType", "MISSING_ITEM")
                    .putData("childName", sendAlertRequest.getChildName())
                    .putData("missingItems", stuffText)
                    .build();

            try {
                String resp = firebaseMessaging.send(teacherMsg);
                log.info("FCM sent to teacher {} : {}", teacherToken, resp);
            } catch (FirebaseMessagingException e) {
                log.error("Failed FCM for teacher {}: {}", teacherToken, e.getMessage());
            }
        }

        Notification parentNotification = Notification.builder()
                .setTitle("하원 시작!")
                .setBody(sendAlertRequest.getChildName() + " 이/가 하원을 시작했어요")
                .build();

        tokens.forEach(token -> {
            Message msg = Message.builder()
                    .setToken(token)
                    .setNotification(parentNotification)
                    .putData("childName", sendAlertRequest.getChildName())
                    .putData("alertType", "ATTENDANCE_CHANGE")
                    .build();
            try {
                String resp = firebaseMessaging.send(msg);
                log.info("FCM sent to parent {} : {}", token, resp);
            } catch (FirebaseMessagingException e) {
                log.error("Failed FCM for parent {}: {}", token, e.getMessage());
            }
        });
    }


    public void sendAlert(String childName){
        Child child = childRepository.findByChildName(childName)
                .orElseThrow( () -> new IllegalArgumentException("Child not found"));

        List<String> tokens = parentChildRepository.findByChild(child).stream()
                .map(ParentChild::getUser)
                .map(User::getFcmToken)
                .filter(Objects::nonNull)
                .toList();

        Notification notification = Notification.builder()
                .setTitle("등원 완료!")
                .setBody(childName + " 이/가 등원을 완료했어요")
                .build();

        tokens.forEach(token -> {
            Message msg = Message.builder()
                    .setToken(token)
                    .setNotification(notification)
                    .putData("childName", childName)
                    .putData("alertType", "ATTENDANCE_CHANGE")
                    .build();
            try {
                String resp = firebaseMessaging.send(msg);
                log.info("FCM sent to {} : {}", token, resp);
            } catch (FirebaseMessagingException e) {
                log.error("Failed FCM for {}: {}", token, e.getMessage());
            }
        });
    }
}

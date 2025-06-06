package com.jdk.domain.file.service;

import com.jdk.domain.file.dto.request.UploadFilesRequest;
import com.jdk.domain.file.dto.response.UploadFilesResponse;
import com.jdk.domain.file.entity.File;
import com.jdk.domain.file.repository.FileRepository;
import jakarta.annotation.PostConstruct;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;          // = /app/uploads
    private Path rootDir;              // Path 객체 캐싱

    /* ────────────────────────────────────────────────
     * 디렉터리 준비
     * ──────────────────────────────────────────────── */
    @PostConstruct
    void init() throws IOException {
        rootDir = Paths.get(uploadDir);
        Files.createDirectories(rootDir);
    }

    /* ────────────────────────────────────────────────
     * 다중 파일 업로드
     * ──────────────────────────────────────────────── */
    @Transactional
    public UploadFilesResponse uploadFiles(UploadFilesRequest req) {

        List<MultipartFile> files = req.getFiles();
        if (files == null || files.isEmpty()) {
            throw new ValidationException("업로드할 파일이 없습니다.");
        }

        /* 실제 저장 */
        List<File> saved = saveAll(files);

        return UploadFilesResponse.builder()
                .fileIds(  saved.stream().map(File::getId).toList() )
                .filePaths(saved.stream().map(File::getFilePath).toList())
                .build();
    }

    /* ────────────────────────────────────────────────
     * 파일 묶음을 날짜별 폴더에 저장
     * ──────────────────────────────────────────────── */
    private List<File> saveAll(List<MultipartFile> files) {

        LocalDate today = LocalDate.now();
        Path dateDir = rootDir.resolve(Paths.get(
                String.valueOf(today.getYear()),
                String.format("%02d", today.getMonthValue()),
                String.format("%02d", today.getDayOfMonth())));

        try { Files.createDirectories(dateDir); } catch (IOException ignored) {}

        return files.stream()
                .map(f -> persistOne(f, dateDir))
                .toList();
    }

    /* ────────────────────────────────────────────────
     * 단일 파일 저장 + 엔티티 영속
     * ──────────────────────────────────────────────── */
    private File persistOne(MultipartFile mf, Path dateDir) {
        String ext = getExt(mf.getOriginalFilename());
        String uuid = UUID.randomUUID().toString();
        String timeSuffix = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("HHmm"));
        String filename = uuid + "-" + timeSuffix
                + (ext.isEmpty() ? "" : "." + ext);

        Path target = dateDir.resolve(filename);
        try {
            mf.transferTo(target);
        } catch (IOException e) {
            throw new IllegalStateException("파일 저장 실패", e);
        }

        File entity = File.builder()
                .originName(mf.getOriginalFilename())
                .createDttm(LocalDateTime.now())
                .filePath(rootDir.relativize(target).toString())
                .type(mf.getContentType())
                .build();

        return fileRepository.save(entity);
    }

    /* 확장자 추출 */
    private String getExt(String name) {
        if (name == null) return "";
        int idx = name.lastIndexOf('.');
        return idx == -1 ? "" : name.substring(idx + 1);
    }
}

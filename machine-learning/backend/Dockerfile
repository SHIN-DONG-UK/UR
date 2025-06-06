# 1단계: Gradle을 이용해서 Spring Boot 애플리케이션 빌드

# Gradle 8.5 + JDK 17 이미지 사용 (빌드 환경)
FROM gradle:8.5-jdk17 AS build

# 컨테이너 내부 작업 디렉터리 설정
WORKDIR /app

# 빌드에 필요한 파일들을 복사 (gradle 설정, build 스크립트)
COPY build.gradle settings.gradle gradlew gradlew.bat ./

# gradle 폴더 복사 (Wrapper 세팅 포함)
COPY gradle gradle

# ▶ gradlew에 실행 권한 부여 (추가)
RUN chmod +x gradlew

# 소스코드 복사
COPY src src

# Gradle 빌드 실행 (테스트는 생략하고 build만 수행)
RUN ./gradlew build -x test

# ------------------------------------------------------

# 2단계: 실제 실행용 가벼운 이미지 생성

# OpenJDK 17 경량 버전 이미지 사용 (런타임 환경)
FROM openjdk:17-jdk-slim

# 컨테이너 내부 작업 디렉터리 설정
WORKDIR /app

# 1단계(build)에서 생성된 jar 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 8080 포트를 외부에 공개 (Spring Boot 기본 포트)
EXPOSE 8080

# 애플리케이션 실행 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]

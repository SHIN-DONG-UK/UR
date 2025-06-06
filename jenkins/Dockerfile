FROM jenkins/jenkins:lts

USER root

# 1) 필수 패키지 설치
RUN apt-get update \
 && apt-get install -y \
      ca-certificates \
      curl \
      gnupg \
      lsb-release \
 && mkdir -p /etc/apt/keyrings

# 2) Docker 공식 GPG 키 가져오기
RUN curl -fsSL https://download.docker.com/linux/debian/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 3) Docker 공식 저장소 등록
RUN echo \
    "deb [arch=$(dpkg --print-architecture) \
          signed-by=/etc/apt/keyrings/docker.gpg] \
     https://download.docker.com/linux/debian \
     $(lsb_release -cs) stable" \
    > /etc/apt/sources.list.d/docker.list

# 4) docker-ce, docker-cli, compose-plugin 설치
RUN apt-get update \
 && apt-get install -y \
      docker-ce \
      docker-ce-cli \
      docker-compose-plugin \
 && rm -rf /var/lib/apt/lists/*

USER jenkins

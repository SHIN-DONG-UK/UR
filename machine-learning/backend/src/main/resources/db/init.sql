drop schema if exists ur;
create schema ur;

USE ur;

create table class_room
(
    class_room_id   int auto_increment
        primary key,
    class_name varchar(50) not null
);

create table child
(
    child_id   int auto_increment
        primary key,
    class_room_id   int             not null,
    child_name varchar(50)     not null,
    birth_dt   date            not null,
    gender     enum ('M', 'F') not null,
    contact    varchar(11)     null,
    constraint child_ibfk_1
        foreign key (class_room_id) references class_room (class_room_id)
);

create table attendance
(
    attendance_id int auto_increment
        primary key,
    checked_dttm  timestamp default CURRENT_TIMESTAMP not null,
    child_id      int                                 not null,
    constraint attendance_ibfk_1
        foreign key (child_id) references child (child_id)
);

create index child_id
    on attendance (child_id);

create index class_room_id
    on child (class_room_id);

create table file
(
    file_id     int auto_increment
        primary key,
    origin_name varchar(255)                        not null,
    create_dttm timestamp default CURRENT_TIMESTAMP not null,
    file_path   varchar(255)                        not null,
    type        enum ('album', 'notice')            not null
);

create table face_embedding
(
    child_id    int                                 not null,
    file_id     int                                 not null,
    embedding   blob                                not null,
    create_dttm timestamp default CURRENT_TIMESTAMP not null,
    primary key (child_id, file_id),
    constraint face_embedding_ibfk_1
        foreign key (child_id) references child (child_id),
    constraint face_embedding_ibfk_2
        foreign key (file_id) references file (file_id)
);

create index file_id
    on face_embedding (file_id);

create table user
(
    user_id     int auto_increment
        primary key,
    login_id    varchar(60)                         not null,
    password    varchar(60)                         not null,
    name        varchar(50)                         not null,
    contact     varchar(11)                         not null,
    role        varchar(50)                         not null,
    create_dttm timestamp default CURRENT_TIMESTAMP not null,
    delete_dttm timestamp                           null
);

create table parent
(
    user_id   int          not null
        primary key,
    fcm_token varchar(255) null,
    constraint parent_ibfk_1
        foreign key (user_id) references user (user_id)
);

create table parent_child
(
    user_id  int not null,
    child_id int not null,
    primary key (user_id, child_id),
    constraint parent_child_ibfk_1
        foreign key (user_id) references parent (user_id),
    constraint parent_child_ibfk_2
        foreign key (child_id) references child (child_id)
);

create index child_id
    on parent_child (child_id);

create table teacher
(
    user_id  int not null
        primary key,
    class_room_id int not null,
    constraint teacher_ibfk_1
        foreign key (user_id) references user (user_id),
    constraint teacher_ibfk_2
        foreign key (class_room_id) references class_room (class_room_id)
);

create table notice
(
    notice_id   int auto_increment
        primary key,
    user_id     int                                 not null,
    create_dttm timestamp default CURRENT_TIMESTAMP not null,
    constraint notice_ibfk_1
        foreign key (user_id) references teacher (user_id)
);

create index user_id
    on notice (user_id);

create index class_room_id
    on teacher (class_room_id);


-- 创建数据库
CREATE DATABASE IF NOT EXISTS study_room DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE study_room;

-- 用户表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 待办事项表
CREATE TABLE IF NOT EXISTS todo (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    completed TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 自习室表
CREATE TABLE IF NOT EXISTS study_room (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200)
);

-- 专注记录表
CREATE TABLE IF NOT EXISTS focus_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    duration_minutes INT NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES study_room(id)
);

-- 插入默认自习室
INSERT INTO study_room (name, description) VALUES
('高效学习室', '适合深度学习'),
('考研自习室', '考研备考专用'),
('安静读书角', '安静阅读环境'),
('编程工作坊', '代码学习交流');

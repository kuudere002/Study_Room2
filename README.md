# 温暖自习室

一个轻量级的在线自习室 Web 应用，提供待办事项管理和番茄钟专注功能。

## 项目状态

![GitHub repo size](https://img.shields.io/github/repo-size/kuudere002/Study_Room2)
![GitHub last commit](https://img.shields.io/github/last-commit/kuudere002/Study_Room2)

### 已完成功能

- [x] 用户注册/登录
- [x] 待办事项 CRUD
- [x] 番茄钟计时器
- [x] 自习室选择与加入
- [x] 专注记录保存
- [x] 暖色调卡通风格前端界面

### 开发中功能

- [ ] 自习室在线用户实时显示
- [ ] 专注数据统计图表

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Java 17, Spring Boot 4.0.3 |
| 数据库 | MySQL, MyBatis |
| 前端 | Vue 3 (CDN), CSS3 |
| 构建工具 | Maven |

## 项目结构

```
Study_Room2/
├── src/main/java/org/example/study_room2/
│   ├── controller/      # REST API 控制器
│   │   ├── AuthController.java
│   │   ├── TodoController.java
│   │   ├── StudyRoomController.java
│   │   └── FocusController.java
│   ├── service/        # 业务逻辑层
│   ├── mapper/         # MyBatis 数据访问层
│   └── entity/         # 实体类
├── src/main/resources/
│   ├── mapper/         # MyBatis XML 映射文件
│   ├── static/         # 静态资源 (前端页面)
│   ├── application.properties
│   └── schema.sql      # 数据库初始化脚本
└── pom.xml
```

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/kuudere002/Study_Room2.git
cd Study_Room2
```

### 2. 配置数据库

确保 MySQL 已启动，并创建数据库：

```sql
CREATE DATABASE study_room;
```

修改 `src/main/resources/application.properties` 中的数据库配置：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/study_room
spring.datasource.username=root
spring.datasource.password=你的密码
```

### 3. 启动项目

```bash
# 使用 Maven 启动
./mvnw spring-boot:run

# 或在 IDEA 中运行 StudyRoom2Application
```

### 4. 访问应用

打开浏览器访问：http://localhost:8080

## API 接口

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/todo` | GET | 获取用户待办 |
| `/api/todo` | POST | 添加待办 |
| `/api/todo/{id}` | PUT | 更新待办 |
| `/api/todo/{id}` | DELETE | 删除待办 |
| `/api/rooms` | GET | 获取自习室列表 |
| `/api/rooms/{id}/join` | POST | 加入自习室 |
| `/api/focus` | POST | 记录专注完成 |
| `/api/focus/history` | GET | 获取专注历史 |

## 页面预览

### 登录/注册页
- 暖色调渐变背景
- 圆润的卡片设计
- 弹跳装饰图标

### 大厅页
- 6 个主题自习室卡片
- 在线人数显示
- 精美的加入按钮

### 房间页（沉浸式专注）
- 顶部：当前自习室信息
- 中间：大型倒计时圆环
- 右侧：待办事项面板 + 专注统计

## 数据库表

```sql
-- 用户表
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 待办事项表
CREATE TABLE todo (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    completed TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 自习室表
CREATE TABLE study_room (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200)
);

-- 专注记录表
CREATE TABLE focus_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    duration_minutes INT NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 后续计划

1. 添加 WebSocket 实现实时在线用户显示
2. 添加专注数据统计图表
3. 支持自定义自习室
4. 添加学习小组功能

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

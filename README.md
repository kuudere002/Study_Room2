# Focus Room - 在线自习室

一个轻量级的在线自习室 Web 应用，提供待办事项管理和番茄钟专注功能。

## 项目状态

![GitHub repo size](https://img.shields.io/github/repo-size/kuudere002/Study_Room2)
![GitHub last commit](https://img.shields.io/github/last-commit/kuudere002/Study_Room2)

### 已完成功能

- [x] 用户注册/登录
- [x] 游客免登录体验
- [x] 待办事项 CRUD（支持平滑动画过渡）
- [x] 番茄钟计时器（SVG 霓虹进度条）
- [x] 奔跑小企鹅动画（踩在进度条尖端）
- [x] 像素风背景（雪花飘落 + 云层漂浮）
- [x] 高级音效引擎（Web Audio API 合成）
- [x] 自习室选择与加入
- [x] 专注记录保存与统计

### 开发中功能

- [ ] 自习室在线用户实时显示
- [ ] 专注数据统计图表

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Java 17, Spring Boot 4.0.3 |
| 数据库 | MySQL, MyBatis |
| 前端 | Vue 3 (CDN), CSS3, SVG, Web Audio API |
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
│   │   ├── css/style.css    # 像素风样式 + SVG 动画
│   │   ├── js/app.js         # Vue 3 应用 + 音效引擎
│   │   └── index.html        # 单页应用入口
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

## 核心特性

### 🎨 像素风视觉设计

- 复古 8-bit 像素企鹅登录动画
- 像素雪花飘落背景
- 块状云层缓慢漂浮
- 极地冰雪世界主题

### ⏱️ SVG 霓虹番茄钟

- 原生 SVG 进度条，永不变形
- 霓虹渐变光轨（紫 → 粉 → 橙）
- 奔跑小企鹅踩在进度条尖端
- 专注时时间文字呼吸光晕效果

### 🔊 高级音效引擎

纯代码合成的 Web Audio API 音效：

- 气泡音 - 按钮点击反馈
- 星空音 - 任务完成/番茄钟结束（大三和弦琶音）
- 零依赖，无需加载音频文件

### 📝 待办事项

- 支持勾选完成/未完成
- 平滑的增删动画（Vue Transition）
- 游客模式下本地存储

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
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
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES study_room(id)
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

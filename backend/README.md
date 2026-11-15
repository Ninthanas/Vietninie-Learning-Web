# Vietninie 越学越辣 — Backend (Spring Boot)

REST API cho website học tiếng Việt ⇄ tiếng Trung.

**Stack:** Spring Boot 3.3 · Spring Web · Spring Security + JWT (jjwt 0.12) · Spring Data JPA/Hibernate · MySQL · Bean Validation · Lombok (Java 17+).

## Chạy

```bash
# Mặc định: MySQL 127.0.0.1:3306, user root, không mật khẩu (DB `vietninie` tự tạo)
mvn spring-boot:run

# Đổi tài khoản MySQL / secret:
export DB_USERNAME=root
export DB_PASSWORD=mat_khau_mysql        # PowerShell: $env:DB_PASSWORD="..."
# H2 in-memory (không cần MySQL): SPRING_PROFILES_ACTIVE=h2
export JWT_SECRET=chuoi-bi-mat-dai-tren-32-ky-tu
export ADMIN_PASSWORD=doi-mat-khau-admin
mvn spring-boot:run
```

Lần chạy đầu `DataSeeder` nạp dữ liệu từ `src/main/resources/seed/*.json`
(889 từ ZH, 795 từ VI, ngữ pháp, 17 hội thoại, chủ đề, bài test xếp lớp) và tạo tài khoản `admin`.
API chạy ở `http://localhost:8080`; FE (Vite, `http://localhost:5173`) đã được cấu hình CORS và gọi sẵn.

Biến môi trường: xem `.env.example` (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `CORS_ORIGINS`, `PORT`).

## Cấu trúc

```
com.vietninie
├─ config/      SecurityConfig, CorsConfig
├─ controller/  Auth, Vocabulary, AdminVocabulary, Grammar, Conversation, Topic, Specialized, Placement, Lesson, Progress, Health
├─ dto/request  RegisterRequest, LoginRequest, PlacementSubmitRequest, LessonAttemptRequest, SrsRequest, ...
├─ dto/response AuthResponse, VocabularyResponse, GrammarResponse, PlacementResultResponse, ProgressResponse, ...
├─ enums/       Role, Direction, CefrLevel
├─ exception/   GlobalExceptionHandler (mọi lỗi trả {"detail": "..."} cho FE)
├─ model/       User, VocabularyItem, GrammarLesson, Conversation, Topic, PlacementQuestion,
│               UserVocabProgress, QuizResult, LessonAttempt, PlacementResult
├─ repository/  Spring Data JPA repositories
├─ security/    JwtService, JwtAuthenticationFilter, UserPrincipal, entry point / access-denied handlers
├─ service/     interface  +  service/impl/ (cài đặt)
├─ seed/        DataSeeder
└─ util/        JsonUtil, Mappers
```

JSON dùng **snake_case** (`access_token`, `display_name`, `quiz_score`...) để khớp FE.

## API

| Method | Đường dẫn | Quyền |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | public |
| GET | `/api/auth/me` | JWT |
| GET | `/api/vocabulary/{zh\|vi}?topic=&level=&q=` , `/{dir}/{id}` | public |
| GET | `/api/grammar/{zh\|vi}`, `/api/conversations`, `/api/conversations/{slug}`, `/api/topics`, `/api/specialized` | public |
| GET | `/api/placement/questions` | public |
| POST | `/api/placement/submit` | public (có token thì lưu kết quả) |
| POST | `/api/lessons/{lessonId}/attempt` | JWT |
| GET | `/api/progress/summary`, `/api/progress/{dir}` | JWT |
| PUT | `/api/progress/{dir}/learned/{id}`, `/favorite/{id}` (body `{"value":true}`), `/srs/{id}` | JWT |
| POST | `/api/progress/{dir}/sync`, `/api/progress/{dir}/quiz` | JWT |
| DELETE | `/api/progress/{dir}` | JWT |
| POST/PUT/DELETE | `/api/admin/vocabulary/{dir}[/{id}]` | ADMIN |
| GET | `/api/health` | public |

Header xác thực: `Authorization: Bearer <access_token>`.

## Kết nối FE

`frontend/src/services/api.js` mặc định gọi `http://localhost:8080` (đổi bằng `VITE_API_BASE_URL`):
dữ liệu học lấy từ API (lỗi thì dùng JSON đóng gói sẵn), tiến độ (đã học, yêu thích, SRS, quiz) tự đồng bộ khi đã đăng nhập,
và được gộp vào tài khoản ngay sau khi đăng nhập.

## Test

`mvn test` (dùng H2, profile `h2`).

## Tạo user MySQL cho dự án

Chạy trong MySQL (Workbench / Database console của IntelliJ), bằng tài khoản đang đăng nhập được:

```sql
CREATE DATABASE IF NOT EXISTS vietninie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'vietninie'@'localhost' IDENTIFIED BY 'vietninie123';
GRANT ALL PRIVILEGES ON vietninie.* TO 'vietninie'@'localhost';
FLUSH PRIVILEGES;
```

Mặc định backend dùng user `vietninie` / `vietninie123` (đổi bằng `DB_USERNAME`, `DB_PASSWORD`).

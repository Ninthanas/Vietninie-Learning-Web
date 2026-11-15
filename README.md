# Vietninie 越学越辣

Website học tiếng Việt ⇄ tiếng Trung: từ vựng theo chủ đề, ngữ pháp, hội thoại, luyện nghe, quiz, theo dõi tiến độ và trợ lý AI **Ni Ni**.

| Thư mục | Công nghệ | Cổng |
|---|---|---|
| `frontend/` | React + Vite | 5173 |
| `backend/` | Spring Boot 3, JWT, JPA (MySQL hoặc H2) | 8080 |
| `AI-service/` | FastAPI + Gemini | 8000 |

> Frontend chạy được độc lập (chế độ offline: dữ liệu từ vựng nằm sẵn trong app, tiến độ lưu ở trình duyệt). Backend và AI-service là tùy chọn, dùng cho đăng nhập, đồng bộ tiến độ và chat.

## Chạy nhanh

Yêu cầu: Node 18+, Java 17+ và Maven, Python 3.10+ (cho AI-service), MySQL (hoặc dùng H2 không cần cài).

### 1. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # có thể để trống để chạy offline
npm run dev            # http://localhost:5173
```

### 2. Backend
```bash
cd backend
# Windows PowerShell: $env:DB_PASSWORD="..."
export DB_PASSWORD=mat_khau_mysql
export JWT_SECRET=chuoi-bi-mat-dai-tren-32-ky-tu
export ADMIN_PASSWORD=doi-mat-khau-admin
mvn spring-boot:run
# Không có MySQL: mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
Lần chạy đầu sẽ tự nạp dữ liệu mẫu và tạo tài khoản `admin`. Chi tiết: [backend/README.md](backend/README.md).

### 3. AI-service (tùy chọn)
```bash
cd AI-service
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env    # điền GEMINI_API_KEY
python run.py
```
Chi tiết: [AI-service/README.md](AI-service/README.md).

## Đưa web lên GitHub Pages (có chat Ni Ni)

Frontend được build và đăng tự động bằng `.github/workflows/pages.yml` mỗi khi push thay đổi trong `frontend/`.
Trên trang Pages, dữ liệu học và tiến độ lưu ngay trong trình duyệt (không cần máy chủ). Chat Ni Ni đi qua proxy ở `ai-proxy/` (Cloudflare Worker) để **không lộ khóa Gemini**.

1. Repo → Settings → Pages → Source: **GitHub Actions**.
2. Triển khai proxy theo hướng dẫn trong [ai-proxy/README.md](ai-proxy/README.md), rồi tạo biến repo `AI_PROXY_URL` (Settings → Secrets and variables → Actions → Variables).
3. Push lên `main`. Web sẽ có tại `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

Nếu chưa đặt `AI_PROXY_URL`, web vẫn chạy bình thường và nút chat sẽ tự ẩn.

## Bảo mật khi triển khai thật
- **Bắt buộc đổi** `ADMIN_PASSWORD`, `JWT_SECRET`, `DB_PASSWORD` (giá trị mặc định chỉ dành cho máy dev).
- Khi triển khai thật, chạy backend với profile `prod`: `SPRING_PROFILES_ACTIVE=mysql,prod`. Ở chế độ này backend **từ chối khởi động** nếu ba giá trị trên vẫn là mặc định. Ở chế độ dev, backend chỉ ghi cảnh báo vào log.
- Không commit file `.env`. Khóa Gemini chỉ đặt ở AI-service, không đưa vào frontend.
- Mọi biến `VITE_*` bị nhúng vào JavaScript gửi cho trình duyệt. Không đặt token bí mật ở đó (đặc biệt `VITE_TURSO_TOKEN`: chỉ dùng token chỉ-đọc hoặc bỏ trống).
- Đặt `CORS_ORIGINS` đúng tên miền của bạn.

## Giấy phép
MIT — xem [LICENSE](LICENSE).

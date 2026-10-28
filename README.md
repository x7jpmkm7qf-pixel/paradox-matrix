# The Paradox Matrix

Dashboard tương tác giúp chủ doanh nghiệp và solopreneur ra quyết định bằng tư duy xác suất thay vì trực giác. Ứng dụng gồm 3 module độc lập:

| Module | Tên | Giải quyết vấn đề |
| --- | --- | --- |
| 01 | **Bayes & Monty Hall Decision Engine** | Tin nhầm tín hiệu tích cực, đi tiếp dự án chỉ vì tiếc tiền đã chi (bẫy chi phí chìm) |
| 02 | **Simpson's Audit Tool** | Đọc sai số liệu tổng hợp, khi từng phân khúc nói điều ngược lại |
| 03 | **Exponential Content & Habit Simulator** | Bỏ cuộc trong giai đoạn phẳng, ngay trước điểm bùng phát |

Toàn bộ tính toán chạy trên trình duyệt. Không có backend, không có cơ sở dữ liệu, không gửi dữ liệu người dùng đi đâu.

---

## 1. Công nghệ

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3** cho giao diện
- **Recharts 2** cho biểu đồ
- Trang được build tĩnh (static prerender), deploy được lên mọi nền tảng hỗ trợ Next.js hoặc static hosting

## 2. Cấu trúc thư mục

```
paradox-matrix/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout, font, metadata
│   │   ├── page.tsx              # Trang chính (hero + dashboard)
│   │   └── globals.css           # Tailwind + style cho slider
│   ├── components/
│   │   ├── layout/               # Header, ModuleNav (tab), Dashboard (điều phối module)
│   │   ├── ui/                   # Card, Slider, NumberField, Alert, Stat, Segmented, Button, chartTheme
│   │   ├── bayes/                # MODULE 1
│   │   │   ├── BayesEngine.tsx       # Container: giữ state, nối posterior sang phần chi phí chìm
│   │   │   ├── BayesUpdater.tsx      # Nhập prior/độ nhạy/báo động giả, Monte Carlo
│   │   │   ├── SunkCostAnalyzer.tsx  # So sánh giá trị kỳ vọng, cảnh báo bẫy chi phí chìm
│   │   │   └── MontyHallSimulator.tsx
│   │   ├── simpson/              # MODULE 2
│   │   │   ├── SimpsonAudit.tsx      # Container + bộ dữ liệu mẫu
│   │   │   ├── SegmentEditor.tsx     # Bảng nhập liệu phân khúc
│   │   │   ├── CsvImport.tsx         # Dán / tải / xuất CSV
│   │   │   ├── RateComparisonChart.tsx
│   │   │   └── AuditFindings.tsx     # Cảnh báo nghịch lý, phân tích cơ cấu
│   │   └── exponential/          # MODULE 3
│   │       ├── ExponentialSimulator.tsx
│   │       ├── GrowthChart.tsx       # Đường cong mũ vs tuyến tính, điểm bùng phát
│   │       └── GrowthInsights.tsx
│   └── lib/                      # Logic thuần (không phụ thuộc React), dễ test
│       ├── bayes.ts              # Định lý Bayes, tần suất tự nhiên, Monte Carlo, phân tích EV
│       ├── montyHall.ts          # Mô phỏng Monty Hall n cửa
│       ├── simpson.ts            # Phát hiện nghịch lý, chuẩn hóa cơ cấu, parser CSV
│       ├── growth.ts             # y = a^x, tìm điểm bùng phát bằng chia đôi
│       ├── random.ts             # PRNG có seed (mulberry32) để mô phỏng tái lập được
│       ├── format.ts             # Định dạng số kiểu Việt Nam
│       └── modules.ts            # Metadata 3 module
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

Nguyên tắc: **logic tính toán nằm trong `src/lib`**, component chỉ lo hiển thị. Muốn thêm module mới, tạo một thư mục trong `components/`, thêm file logic trong `lib/`, khai báo trong `lib/modules.ts` và render trong `components/layout/Dashboard.tsx`.

## 3. Cài đặt và chạy local

Yêu cầu: **Node.js 18.18 trở lên** (khuyến nghị Node 20 hoặc 22) và npm.

```bash
# 1. Giải nén / clone dự án và vào thư mục
cd paradox-matrix

# 2. Cài thư viện
npm install

# 3. Chạy môi trường phát triển (hot reload)
npm run dev
# Mở http://localhost:3000
```

Các lệnh khác:

```bash
npm run build      # Build bản production (kiểm tra luôn TypeScript)
npm start          # Chạy bản production đã build, cổng 3000
npm run typecheck  # Chỉ kiểm tra kiểu TypeScript
```

Link trực tiếp tới từng module: `http://localhost:3000/#bayes`, `#simpson`, `#exponential`.

> Font Inter và JetBrains Mono được `next/font` tải từ Google Fonts lúc build. Nếu máy build không có Internet, xóa phần import font trong `src/app/layout.tsx`; giao diện sẽ dùng font hệ thống.

## 4. Deploy

### Cách 1: Vercel (khuyến nghị, miễn phí)

1. Đẩy mã nguồn lên một repository GitHub/GitLab.
2. Vào https://vercel.com/new, chọn repository.
3. Vercel tự nhận diện Next.js. Giữ nguyên cấu hình mặc định, bấm **Deploy**.
4. Mỗi lần push lên nhánh chính, Vercel tự deploy lại.

Hoặc dùng CLI:

```bash
npm i -g vercel
vercel          # deploy bản preview
vercel --prod   # deploy production
```

### Cách 2: Netlify

Kết nối repository, Netlify tự cài plugin Next.js. Build command: `npm run build`.

### Cách 3: Static export (GitHub Pages, Cloudflare Pages, S3, hosting thường)

Ứng dụng không dùng API route nên xuất được thành HTML tĩnh. Thêm `output: "export"` vào `next.config.mjs`:

```js
const nextConfig = {
  reactStrictMode: true,
  output: "export",
};
```

Chạy `npm run build`, thư mục `out/` chứa toàn bộ trang web. Tải thư mục này lên bất kỳ static hosting nào. (Với GitHub Pages ở đường dẫn con, thêm `basePath: "/ten-repo"`.)

### Cách 4: VPS / Docker

```bash
npm ci
npm run build
npm start            # hoặc: PORT=8080 npm start
```

Dùng `pm2 start npm --name paradox-matrix -- start` để chạy nền, đặt Nginx làm reverse proxy tới cổng 3000.

Dockerfile tối giản:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 5. Hướng dẫn sử dụng & mô hình toán

### Module 1: Bayes & Monty Hall Decision Engine

**Cập nhật niềm tin (Bayes).** Nhập:
- *Tỷ lệ nền* P(thành công): tỷ lệ thành công trung bình của dự án tương tự.
- *Độ nhạy* P(tín hiệu tốt | thành công).
- *Báo động giả* P(tín hiệu tốt | thất bại).

Xác suất sau bằng chứng:

```
P(TC | tín hiệu) = P(tín hiệu | TC) · P(TC) / [P(tín hiệu | TC) · P(TC) + P(tín hiệu | TB) · P(TB)]
```

Kết quả được diễn giải bằng "tần suất tự nhiên" (trong 1.000 dự án...) và kiểm chứng bằng mô phỏng Monte Carlo (1.000 đến 100.000 dự án).

**Kiểm tra chi phí chìm.** Dùng xác suất vừa tính:
- EV(tiếp tục) = P(TC) × lợi nhuận − chi phí cần thêm
- EV(dừng) = giá trị phương án thay thế tốt nhất (chi phí cơ hội)
- Góc nhìn bị chi phí chìm chi phối: EV(dừng) − số tiền đã chi

Nếu EV(tiếp tục) < EV(dừng) nhưng lại > góc nhìn lệch, hệ thống báo **bẫy chi phí chìm**: bạn chỉ muốn đi tiếp vì tiếc tiền đã bỏ ra.

**Monty Hall.** Mô phỏng n cửa: giữ nguyên thắng 1/n, đổi thắng (n−1)/n. Bài học: cập nhật quyết định khi có thông tin mới.

### Module 2: Simpson's Audit Tool

Nhập dữ liệu hai nhóm A/B theo từng phân khúc (số thành công / tổng). Có thể sửa trong bảng, dán CSV hoặc tải file CSV với 5 cột:

```csv
segment,A_success,A_total,B_success,B_total
Khách SME,81,87,234,270
Khách doanh nghiệp lớn,192,263,55,80
```

Hỗ trợ dấu phân cách `,` `;` hoặc tab; dòng tiêu đề được tự bỏ qua. Hệ thống:
- So sánh người thắng ở **từng phân khúc** với người thắng ở **số tổng**.
- **Nghịch lý hoàn toàn**: một nhóm thắng mọi phân khúc nhưng thua ở tổng.
- **Nghịch đảo một phần**: đa số phân khúc hoặc kết quả chuẩn hóa ngược với số tổng.
- **Chuẩn hóa cơ cấu** (direct standardisation): tính lại tỷ lệ của cả hai nhóm trên cùng một cơ cấu phân khúc.
- Chỉ ra phân khúc có tỷ trọng lệch nhiều nhất, thường là biến gây nhiễu.

### Module 3: Exponential Content & Habit Simulator

- Đường lũy kế: `y = y₀ · aˣ`, với `a = 1 + tốc độ tăng trưởng`.
- Kỳ vọng tuyến tính: `y = y₀ + k · x`.
- **Điểm bùng phát** (Tipping Point): lần đầu đường mũ vượt kỳ vọng tuyến tính, tìm bằng phương pháp chia đôi.
- Vùng tô đỏ là **thung lũng thất vọng**: giai đoạn kết quả thực tế thấp hơn kỳ vọng.
- Thanh "Bạn thường bỏ cuộc ở..." cho biết bạn đang dừng trước hay sau điểm bùng phát và bỏ lỡ bao nhiêu.
- Hỗ trợ thang log và kịch bản "tệ đi mỗi kỳ" (`(1 − r)ˣ`).

Ba kịch bản mẫu: kênh nội dung (người theo dõi/tuần), thói quen 1% mỗi ngày, doanh thu định kỳ (MRR/tháng).

## 6. Tùy biến nhanh

- **Màu thương hiệu**: sửa bảng màu `ink` và `accent` trong `tailwind.config.ts`, màu biểu đồ trong `src/components/ui/chartTheme.ts`.
- **Dữ liệu mẫu**: `SIMPSON_PRESETS` trong `src/lib/simpson.ts`, `GROWTH_PRESETS` trong `src/lib/growth.ts`.
- **Giá trị mặc định Module 1**: `DEFAULT_INPUTS` trong `src/components/bayes/BayesEngine.tsx`.

## 7. Giấy phép

Sử dụng tự do cho mục đích cá nhân và thương mại.

## 8. Tài khoản (đăng ký, xác nhận email, đăng nhập)

Bật khi có đủ biến môi trường; thiếu thì web chạy như cũ (Pro và lượt dùng thử lưu trên trình duyệt).

| Biến | Lấy ở đâu |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `POSTGRES_URL` | Vercel → Storage → Supabase (tự điền) |
| `RESEND_API_KEY` | resend.com, sau khi xác minh tên miền gửi thư |
| `MAIL_FROM` (tuỳ chọn) | Mặc định `The Paradox Matrix <no-reply@tamlyhocvn.club>` |

- Email xác nhận (mã 6 số + nút bấm) và đặt lại mật khẩu do app tự gửi qua Resend (mẫu tiếng Việt trong `src/lib/mail.ts`), không cần cấu hình email trong Supabase.
- Bảng `pm_accounts` (lượt dùng thử) và `pm_licenses` (gói đã mua, mỗi mã đơn gắn một tài khoản) tự tạo ở lần gọi đầu (`src/lib/db.ts`).
- Khách xem dữ liệu mẫu không cần đăng nhập; xem kết luận với số liệu riêng hoặc thanh toán thì cần tài khoản.
- Khách cũ có Pro lưu trên trình duyệt: lần đầu đăng nhập, Pro tự chuyển vào tài khoản.

# SEP490 System Tests

Dự án này chứa bộ kiểm thử hệ thống tự động (E2E Tests) sử dụng Playwright cho hệ thống SEP490.

## 🛠 Yêu cầu hệ thống
- Node.js (phiên bản 18+ khuyến nghị)
- Đã cài đặt các thư viện thông qua lệnh `npm install`
- Trình duyệt Playwright đã được cài đặt (`npx playwright install`)

---

## ⚠️ Lưu ý CỰC KỲ QUAN TRỌNG trước khi chạy test

Do các test script sẽ trực tiếp thao tác (thêm, sửa, xoá, phê duyệt) lên dữ liệu và expect những số liệu cụ thể, **database bắt buộc phải được reset về trạng thái chuẩn** trước mỗi lần chạy test.

Trước khi chạy bài test, hãy mở terminal, di chuyển vào thư mục dự án **Backend (`sep490-backend-api`)** và chạy lệnh sau:

```bash
npm run seed
```
*(Lệnh này sẽ xoá trắng dữ liệu hiện tại và tạo lại dữ liệu mẫu với các kịch bản chuẩn).*

---

## 🚀 Hướng dẫn chạy Test

Vì các test có phụ thuộc vào dữ liệu của nhau và làm thay đổi state của database, **bạn phải chạy test một cách tuần tự (1 worker)**. Tuyệt đối không chạy song song nhiều worker vì sẽ gây xung đột dữ liệu dẫn đến fail test.

**1. Chạy toàn bộ các test:**
```bash
npx playwright test --workers=1
```

**2. Chạy một file test cụ thể:**
```bash
npx playwright test tests/F01-auth-profile.spec.ts --workers=1
```

**3. Chạy test và mở giao diện trình duyệt (Headed mode) để quan sát thao tác:**
```bash
npx playwright test --workers=1 --headed
```

**4. Chạy test chỉ trên trình duyệt cụ thể (VD: Chromium):**
```bash
npx playwright test --project=chromium --workers=1
```

**5. Xem báo cáo kết quả (HTML Report) sau khi test chạy xong:**
```bash
npx playwright show-report
```

---

## ⚙️ Cấu hình cơ bản (`playwright.config.ts`)
- Các test chạy chủ yếu trên nền tảng trình duyệt web `chromium`.
- `baseURL` được thiết lập trỏ tới trang web chạy trên môi trường internet (production).
- Khi cần debug, bạn có thể thêm tuỳ chọn `--debug` vào cuối câu lệnh chạy test.

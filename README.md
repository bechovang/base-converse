# Base Converse

**Interactive Base Conversion Tool** built with Next.js and Firebase Studio.

🔗 **Link Web:** [https://base-converse.netlify.app/](https://base-converse.netlify.app/)

---

## 📦 Project Overview

Base Converse là một ứng dụng chuyển đổi cơ số tương tác, cho phép bạn dễ dàng chuyển đổi số giữa các hệ cơ số khác nhau (ví dụ: thập phân ↔ nhị phân, thập lục phân, bát phân…). Ứng dụng cung cấp:

* **Chuyển đổi nhanh**: nhập số, chọn hệ nguồn và hệ đích, nhấn "Chuyển đổi" để xem kết quả.
* **Hoạt ảnh minh hoạ**: mô phỏng từng bước quá trình chuyển đổi để tăng tính trực quan.
* **Chiến lược chuyển đổi**: gợi ý phương pháp tối ưu (ví dụ: chuyển qua nhị phân trước khi sang hệ 16).
* **Giao diện linh hoạt**: hỗ trợ light/dark mode.

## 🚀 Features

* 📊 Chuyển đổi giữa bất kỳ hai hệ cơ số từ 2 đến 36.
* 🎞️ Hoạt ảnh từng bước giải thích quá trình chuyển đổi.
* 💡 Phần ghi chú chiến lược giúp hiểu sâu hơn về thuật toán.
* 🌗 Toggle theme (nhanh chóng chuyển giữa light & dark mode).
* 🔄 Giao diện phản hồi nhanh, mobile-friendly.

## 📂 Project Structure

```
├── docs/                    # Tài liệu và ví dụ về prompt AI (nếu có)
├── src/                     # Mã nguồn Next.js
│   └── app/
│       └── page.tsx         # Entry point hiển thị UI chuyển đổi cơ số
├── public/                  # Tài nguyên tĩnh (favicon, ảnh…)
├── netlify.toml             # Cấu hình build/deploy Netlify
├── next.config.ts           # Cấu hình Next.js
├── package.json             # Dependencies & scripts
├── tailwind.config.ts       # Cấu hình Tailwind CSS
└── tsconfig.json            # Cấu hình TypeScript
```

## 🛠 Getting Started

### Prerequisites

* **Node.js** v16+ hoặc cao hơn
* **npm** hoặc **Yarn**
* **Netlify CLI** (tuỳ chọn, để test local deploy)

### Cài đặt và chạy local

1. Clone repo:

   ```bash
   git clone https://github.com/bechovang/base-converse.git
   cd base-converse
   ```
2. Cài đặt phụ thuộc:

   ```bash
   npm install
   # hoặc yarn install
   ```
3. Chạy development server:

   ```bash
   npm run dev
   # Mở http://localhost:3000 để xem
   ```

### Build & Deploy

1. Xây dựng cho production:

   ```bash
   npm run build
   ```
2. Preview production:

   ```bash
   npm start
   ```
3. Triển khai lên Netlify:

   * Đảm bảo đã push code lên branch `main` trên GitHub
   * Netlify tự động build bằng lệnh `npm run build` và publish thư mục `.next`

## 🤝 Contributing

Rất hoan nghênh mọi đóng góp, issue hoặc feature request:

* Mở issue để báo bug hoặc đề xuất tính năng mới
* Fork repo, commit code và gửi pull request

Vui lòng tuân thủ code style và thêm unit tests khi có thể.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

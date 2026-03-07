# 📘 NoteVui Admin Portal

Giao diện quản trị (Admin Panel) hiện đại và mạnh mẽ dành cho hệ thống **NoteVui** (Nền tảng Ghi chú tích hợp AI). Dự án này cung cấp cho ban quản trị các công cụ để theo dõi số liệu, quản lý người dùng, và xử lý các yêu cầu nâng cấp dịch vụ.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Ant-Design](https://img.shields.io/badge/-AntDesign-%230170FE?style=for-the-badge&logo=ant-design&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

---

## 🌟 Tính năng Nổi bật

- **📊 Dashboard Chuyên sâu:** Thống kê tổng quan trực quan về doanh thu, số lượng người dùng, người dùng Premium đang hoạt động và lượt sử dụng AI thông qua các biểu đồ sinh động (Recharts).
- **👥 Quản lý Người dùng (Users):** Xem, tìm kiếm, chỉnh sửa thông tin người dùng và phân quyền linh hoạt.
- **💳 Quản lý Yêu cầu Đăng ký (Subscriptions):** Xét duyệt hoặc từ chối các yêu cầu nâng cấp gói Premium từ phía người dùng cuối. 
- **🔐 Hệ thống Xác thực An toàn:** Tích hợp JSON Web Token (JWT) để bảo mật các endpoints API.
- **📱 Giao diện Responsive:** Giao diện được tối ưu hoá trên đa nền tảng nhờ công nghệ Tailwind CSS.

## 🛠 Công nghệ Sử dụng (Tech Stack)

Dự án sử dụng các công nghệ hiện đại bậc nhất trong hệ sinh thái Frontend:

- **Core:** [React 19](https://react.dev/) và [Vite 7 (Rolldown)](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Ant Design](https://ant.design/) & [@headlessui/react](https://headlessui.com/)
- **Icons:** [Lucide React](https://lucide.dev/) & Ant Design Icons
- **Data Fetching:** [Axios](https://axios-http.com/) & [TanStack React Query](https://tanstack.com/query)
- **Charts:** [Recharts](https://recharts.org/)
- **Linting & Formatting:** ESLint (v9)

---

## 📋 Yêu cầu Cài đặt (Prerequisites)

Để có thể chạy được dự án môi trường làm việc của bạn cần cài đặt:

- **Node.js**: Phiên bản >= `18.x.x`
- **npm**: Phiên bản >= `9.x.x` (Hoặc có thể sử dụng `yarn`, `pnpm` làm package manager)

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

1. **Clone dự án về máy:**

   ```bash
   git clone <repository-url>
   cd notevui-admin
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**

   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**

   Tạo một file `.env` ở thư mục gốc của dự án (sử dụng mẫu từ `.env.example` nếu có):

   ```env
   VITE_API_BASE_URL=http://localhost:5030/api/v1
   ```

4. **Khởi chạy Development Server:**

   ```bash
   npm run dev
   ```

   _Server sẽ chạy mặc định ở `http://localhost:5173`. Tính năng Hot Module Replacement (HMR) sẽ tự động cập nhật UI mỗi khi bạn thay đổi code._

---

## 📂 Kiến trúc Thư mục

```text
notevui-admin/
├── public/                 # Các tài nguyên dùng chung, hình ảnh, favicon...
├── src/
│   ├── components/         # Các Reusable components (admin, charts, modals, v.v...)
│   ├── layout/             # Component định tuyến Layout (AdminLayout, Sidebar, Header...)
│   ├── pages/              # Các trang giao diện chính (Dashboard, Users, Subscriptions...)
│   ├── services/           # Chứa các file giao tiếp API bằng Axios (api.js, adminService.js)
│   ├── utils/              # Các hàm tiện ích dùng chung
│   ├── App.jsx             # File gốc chứa cấu trúc thẻ Routing
│   └── main.jsx            # Entry point của React App
├── .env                    # Biến môi trường
├── eslint.config.js        # Cấu hình kiểm tra lỗi code ESLint
├── vite.config.js          # Cấu hình build và server Vite
├── tailwind.config.js      # (Tuỳ chọn cấu hình Tailwind)
└── package.json            # Thông tin định nghĩa và tải các modules
```

---

## 💻 Các câu lệnh (Scripts) hữu ích

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy môi trường Dev để viết code với HMR. |
| `npm run build` | Build dự án cho môi trường Production (tạo ra thư mục `/dist`). |
| `npm run preview` | Khởi chạy thử giao diện đã build trong thư mục `/dist` trên Local. |
| `npm run lint` | Quét thư mục và đưa ra các cảnh báo dựa theo chuẩn ESLint đề ra. |

---

## 🤝 Đóng góp (Contributing)

Để giữ cấu trúc dự án đồng nhất, vui lòng tuân thủ các quy tắc sau:
1. Tạo branch theo tên feature: `feature/ten-chuc-nang` hoặc `fix/ten-loi`.
2. Tuân thủ **Clean Code** và Component-based Development.
3. Luôn format code và check qua `npm run lint` trước khi Push (có thể cài plugin Prettier trong VSCode).

## 📄 Giấy phép (License)

Dự án này là sản phẩm nội bộ của hệ thống **NoteVui**. Mọi quyền được bảo lưu.

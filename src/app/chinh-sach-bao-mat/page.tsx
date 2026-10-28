import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Chính sách bảo mật · The Paradox Matrix" };

export default function Privacy() {
  return (
    <LegalPage title="Chính sách bảo mật" updated="28/10/2026">
      <p>
        Chính sách này giải thích dữ liệu nào được xử lý khi bạn dùng The Paradox Matrix, theo Luật Bảo vệ dữ liệu cá nhân 2025 và Nghị định
        356/2025/NĐ-CP.
      </p>
      <h2>1. Số liệu kinh doanh bạn nhập</h2>
      <p>
        Mọi phép tính chạy trên trình duyệt của bạn. Số liệu, file CSV và báo cáo bạn tạo <b>không được gửi về máy chủ</b> và chúng tôi không lưu trữ hay xem được chúng.
      </p>
      <h2>2. Dữ liệu thanh toán</h2>
      <ul>
        <li>Khi bạn chuyển khoản, ngân hàng và cổng đối soát SePay cung cấp cho chúng tôi số tiền, thời gian và nội dung chuyển khoản để xác nhận đơn hàng.</li>
        <li>Tên và số tài khoản người chuyển có thể hiển thị trong sao kê ngân hàng của đơn vị vận hành, được lưu theo quy định kế toán.</li>
        <li>Chúng tôi không thu thập số thẻ, mật khẩu hay mã OTP ngân hàng.</li>
      </ul>
      <h2>3. Tài khoản</h2>
      <p>
        Khi bạn tạo tài khoản, chúng tôi lưu email, mật khẩu đã mã hóa (không ai đọc được, kể cả chúng tôi), gói đã mua và số lượt dùng thử
        đã dùng. Để đếm lượt dùng thử, trình duyệt chỉ gửi một chuỗi mã hóa một chiều của bộ số bạn nhập, không gửi chính các con số. Email
        chỉ dùng để xác nhận tài khoản, đặt lại mật khẩu và gửi thông báo về gói bạn mua. Dữ liệu tài khoản được lưu tại Supabase, email được
        gửi qua Resend.
      </p>
      <h2>4. Dữ liệu lưu trên thiết bị</h2>
      <p>Phiên đăng nhập được lưu bằng cookie trên trình duyệt của bạn. Bạn có thể đăng xuất bất cứ lúc nào ở trang Tài khoản.</p>
      <h2>5. Đo lường quảng cáo</h2>
      <p>
        Trang web dùng Meta Pixel và Conversions API để đo hiệu quả quảng cáo (lượt xem trang, bắt đầu thanh toán, mua hàng). Dữ liệu gửi đi gồm thông tin kỹ thuật như địa chỉ IP, trình duyệt và mã đơn đã mã hóa, không gồm số liệu kinh doanh của bạn. Bạn có thể chặn bằng trình chặn quảng cáo hoặc cài đặt quảng cáo của Facebook.
      </p>
      <h2>6. Quyền của bạn</h2>
      <p>
        Bạn có quyền yêu cầu biết, chỉnh sửa, xóa dữ liệu liên quan đến tài khoản, đơn hàng của mình (kể cả xóa tài khoản) hoặc rút lại sự đồng ý. Gửi yêu cầu qua Zalo {SITE.zaloDisplay} hoặc email {SITE.email}; chúng tôi phản hồi trong 2 ngày làm việc.
      </p>
      <h2>7. Đơn vị kiểm soát dữ liệu</h2>
      <p>{SITE.operator}, vận hành hệ {SITE.brand}.</p>
    </LegalPage>
  );
}

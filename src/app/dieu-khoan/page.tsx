import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Điều khoản sử dụng · The Paradox Matrix" };

export default function Terms() {
  return (
    <LegalPage title="Điều khoản sử dụng" updated="27/10/2026">
      <p>
        The Paradox Matrix (“dịch vụ”) là nền tảng phân tích ra quyết định trực tuyến thuộc hệ {SITE.brand}, do {SITE.operator} vận hành.
        Khi sử dụng dịch vụ, bạn đồng ý với các điều khoản dưới đây.
      </p>
      <h2>1. Dịch vụ</h2>
      <ul>
        <li>Gói Miễn phí: dùng 3 module với dữ liệu nhập tay và dữ liệu mẫu.</li>
        <li>Gói Pro: thêm nhập/xuất CSV, xuất báo cáo PDF và hỗ trợ qua Zalo, theo thời hạn của gói đã mua.</li>
        <li>
          Kết quả do công cụ tính toán chỉ mang tính tham khảo, không phải tư vấn tài chính, đầu tư hay pháp lý. Bạn tự chịu trách nhiệm với
          quyết định của mình.
        </li>
      </ul>
      <h2>2. Giá và thanh toán</h2>
      <ul>
        <li>Giá niêm yết bằng VNĐ tại trang Bảng giá: Pro 6 tháng 699.000đ, Pro năm 1.249.000đ, Sáng lập 1.999.000đ (trọn đời).</li>
        <li>Gói Pro tháng (149.900đ) ngừng bán từ ngày 28/10/2026. Khách đã mua gói này vẫn dùng đủ thời hạn đã trả.</li>
        <li>
          Thanh toán bằng chuyển khoản ngân hàng qua mã VietQR. Gói Pro được kích hoạt tự động khi hệ thống ghi nhận đúng số tiền và nội
          dung chuyển khoản.
        </li>
        <li>Các gói không tự động gia hạn. Khi hết hạn, tài khoản trở về gói Miễn phí.</li>
        <li>Gói Sáng lập có hiệu lực suốt thời gian dịch vụ còn hoạt động.</li>
      </ul>
      <h2>3. Mã kích hoạt</h2>
      <p>
        Mỗi đơn hàng có một mã đơn dùng để kích hoạt Pro trên thiết bị của bạn. Mã dành cho người mua sử dụng; không chia sẻ công khai hoặc
        bán lại. Chúng tôi có thể vô hiệu hóa mã bị lạm dụng.
      </p>
      <h2>4. Sở hữu trí tuệ</h2>
      <p>Giao diện, mã nguồn, nội dung và thương hiệu The Paradox Matrix thuộc về đơn vị vận hành. Số liệu bạn nhập thuộc về bạn.</p>
      <h2>5. Giới hạn trách nhiệm</h2>
      <p>
        Chúng tôi nỗ lực để dịch vụ hoạt động ổn định và tính toán chính xác, nhưng không bảo đảm dịch vụ không bao giờ gián đoạn. Trách
        nhiệm tối đa của chúng tôi không vượt quá số tiền bạn đã trả cho gói đang dùng.
      </p>
      <h2>6. Liên hệ</h2>
      <p>
        Zalo {SITE.zaloDisplay} · Email {SITE.email}. Tranh chấp được ưu tiên giải quyết bằng thương lượng, sau đó theo pháp luật Việt Nam.
      </p>
    </LegalPage>
  );
}

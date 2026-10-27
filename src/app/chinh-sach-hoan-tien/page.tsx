import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Chính sách hoàn tiền · The Paradox Matrix" };

export default function Refund() {
  return (
    <LegalPage title="Chính sách hoàn tiền" updated="27/10/2026">
      <h2>Hoàn tiền 100% trong 7 ngày</h2>
      <p>
        Nếu trong 7 ngày kể từ khi thanh toán, gói Pro không giúp được gì cho bạn, hãy nhắn Zalo {SITE.zaloDisplay} hoặc email {SITE.email} kèm mã
        đơn (dạng PM…). Chúng tôi hoàn lại toàn bộ số tiền vào tài khoản bạn đã chuyển trong tối đa 5 ngày làm việc, không hỏi lý do.
      </p>
      <h2>Chuyển nhầm số tiền hoặc nội dung</h2>
      <ul>
        <li>Chuyển thiếu: Pro chưa được kích hoạt. Liên hệ hỗ trợ để chuyển bù hoặc nhận lại tiền.</li>
        <li>Chuyển thừa hoặc ghi sai nội dung: liên hệ hỗ trợ kèm ảnh biên lai, chúng tôi kích hoạt thủ công hoặc hoàn phần chênh lệch.</li>
      </ul>
      <h2>Sau 7 ngày</h2>
      <p>Gói đã kích hoạt quá 7 ngày không được hoàn tiền, trừ khi dịch vụ ngừng hoạt động do lỗi của chúng tôi. Khi đó phần thời gian chưa dùng được hoàn theo tỷ lệ.</p>
    </LegalPage>
  );
}

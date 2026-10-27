export type ModuleId = "bayes" | "simpson" | "exponential";

export interface ModuleMeta {
  id: ModuleId;
  index: string;
  name: string;
  /** The money trap this tool catches, in the same words as the landing page. */
  tagline: string;
  description: string;
  /** "How to use" in three plain steps, shown above the tool. */
  steps: [string, string, string];
}

export const MODULES: ModuleMeta[] = [
  {
    id: "bayes",
    index: "01",
    name: "Có nên chi tiếp hay dừng?",
    tagline: "Bẫy Tiếc tiền đã chi",
    description:
      "Nhập số tiền đã chi, cần chi thêm và tiền lời nếu thành công. Công cụ cho biết nên chạy tiếp hay dừng, để cảm giác tiếc tiền không quyết thay bạn.",
    steps: [
      "Ở ô Bước 1, kéo 3 thanh để ước lượng cơ hội thành công. Không chắc thì cứ để mặc định.",
      "Ở ô Bước 2, nhập số tiền thật của bạn (triệu đồng): đã chi, cần chi thêm, lời nếu thành công, lời nếu làm việc khác.",
      "Đọc ô màu dưới biểu đồ: xanh là nên chạy tiếp, đỏ hoặc vàng là nên dừng.",
    ],
  },
  {
    id: "simpson",
    index: "02",
    name: "Báo cáo có đang đánh lừa bạn?",
    tagline: "Bẫy Báo cáo đánh lừa",
    description:
      "So 2 đội, 2 kênh hay 2 sản phẩm theo từng nhóm khách. Công cụ chỉ ra khi con số tổng nói ngược với thực tế, trước khi bạn thưởng nhầm người hay cắt nhầm kênh.",
    steps: [
      "Chọn một ví dụ có sẵn ở góc phải (Hai đội sales, Kênh quảng cáo...), hoặc gõ tên 2 thứ bạn đang so.",
      "Mỗi dòng là một nhóm khách. Nhập số đơn chốt được và tổng số khách của từng bên.",
      "Xem ô Kết quả: hiện ô đỏ nghĩa là con số tổng đang đánh lừa bạn, đừng vội quyết theo nó.",
    ],
  },
  {
    id: "exponential",
    index: "03",
    name: "Bỏ hay trụ?",
    tagline: "Bẫy Bỏ cuộc quá sớm",
    description:
      "Nhập con số hiện tại và tốc độ tăng của bạn. Công cụ cho thấy bao giờ kết quả bật lên, để bạn không bỏ cuộc ngay trước lúc đó.",
    steps: [
      "Bấm chọn ví dụ gần với bạn (Kênh nội dung, Thói quen, Doanh thu), rồi nhập con số hiện tại.",
      "Kéo thanh tốc độ tăng mỗi kỳ, và thanh tuần bạn định bỏ cuộc.",
      "Xem ô màu cuối trang: nếu bạn định bỏ trước Điểm bùng phát, bạn đang bỏ quá sớm.",
    ],
  },
];

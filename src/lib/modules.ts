export type ModuleId = "bayes" | "simpson" | "exponential";

export interface ModuleMeta {
  id: ModuleId;
  index: string;
  name: string;
  tagline: string;
  description: string;
}

export const MODULES: ModuleMeta[] = [
  {
    id: "bayes",
    index: "01",
    name: "Bayes & Monty Hall Decision Engine",
    tagline: "Trình giả lập quyết định rủi ro",
    description: "Cập nhật xác suất thành công từ bằng chứng thật, rồi kiểm tra xem bạn có đang đi tiếp chỉ vì tiếc tiền đã chi.",
  },
  {
    id: "simpson",
    index: "02",
    name: "Simpson's Audit Tool",
    tagline: "Bộ lọc dữ liệu chống ảo tưởng",
    description: "Bóc tách dữ liệu theo phân khúc để phát hiện khi con số tổng hợp nói điều ngược lại với sự thật.",
  },
  {
    id: "exponential",
    index: "03",
    name: "Exponential Content & Habit Simulator",
    tagline: "Dự báo điểm bùng phát hành động",
    description: "Trực quan hóa giai đoạn phẳng trước điểm bùng phát, để bạn không bỏ cuộc ngay trước khi kết quả đến.",
  },
];

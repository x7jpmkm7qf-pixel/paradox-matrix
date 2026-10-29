/*
 * Content for "Động cơ Nghịch lý Chiến lược": three audiences, two paradoxes each.
 * Plain words first, the textbook name only as a small tag.
 */

export type WidgetId = "birthday" | "braess" | "monty" | "wason" | "hilbert" | "zeno";

export interface Quiz {
  question: string;
  options: string[];
  answer: number;
  reveal: string;
}

export interface Paradox {
  id: string;
  /** Plain-language headline shown big. */
  title: string;
  /** Textbook name, shown small. */
  name: string;
  hook: string;
  quiz?: Quiz;
  widget: WidgetId;
  caseStudy: { who: string; story: string };
  wrongThinking: { quote: string; why: string };
  solution: { lesson: string; actions: string[] };
  tool?: { href: string; label: string };
}

export interface Track {
  id: string;
  tag: string;
  label: string;
  short: string;
  audience: string[];
  focus: string;
  paradoxes: Paradox[];
}

export const TRACKS: Track[] = [
  {
    id: "tap-hoa",
    tag: "Tầng 01",
    label: "Tạp hóa & làm một mình",
    short: "Tạp hóa & Solo",
    audience: ["Tiểu thương", "Chủ shop nhỏ", "Freelancer", "Làm dịch vụ một mình"],
    focus: "Kéo khách bằng ít tiền nhất, giữ sức cho chính mình, và tránh những cú bẫy tâm lý làm mỏng túi mỗi ngày.",
    paradoxes: [
      {
        id: "ngay-sinh",
        title: "Cộng đồng khách không cần đông, chỉ cần đủ để họ “gặp nhau”",
        name: "Nghịch lý Ngày sinh",
        hook: "Chỉ cần 23 người trong một phòng là đã có hơn 50% khả năng 2 người trùng ngày sinh. 50 người thì gần như chắc chắn.",
        quiz: {
          question: "Nhóm Zalo khách quen của bạn có 50 người. Khả năng ít nhất 2 người trùng ngày sinh là bao nhiêu?",
          options: ["Khoảng 10%", "Khoảng 50%", "Khoảng 97%"],
          answer: 2,
          reveal:
            "97%. Vì cái cần đếm không phải số người, mà là số cặp người: 50 người tạo ra 1.225 cặp, mỗi cặp là một cơ hội trùng. Kết nối giữa khách tăng nhanh hơn số khách rất nhiều.",
        },
        widget: "birthday",
        caseStudy: {
          who: "Chị Hoa, tiệm bánh kem nhà làm, 300 khách cũ, không có tiền chạy quảng cáo.",
          story:
            "Chị nghĩ phải có vài nghìn người theo dõi mới “làm cộng đồng” được, nên chỉ đăng bài bán hàng. Khách mua xong là thôi, không ai giới thiệu ai. Mỗi đơn mới đều phải trả tiền quảng cáo.",
        },
        wrongThinking: {
          quote: "“Shop nhỏ thì làm gì có cộng đồng. Phải đông mới có người nói chuyện với nhau.”",
          why: "Ta đếm theo số người, nên thấy 40 người là ít. Nhưng giữa 40 người có 780 cặp. Điểm chung giữa họ (cùng tháng sinh, cùng phường, cùng trường của con) xuất hiện nhiều hơn ta tưởng rất nhiều. Đó là nguyên liệu miễn phí cho giới thiệu tự nhiên.",
        },
        solution: {
          lesson: "Đừng chờ đông. Chia khách thành những nhóm nhỏ 30 đến 50 người có chung một thứ, rồi tạo dịp để họ phát hiện ra điểm chung đó.",
          actions: [
            "Lập nhóm Zalo theo ngách (mẹ có con cùng tuổi, dân văn phòng cùng tòa), mỗi nhóm 30 đến 50 người.",
            "Mỗi tháng làm một ngày “sinh nhật chung” cho khách sinh trong tháng: một chiếc bánh, một tấm ảnh, ai cũng muốn chia sẻ.",
            "Ưu đãi đôi: khách mang theo một người có chung điểm gì đó (cùng tháng sinh, cùng chỗ làm) thì cả hai cùng được giảm.",
            "Hỏi một câu duy nhất khi chốt đơn: “Anh/chị có quen ai cũng hay đặt bánh không?”, ghi lại để nối các cặp.",
          ],
        },
      },
      {
        id: "o-to-xa-lo",
        title: "Mở thêm kênh bán có thể làm bạn bán ít đi",
        name: "Nghịch lý Ô tô trên xa lộ (Braess)",
        hook: "Các kỹ sư giao thông đã thấy: mở thêm một con đường tắt có thể làm cả thành phố kẹt xe hơn. Khi Seoul phá bỏ một tuyến đường trên cao năm 2005, giao thông khu vực không tệ đi như mọi người lo.",
        quiz: {
          question: "Bạn bán một mình, đang ra 45 đơn/ngày trên Facebook và Zalo. Mở thêm Shopee và TikTok Shop thì sao?",
          options: ["Chắc chắn nhiều đơn hơn", "Có thể ít đơn hơn", "Không đổi"],
          answer: 1,
          reveal:
            "Có thể ít hơn. Kênh nào cũng đổ về một điểm nghẽn duy nhất là chính bạn. Thêm kênh là thêm việc trả lời tin nhắn, đóng gói, xử lý đánh giá. Khi điểm nghẽn quá tải, mọi kênh đều chậm lại cùng lúc.",
        },
        widget: "braess",
        caseStudy: {
          who: "Anh Tùng, bán phụ kiện điện thoại, một mình làm từ nhập hàng đến giao hàng.",
          story:
            "Đang ổn với 40 đơn/ngày, anh mở thêm Shopee, TikTok Shop và một website. Tháng đầu đơn mới về lác đác. Tháng thứ hai: tin nhắn trả lời chậm, gói sai đơn, vài đánh giá 1 sao. Tổng đơn tụt xuống còn 33, và anh làm tới 1 giờ sáng.",
        },
        wrongThinking: {
          quote: "“Có mặt ở càng nhiều nơi càng tốt. Thêm kênh là thêm khách, không mất gì.”",
          why: "Ta nghĩ mỗi kênh là một con đường riêng. Nhưng mọi con đường đều đi qua cùng một cây cầu: thời gian và sức của bạn. Mỗi kênh mới “hút” một phần sức đó, và khi cây cầu kẹt thì kênh cũ đang chạy tốt cũng kẹt theo.",
        },
        solution: {
          lesson: "Trước khi mở đường mới, tìm điểm nghẽn. Một kênh chạy trơn tru luôn ra tiền hơn bốn kênh chạy nửa vời.",
          actions: [
            "Ghi trong 1 tuần: mỗi ngày bạn mất bao nhiêu giờ cho từng kênh, và mỗi kênh mang về bao nhiêu tiền lãi.",
            "Chỉ mở kênh mới khi kênh cũ đã tự chạy được (có mẫu trả lời sẵn, có người phụ, có quy trình đóng gói).",
            "Thử cắt kênh có tiền lãi trên mỗi giờ thấp nhất trong 2 tuần. Xem tổng đơn có giảm thật không.",
            "Nhận việc mới thì bỏ một việc cũ. Danh sách việc chỉ được thêm khi có thứ được gạch đi.",
          ],
        },
      },
    ],
  },
  {
    id: "van-hanh",
    tag: "Tầng 02",
    label: "Quản lý vận hành & đội ngũ",
    short: "Vận hành & Đội ngũ",
    audience: ["Chủ doanh nghiệp vừa và nhỏ", "Trưởng phòng", "Quản lý chuỗi"],
    focus: "Ra quyết định đúng lúc có tin mới, đánh giá người và chiến dịch cho công bằng, để thưởng phạt không phản tác dụng.",
    paradoxes: [
      {
        id: "doi-cua",
        title: "Có tin mới mà vẫn giữ lựa chọn cũ là đang bỏ tiền trên bàn",
        name: "Nghịch lý Monty Hall (Đổi cửa)",
        hook: "Trò chơi 3 cánh cửa: bạn chọn 1, người dẫn chương trình biết đáp án mở 1 cửa trống trong 2 cửa còn lại. Đổi cửa thắng 2/3 số lần. Giữ nguyên chỉ thắng 1/3.",
        quiz: {
          question: "Còn 2 cánh cửa: cửa bạn chọn và cửa còn lại. Đổi hay giữ?",
          options: ["Giữ, vì 50-50", "Đổi, vì cửa kia có 2/3", "Như nhau"],
          answer: 1,
          reveal:
            "Đổi. Lúc chọn, cửa của bạn chỉ có 1/3 cơ hội. Người dẫn biết đáp án và cố tình loại một cửa trống trong phần bạn không chọn. Thông tin đó dồn toàn bộ 2/3 còn lại sang cửa kia.",
        },
        widget: "monty",
        caseStudy: {
          who: "Chị Lan, chủ chuỗi 4 quán cà phê, đang chọn 1 trong 3 mặt bằng cho quán thứ 5.",
          story:
            "Chị nghiêng về mặt bằng A vì thích mặt tiền. Một người môi giới rành khu vực, không có lợi ích gì với A, xem kỹ B và C rồi gạch C vì sắp làm đường chắn lối vào. Chị nghĩ: “Còn A và B, ngang nhau, giữ A cho chắc.” Ba tháng sau, B được thuê bởi một chuỗi trà sữa và đông khách gấp đôi A.",
        },
        wrongThinking: {
          quote: "“Còn hai lựa chọn thì 50-50. Đã chọn rồi thì giữ, đổi giữa chừng là thiếu bản lĩnh.”",
          why: "Ta coi mọi thông tin mới là ngẫu nhiên. Nhưng khi tin mới đến từ người đã sàng lọc những phương án bạn không chọn, phương án sống sót trong nhóm đó được hưởng luôn phần cơ hội của phương án bị loại. Lựa chọn ban đầu của bạn thì không được cập nhật gì cả.",
        },
        solution: {
          lesson:
            "Mỗi khi có dữ liệu mới, hỏi: “Ai lọc thông tin này, và họ lọc trong nhóm nào?” Nếu họ lọc trong nhóm bạn không chọn, hãy nghiêm túc cân nhắc đổi.",
          actions: [
            "Chọn nhà cung cấp, mặt bằng, kịch bản sale: ghi lại lý do chọn ban đầu và cơ hội bạn ước lúc đó.",
            "Khi có người hiểu chuyện loại bớt phương án, tính lại cơ hội cho từng phương án còn lại thay vì mặc định 50-50.",
            "Tách cái tôi khỏi quyết định: đổi vì số liệu là bản lĩnh, giữ vì sĩ diện mới là yếu.",
            "Lưu ý: chỉ áp dụng khi thông tin mới có chủ đích. Nếu phương án bị loại là do may rủi thì không có lợi thế đổi.",
          ],
        },
        tool: { href: "/app#bayes", label: "Chơi thử 1.000 ván đổi cửa trong Công cụ 01" },
      },
      {
        id: "bon-the-bai",
        title: "Muốn biết một cách làm có hiệu quả, hãy đi tìm chỗ nó thất bại",
        name: "Bài toán 4 thẻ bài (Wason)",
        hook: "Trong thí nghiệm gốc, chỉ khoảng 1 trên 10 người trả lời đúng. Hầu hết chỉ đi tìm bằng chứng xác nhận điều mình đã tin, và bỏ qua đúng tấm thẻ có thể chứng minh mình sai.",
        widget: "wason",
        caseStudy: {
          who: "Anh Minh, trưởng phòng kinh doanh 12 người, vừa chi 80 triệu cho khóa đào tạo chốt sale.",
          story:
            "Anh tin: “Ai đi học thì doanh số tăng.” Cuối quý anh mở hồ sơ những người đi học và doanh số tăng, thấy khớp, nên đề xuất chi tiếp 150 triệu. Anh không mở hồ sơ những người có doanh số không tăng. Nếu mở, anh sẽ thấy 4 trong số đó cũng đã đi học.",
        },
        wrongThinking: {
          quote: "“Tôi đã kiểm tra rồi: mấy bạn đi học đều tăng doanh số. Vậy là khóa học hiệu quả.”",
          why: "Não thích tìm ví dụ khớp với niềm tin. Một trăm ví dụ khớp không chứng minh được gì, nhưng chỉ một ví dụ ngược là đủ để biết quy luật sai. Khi đánh giá người hay chiến dịch, ta hay bỏ qua chính những ca có thể bác bỏ mình.",
        },
        solution: {
          lesson: "Với mỗi niềm tin “Nếu làm A thì được B”, đừng chỉ nhìn những ca có A và B. Hãy lật đúng hai chỗ: ca có A, và ca không có B.",
          actions: [
            "Đánh giá khóa học, KOL, chính sách thưởng: mở hồ sơ của những người/chiến dịch có kết quả kém, xem họ có dùng cách đó không.",
            "Họp tổng kết thêm một câu bắt buộc: “Có trường hợp nào làm đúng như vậy mà vẫn thất bại không?”",
            "Giao một người trong nhóm đóng vai phản biện, chỉ có nhiệm vụ tìm ca ngược.",
            "Trước khi tăng ngân sách, viết ra: “Nếu thấy điều gì thì tôi sẽ dừng?” và đi tìm đúng điều đó.",
          ],
        },
      },
    ],
  },
  {
    id: "chien-luoc",
    tag: "Tầng 03",
    label: "Chiến lược & tăng trưởng",
    short: "Chiến lược tầm cao",
    audience: ["Lãnh đạo doanh nghiệp lớn", "Nhà sáng lập", "Giám đốc chiến lược"],
    focus: "Nhìn cả hệ thống: mở rộng mà không vỡ trận, đuổi kịp người dẫn đầu, và chia con đường dài thành những bước đo được.",
    paradoxes: [
      {
        id: "khach-san-vo-cuc",
        title: "Khách sạn kín phòng vẫn nhận thêm khách, nếu có một luật dời phòng",
        name: "Khách sạn vô cực của Hilbert",
        hook: "Một khách sạn có vô số phòng, phòng nào cũng kín. Khách mới đến vẫn có chỗ: chỉ cần mọi người cùng dời sang phòng kế bên. Không ai phải ra đường, không ai phải xây thêm phòng.",
        quiz: {
          question: "Khách sạn vô cực đã kín. Một đoàn khách cũng vô số người tới. Làm sao xếp chỗ?",
          options: ["Không thể, đã kín", "Mỗi khách cũ dời sang phòng số gấp đôi", "Xây thêm một tòa"],
          answer: 1,
          reveal:
            "Khách phòng 1 sang 2, phòng 2 sang 4, phòng 3 sang 6. Mọi phòng số lẻ được trống, đủ chỗ cho cả đoàn. Bí quyết không nằm ở số phòng, mà ở một luật dời chỗ đơn giản mà ai cũng tự làm được.",
        },
        widget: "hilbert",
        caseStudy: {
          who: "Một chuỗi F&B đi từ 8 lên 60 cửa hàng trong 2 năm.",
          story:
            "Mỗi lần mở cửa hàng mới, nhà sáng lập tự tay điều quản lý, tự duyệt từng người. Đến cửa hàng thứ 25, mọi quyết định xếp hàng chờ một người. Cửa hàng mới mở chậm, cửa hàng cũ mất quản lý giỏi, chất lượng tụt cả chuỗi.",
        },
        wrongThinking: {
          quote: "“Muốn mở rộng thì phải thêm người giỏi ở trên, xây thêm tầng quản lý, thêm vốn.”",
          why: "Ta nghĩ sức chứa là con số cố định: kín thì phải xây. Nhưng điều làm khách sạn Hilbert nhận mãi được khách là một luật dời chỗ cục bộ: mỗi người chỉ cần biết bước tiếp theo của mình. Tổ chức vỡ khi mỗi lần mở rộng đều cần người ở đỉnh sắp xếp lại bằng tay.",
        },
        solution: {
          lesson:
            "Thiết kế tổ chức như khách sạn Hilbert: ai cũng có một bước dời chỗ được viết sẵn, để mỗi lần mở rộng thì cả hệ thống tự dịch chuyển, không cần ai ở trên xếp lại.",
          actions: [
            "Mỗi vị trí phải đào tạo sẵn một người kế nhiệm. Mở cửa hàng mới thì phó lên trưởng, trưởng sang mở điểm mới.",
            "Viết “luật dời phòng” thành sổ tay: khi tăng gấp đôi quy mô, mỗi vai trò làm gì, không cần hỏi ai.",
            "Đo tài nguyên lõi không nhân bản được (thời gian nhà sáng lập, đội kiểm soát chất lượng). Mở rộng không được vượt nó.",
            "Nhớ giới hạn: đời thực không vô hạn. Luật dời chỗ giúp dùng hết sức chứa, không tạo ra sức chứa từ con số 0.",
          ],
        },
      },
      {
        id: "achilles-rua",
        title: "Đuổi theo chỗ đối thủ đang đứng thì mãi mãi đi sau",
        name: "Nghịch lý Zeno (Achilles và con rùa)",
        hook: "Achilles chạy nhanh gấp 10 lần rùa nhưng cho rùa đi trước 100 mét. Mỗi khi anh tới chỗ rùa vừa đứng, rùa đã nhích thêm một đoạn. Zeno kết luận anh không bao giờ đuổi kịp. Thực tế anh bắt kịp ở mét thứ 111,1.",
        quiz: {
          question: "Bạn ra tính năng nhanh gấp 1,5 lần đối thủ, họ đang dẫn trước 12 tháng. Bao lâu bạn bắt kịp?",
          options: ["8 tháng", "12 tháng", "24 tháng"],
          answer: 2,
          reveal:
            "24 tháng. Khoảng cách chỉ hẹp lại bằng phần chênh tốc độ (1,5 trừ 1 = 0,5 mỗi tháng), nên cần 12 chia 0,5 = 24 tháng. Nếu tốc độ bằng nhau, bạn không bao giờ bắt kịp, dù cố đến đâu.",
        },
        widget: "zeno",
        caseStudy: {
          who: "Một công ty phần mềm quản lý bán hàng, đứng thứ 3 thị trường.",
          story:
            "Mỗi quý, đội sản phẩm nhìn đối thủ số 1 ra gì thì làm theo. Hai năm liền, mỗi lần làm xong thì đối thủ đã sang bước mới. Chuyển đổi số nội bộ cũng vậy: mỗi giai đoạn làm được một nửa phần còn lại, nên lúc nào cũng thấy “gần xong” mà không bao giờ xong.",
        },
        wrongThinking: {
          quote: "“Cứ làm được những gì đối thủ có là sẽ ngang hàng. Cứ chăm chỉ từng bước là sẽ tới đích.”",
          why: "Đuổi theo vị trí cũ của người dẫn đầu nghĩa là luôn trễ một nhịp. Thứ quyết định bạn có bắt kịp không là chênh lệch tốc độ, không phải sự chăm chỉ. Còn “mỗi lần làm một nửa phần còn lại” thì có vô số bước, không có đích nếu không định nghĩa thế nào là xong.",
        },
        solution: {
          lesson:
            "Nhắm vào chỗ đối thủ sẽ đứng, không phải chỗ họ đang đứng. Và chỉ đua khi bạn có cách tăng tốc độ, không chỉ tăng công sức.",
          actions: [
            "Tính điểm hẹn: khoảng cách hiện tại chia cho chênh lệch tốc độ. Nếu ra con số quá xa, đừng đua trên đường của họ, hãy mở đường khác.",
            "Tìm một thứ làm bạn nhanh hơn hẳn (công nghệ, kênh, mô hình), thay vì sao chép tính năng.",
            "Chia chuyển đổi số thành các bước có kích thước cố định và ngày hoàn thành, không phải “làm tiếp phần còn lại”.",
            "Viết sẵn định nghĩa “xong” cho từng bước: đạt con số nào thì dừng và chuyển sang việc khác.",
          ],
        },
      },
    ],
  },
];

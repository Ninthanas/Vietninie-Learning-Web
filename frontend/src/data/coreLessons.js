// 4-step core lessons (vocab -> sentences -> quiz -> result)
export const CORE_LESSONS_BANK = [
  {
    id: 1, level: 'A1', title_vi: 'Bài 1: Chào hỏi & Làm quen', title_zh: '第1课：日常问候与初次见面',
    vocab: [
      { vi: 'Xin chào', zh: '你好', note: 'Lời chào lịch sự thông dụng nhất' },
      { vi: 'Cảm ơn', zh: '谢谢', note: 'Bày tỏ lòng biết ơn' },
      { vi: 'Rất vui được gặp bạn', zh: '很高兴认识你', note: 'Dùng khi mới làm quen' }
    ],
    sentences: [
      { vi: 'Xin chào, tôi tên là Minh.', zh: '你好，我叫阿明。', note: 'tên là = 名字是/叫' },
      { vi: 'Hôm nay bạn có khỏe không?', zh: '你今天身体好吗？', note: 'có ... không = 吗' }
    ],
    quizzes: [
      { q: "'Xin chào' tương ứng với câu nào?", options: ['你好 (Xin chào)', '再见 (Tạm biệt)', '对不起 (Xin lỗi)'], answer: 0 },
      { q: "Khi muốn nói '很高兴认识你' bằng tiếng Việt, ta nói:", options: ['Hẹn gặp lại', 'Rất vui được gặp bạn', 'Không có gì'], answer: 1 }
    ]
  },
  {
    id: 2, level: 'A1', title_vi: 'Bài 2: Gọi món & Quán Cà phê', title_zh: '第2课：越南咖啡馆与餐厅点餐',
    vocab: [
      { vi: 'Cà phê sữa đá', zh: '越南冰奶咖啡', note: 'Thức uống nổi tiếng nhất Việt Nam' },
      { vi: 'Ít đường', zh: '少糖', note: 'Giảm độ ngọt khi gọi đồ uống' },
      { vi: 'Tính tiền', zh: '买单 / 结账', note: 'Gọi nhân viên thanh toán' }
    ],
    sentences: [
      { vi: 'Cho tôi một ly cà phê sữa đá ít đường.', zh: '请给我一杯少糖的越南冰奶咖啡。', note: 'Cho tôi = 请给我' },
      { vi: 'Em ơi, tính tiền giúp anh nhé!', zh: '服务员，请帮我买单！', note: 'tính tiền = 结账' }
    ],
    quizzes: [
      { q: "'Ít đường' (少糖) có nghĩa là gì?", options: ['Nhiều đá / 多冰', 'Ít đường / 少糖', 'Không sữa / 无奶'], answer: 1 },
      { q: "Khi muốn thanh toán hóa đơn (买单), bạn nói:", options: ['Tính tiền', 'Xin chào', 'Đi thẳng'], answer: 0 }
    ]
  },
  {
    id: 3, level: 'A2', title_vi: 'Bài 3: Mua sắm & Mặc cả giá', title_zh: '第3课：购物询价与砍价技巧',
    vocab: [
      { vi: 'Bao nhiêu tiền', zh: '多少钱', note: 'Cụm từ hỏi giá quan trọng nhất' },
      { vi: 'Đắt quá', zh: '太贵了', note: 'Dùng khi bắt đầu mặc cả' },
      { vi: 'Giảm giá', zh: '打折 / 降价', note: 'Đề nghị mức giá tốt hơn' }
    ],
    sentences: [
      { vi: 'Cái áo này giá bao nhiêu tiền?', zh: '这件衣服多少钱？', note: 'Cái áo này = 这件衣服' },
      { vi: 'Đắt quá, bớt một chút được không?', zh: '太贵了，便宜一点可以吗？', note: 'bớt một chút = 便宜一点' }
    ],
    quizzes: [
      { q: "'Bao nhiêu tiền?' dùng để hỏi thông tin gì?", options: ['Thời gian / 时间', 'Giá tiền / 价格', 'Địa điểm / 地点'], answer: 1 },
      { q: "'Giảm giá' có nghĩa tiếng Trung là:", options: ['打折 / 降价', '开发票', '免运费'], answer: 0 }
    ]
  },
  {
    id: 4, level: 'B1', title_vi: 'Bài 4: Giao thông & Đặt xe Grab', title_zh: '第4课：打车出行与问路导航',
    vocab: [
      { vi: 'Sân bay', zh: '机场', note: 'Điểm đến phổ biến khi đi công tác' },
      { vi: 'Rẽ trái / Rẽ phải', zh: '左转 / 右转', note: 'Chỉ đường cho tài xế' },
      { vi: 'Kẹt xe', zh: '堵车', note: 'Tình trạng giao thông giờ cao điểm' }
    ],
    sentences: [
      { vi: 'Anh chở tôi đến sân bay Tân Sơn Nhất nhé.', zh: '请载我去新山一国际机场。', note: 'chở tôi đến = 载我去' },
      { vi: 'Đi thẳng rồi rẽ phải ở ngã tư phía trước.', zh: '直走然后在前面的十字路口右转。', note: 'ngã tư = 十字路口' }
    ],
    quizzes: [
      { q: "'Rẽ phải' có nghĩa là gì?", options: ['左转 (Rẽ trái)', '右转 (Rẽ phải)', '直走 (Đi thẳng)'], answer: 1 },
      { q: "'Kẹt xe' nghĩa là:", options: ['堵车 (Tắc đường)', '迷路 (Lạc đường)', '超速 (Quá tốc độ)'], answer: 0 }
    ]
  },
  {
    id: 5, level: 'B2', title_vi: 'Bài 5: Đàm phán Thương mại & Hợp đồng', title_zh: '第5课：商务洽谈与合同签署',
    vocab: [
      { vi: 'Hợp đồng', zh: '合同 / 合约', note: 'Văn bản pháp lý thương mại' },
      { vi: 'Đối tác', zh: '合作伙伴', note: 'Khách hàng hoặc công ty hợp tác' },
      { vi: 'Thanh toán quốc tế', zh: '国际结算', note: 'Thanh toán xuất nhập khẩu' }
    ],
    sentences: [
      { vi: 'Chúng tôi mong muốn hợp tác lâu dài với quý công ty.', zh: '我们希望能与贵公司建立长期合作。', note: 'hợp tác lâu dài = 长期合作' },
      { vi: 'Hai bên sẽ ký kết hợp đồng vào sáng ngày mai.', zh: '双方将于明天上午正式签署合同。', note: 'ký kết = 签署' }
    ],
    quizzes: [
      { q: "'Đối tác' (合作伙伴) dùng trong ngữ cảnh nào?", options: ['Hợp tác kinh doanh / 商务合作', 'Khám bệnh / 医院看病', 'Gọi đồ ăn / 点外卖'], answer: 0 },
      { q: "'Ký kết hợp đồng' nghĩa là:", options: ['取消合同', '签署合同', '修改合同'], answer: 1 }
    ]
  }
];

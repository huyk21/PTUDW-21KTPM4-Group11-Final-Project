import MailService from "nodemailer"
import nodemailer from "nodemailer"

MailService.sendReportSolution = async (userEmail, report) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chattingapplication21ktpm4@gmail.com",
      pass: "ehdd vajo acyl npos",
    },
  });

  const mailOptions = {
    from: "chattingapplication21ktpm4@gmail.com",
    to: userEmail,
    subject: `Về việc cập nhật tình hình xử lý cho bảng quảng cáo ở ${report.location}`,
    text: `
    Kính gửi bạn ${report.reporter},
    
    Chúng tôi liên hệ với bạn qua email mà bạn đã cung cấp cho chúng tôi.

    Chúng tôi đã nhận được báo cáo của bạn về địa điểm ${report.location}
    Và chúng tôi đã có những bước để xử lý vấn đề đó, nay chúng tôi muốn cập nhật đến với bạn những điều về báo cáo của bạn như sau:

    TÌNH TRẠNG: ${report.solution.status}
    CÁCH THỨC XỬ LÝ: ${report.solution.method}
    
    Một lần nữa, chúng tôi xin chân thành cảm ơn bạn đã có những đóng góp để giúp chúng tôi tối ưu trải nghiệm quảng cáo ở Thành phố Hồ Chí Minh
    
    Chúc bạn nhiều sức khỏe,
    Chân thành,
    Sở Văn hóa - Thể thao Thành phố Hồ Chí Minh`,
  };

  return transporter.sendMail(mailOptions);
};

export default MailService;

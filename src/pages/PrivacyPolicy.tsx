import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Shield, Mail } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-gradient">Chính Sách Bảo Mật</h1>
          </div>
          <p className="text-muted-foreground">
            Cập nhật lần cuối: 04 tháng 11, 2024
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-8 pr-4">
            {/* Introduction */}
            <section>
              <h2 className="mb-4">1. Giới thiệu</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chào mừng bạn đến với VivuViet. Chúng tôi cam kết bảo vệ quyền riêng tư và bảo mật thông tin cá nhân của bạn. 
                Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi 
                sử dụng nền tảng VivuViet.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản trong chính sách bảo mật này.
              </p>
            </section>

            {/* Information Collection */}
            <section>
              <h2 className="mb-4">2. Thông tin chúng tôi thu thập</h2>
              
              <h3 className="mb-3 text-primary">2.1. Thông tin cá nhân</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Khi bạn đăng ký tài khoản, chúng tôi thu thập:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Họ và tên</li>
                <li>Địa chỉ email</li>
                <li>Số điện thoại</li>
                <li>Ngày sinh (để xác minh độ tuổi)</li>
                <li>Ảnh đại diện (tùy chọn)</li>
              </ul>

              <h3 className="mb-3 text-primary mt-6">2.2. Thông tin đặt chỗ</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Khi bạn thực hiện đặt chỗ, chúng tôi thu thập:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Thông tin về địa điểm đặt chỗ</li>
                <li>Ngày giờ đặt chỗ</li>
                <li>Số lượng khách</li>
                <li>Yêu cầu đặc biệt</li>
                <li>Lịch sử giao dịch</li>
              </ul>

              <h3 className="mb-3 text-primary mt-6">2.3. Thông tin sở thích</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Để cung cấp trải nghiệm cá nhân hóa:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Sở thích du lịch (bãi biển, núi, ẩm thực...)</li>
                <li>Lịch sử tìm kiếm và duyệt web</li>
                <li>Đánh giá và phản hồi</li>
                <li>Tương tác với nền tảng</li>
              </ul>

              <h3 className="mb-3 text-primary mt-6">2.4. Thông tin kỹ thuật</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi tự động thu thập:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Địa chỉ IP</li>
                <li>Loại trình duyệt và thiết bị</li>
                <li>Hệ điều hành</li>
                <li>Cookies và dữ liệu tương tự</li>
                <li>Thời gian truy cập và trang đã xem</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Cung cấp và cải thiện dịch vụ</h3>
                  <p className="text-muted-foreground text-sm">
                    Xử lý đặt chỗ, quản lý tài khoản, cá nhân hóa trải nghiệm dựa trên sở thích của bạn.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Giao tiếp</h3>
                  <p className="text-muted-foreground text-sm">
                    Gửi xác nhận đặt chỗ, thông báo quan trọng, cập nhật dịch vụ, và phản hồi yêu cầu hỗ trợ.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Bảo mật</h3>
                  <p className="text-muted-foreground text-sm">
                    Phát hiện và ngăn chặn gian lận, đảm bảo an toàn cho nền tảng và người dùng.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Phân tích</h3>
                  <p className="text-muted-foreground text-sm">
                    Phân tích xu hướng sử dụng để cải thiện chất lượng dịch vụ và trải nghiệm người dùng.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Marketing</h3>
                  <p className="text-muted-foreground text-sm">
                    Gửi thông tin về ưu đãi, địa điểm mới, và nội dung có liên quan (bạn có thể từ chối nhận).
                  </p>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="mb-4">4. Chia sẻ thông tin</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-3 ml-4">
                <li>
                  <strong className="text-foreground">Với đối tác kinh doanh:</strong> Thông tin đặt chỗ được chia sẻ với 
                  chủ sở hữu địa điểm để xử lý đơn đặt chỗ của bạn.
                </li>
                <li>
                  <strong className="text-foreground">Nhà cung cấp dịch vụ:</strong> Các bên thứ ba hỗ trợ vận hành nền tảng 
                  (thanh toán, lưu trữ dữ liệu, phân tích).
                </li>
                <li>
                  <strong className="text-foreground">Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi pháp luật hoặc cơ quan 
                  có thẩm quyền.
                </li>
                <li>
                  <strong className="text-foreground">Bảo vệ quyền lợi:</strong> Để bảo vệ quyền, tài sản, và an toàn của 
                  VivuViet và người dùng.
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="mb-4">5. Bảo mật dữ liệu</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2 text-sm">🔒 Mã hóa SSL/TLS</h3>
                  <p className="text-muted-foreground text-sm">
                    Tất cả dữ liệu truyền tải được mã hóa.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2 text-sm">🛡️ Bảo mật tài khoản</h3>
                  <p className="text-muted-foreground text-sm">
                    Mật khẩu được hash và không thể đọc.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2 text-sm">🔐 Kiểm soát truy cập</h3>
                  <p className="text-muted-foreground text-sm">
                    Chỉ nhân viên được ủy quyền mới có quyền truy cập.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2 text-sm">📊 Giám sát liên tục</h3>
                  <p className="text-muted-foreground text-sm">
                    Hệ thống phát hiện và phản ứng với mối đe dọa.
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                <em>Lưu ý:</em> Không có hệ thống nào an toàn tuyệt đối 100%. Chúng tôi khuyến khích bạn sử dụng mật khẩu 
                mạnh và không chia sẻ thông tin đăng nhập với người khác.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="mb-4">6. Quyền của bạn</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/50">
                  <span className="text-primary">✓</span>
                  <div>
                    <h3 className="text-foreground mb-1">Quyền truy cập</h3>
                    <p className="text-muted-foreground text-sm">
                      Yêu cầu xem dữ liệu cá nhân mà chúng tôi lưu trữ về bạn.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/50">
                  <span className="text-primary">✓</span>
                  <div>
                    <h3 className="text-foreground mb-1">Quyền chỉnh sửa</h3>
                    <p className="text-muted-foreground text-sm">
                      Cập nhật hoặc sửa đổi thông tin cá nhân không chính xác.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/50">
                  <span className="text-primary">✓</span>
                  <div>
                    <h3 className="text-foreground mb-1">Quyền xóa</h3>
                    <p className="text-muted-foreground text-sm">
                      Yêu cầu xóa dữ liệu cá nhân (tuân theo quy định pháp luật).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/50">
                  <span className="text-primary">✓</span>
                  <div>
                    <h3 className="text-foreground mb-1">Quyền từ chối</h3>
                    <p className="text-muted-foreground text-sm">
                      Từ chối nhận thông tin marketing và quảng cáo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/50">
                  <span className="text-primary">✓</span>
                  <div>
                    <h3 className="text-foreground mb-1">Quyền chuyển dữ liệu</h3>
                    <p className="text-muted-foreground text-sm">
                      Yêu cầu xuất dữ liệu cá nhân ở định dạng có thể đọc được.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Để thực hiện các quyền trên, vui lòng liên hệ với chúng tôi qua email:{' '}
                <a href="mailto:vivuviet@vvv.com.vn" className="text-primary hover:underline">
                  vivuviet@vvv.com.vn
                </a>
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="mb-4">7. Cookies và công nghệ tương tự</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi sử dụng cookies và công nghệ tương tự để:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Ghi nhớ tùy chọn và cài đặt của bạn</li>
                <li>Duy trì phiên đăng nhập</li>
                <li>Phân tích cách sử dụng nền tảng</li>
                <li>Cá nhân hóa nội dung và quảng cáo</li>
                <li>Cải thiện hiệu suất và bảo mật</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Bạn có thể quản lý cookies thông qua cài đặt trình duyệt. Tuy nhiên, việc vô hiệu hóa cookies có thể ảnh 
                hưởng đến chức năng của nền tảng.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="mb-4">8. Quyền riêng tư của trẻ em</h2>
              
              <p className="text-muted-foreground leading-relaxed">
                VivuViet chỉ dành cho người dùng từ 18 tuổi trở lên. Chúng tôi không cố ý thu thập thông tin từ trẻ em dưới 
                18 tuổi. Nếu phát hiện tài khoản thuộc về trẻ em, chúng tôi sẽ xóa ngay lập tức. Nếu bạn là phụ huynh và 
                phát hiện con em mình cung cấp thông tin cho chúng tôi, vui lòng liên hệ để chúng tôi có thể xử lý kịp thời.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="mb-4">9. Lưu trữ dữ liệu</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi lưu trữ dữ liệu cá nhân của bạn trong thời gian cần thiết để:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Cung cấp dịch vụ và hỗ trợ bạn</li>
                <li>Tuân thủ nghĩa vụ pháp lý</li>
                <li>Giải quyết tranh chấp và thực thi thỏa thuận</li>
                <li>Ngăn chặn gian lận và lạm dụng</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Khi tài khoản bị xóa hoặc không còn hoạt động, chúng tôi sẽ xóa hoặc ẩn danh hóa dữ liệu cá nhân của bạn, 
                trừ khi cần giữ lại để tuân thủ pháp luật.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="mb-4">10. Chuyển giao dữ liệu quốc tế</h2>
              
              <p className="text-muted-foreground leading-relaxed">
                Dữ liệu của bạn có thể được lưu trữ và xử lý tại Việt Nam hoặc các quốc gia khác nơi chúng tôi hoặc nhà 
                cung cấp dịch vụ của chúng tôi hoạt động. Chúng tôi đảm bảo rằng dữ liệu của bạn được bảo vệ theo tiêu 
                chuẩn bảo mật tương đương bất kể vị trí lưu trữ.
              </p>
            </section>

            {/* Policy Changes */}
            <section>
              <h2 className="mb-4">11. Thay đổi chính sách</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phản ánh các thay đổi trong:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Hoạt động kinh doanh và dịch vụ của chúng tôi</li>
                <li>Quy định pháp luật về bảo vệ dữ liệu</li>
                <li>Công nghệ và thực tiễn bảo mật</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo nổi bật trên nền tảng. Chúng tôi khuyến 
                khích bạn xem lại chính sách này định kỳ.
              </p>
            </section>

            {/* Contact */}
            <section className="p-6 bg-card rounded-lg border border-primary/20">
              <h2 className="mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Liên hệ với chúng tôi
              </h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc yêu cầu nào về chính sách bảo mật này, vui lòng liên hệ:
              </p>

              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Email:</strong>{' '}
                  <a href="mailto:vivuviet@vvv.com.vn" className="text-primary hover:underline">
                    vivuviet@vvv.com.vn
                  </a>
                </p>
                <p>
                  <strong className="text-foreground">Nền tảng:</strong> VivuViet - Khám phá Việt Nam
                </p>
                <p>
                  <strong className="text-foreground">Địa chỉ:</strong> Việt Nam
                </p>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">Cam kết của chúng tôi:</strong> VivuViet cam kết bảo vệ quyền riêng tư 
                  và dữ liệu cá nhân của bạn. Chúng tôi luôn lắng nghe và phản hồi mọi thắc mắc của bạn trong vòng 48 giờ.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

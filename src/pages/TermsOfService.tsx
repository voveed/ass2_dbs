import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { FileText, Mail, AlertTriangle } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-12 w-12 text-primary" />
            <h1 className="text-gradient">Điều Khoản Sử Dụng</h1>
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
              <h2 className="mb-4">1. Chấp nhận điều khoản</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chào mừng bạn đến với VivuViet! Bằng việc truy cập và sử dụng nền tảng VivuViet, bạn đồng ý tuân thủ và 
                bị ràng buộc bởi các Điều khoản Sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, 
                vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Các điều khoản này áp dụng cho tất cả người dùng của nền tảng, bao gồm du khách, chủ sở hữu địa điểm, và 
                người truy cập.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="mb-4">2. Định nghĩa</h2>
              
              <div className="space-y-3">
                <div className="p-3 bg-card rounded-lg border border-border/50">
                  <p className="text-muted-foreground">
                    <strong className="text-primary">"VivuViet", "chúng tôi", "của chúng tôi"</strong> - Đề cập đến nền 
                    tảng và công ty vận hành VivuViet.
                  </p>
                </div>

                <div className="p-3 bg-card rounded-lg border border-border/50">
                  <p className="text-muted-foreground">
                    <strong className="text-primary">"Người dùng", "bạn", "của bạn"</strong> - Đề cập đến bất kỳ cá nhân 
                    hoặc tổ chức nào sử dụng nền tảng VivuViet.
                  </p>
                </div>

                <div className="p-3 bg-card rounded-lg border border-border/50">
                  <p className="text-muted-foreground">
                    <strong className="text-primary">"Nền tảng", "Dịch vụ"</strong> - Đề cập đến website, ứng dụng, và 
                    tất cả các dịch vụ liên quan của VivuViet.
                  </p>
                </div>

                <div className="p-3 bg-card rounded-lg border border-border/50">
                  <p className="text-muted-foreground">
                    <strong className="text-primary">"Địa điểm"</strong> - Các địa điểm du lịch, nhà hàng, khách sạn, và 
                    dịch vụ khác được liệt kê trên nền tảng.
                  </p>
                </div>

                <div className="p-3 bg-card rounded-lg border border-border/50">
                  <p className="text-muted-foreground">
                    <strong className="text-primary">"Đặt chỗ"</strong> - Đơn đặt chỗ được thực hiện thông qua nền tảng.
                  </p>
                </div>
              </div>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="mb-4">3. Đăng ký tài khoản</h2>
              
              <h3 className="mb-3 text-primary">3.1. Yêu cầu đăng ký</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Để sử dụng một số tính năng của VivuViet, bạn cần tạo tài khoản. Khi đăng ký, bạn đồng ý:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Cung cấp thông tin chính xác, đầy đủ, và cập nhật</li>
                <li>Duy trì và kịp thời cập nhật thông tin tài khoản</li>
                <li>Bảo mật thông tin đăng nhập của bạn</li>
                <li>Thông báo ngay lập tức nếu phát hiện sử dụng trái phép</li>
                <li>Chịu trách nhiệm cho mọi hoạt động dưới tài khoản của bạn</li>
              </ul>

              <h3 className="mb-3 text-primary mt-6">3.2. Độ tuổi</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bạn phải từ 18 tuổi trở lên để đăng ký tài khoản và sử dụng dịch vụ. Bằng việc đăng ký, bạn xác nhận rằng 
                bạn đủ độ tuổi theo quy định.
              </p>

              <h3 className="mb-3 text-primary mt-6">3.3. Quyền từ chối</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi có quyền từ chối đăng ký hoặc hủy tài khoản nếu phát hiện vi phạm điều khoản, hành vi gian lận, 
                hoặc các hoạt động bất hợp pháp.
              </p>
            </section>

            {/* Booking and Reservations */}
            <section>
              <h2 className="mb-4">4. Đặt chỗ và thanh toán</h2>
              
              <h3 className="mb-3 text-primary">4.1. Quy trình đặt chỗ</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Khi thực hiện đặt chỗ:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Bạn gửi yêu cầu đặt chỗ đến chủ sở hữu địa điểm</li>
                <li>Chủ sở hữu có quyền chấp nhận hoặc từ chối yêu cầu</li>
                <li>Đặt chỗ chỉ được xác nhận khi bạn nhận được email xác nhận</li>
                <li>Bạn đồng ý tuân thủ các chính sách của địa điểm</li>
              </ul>

              <h3 className="mb-3 text-primary mt-6">4.2. Chính sách hủy và hoàn tiền</h3>
              <div className="p-4 bg-card rounded-lg border border-border/50">
                <p className="text-muted-foreground mb-3">
                  Mỗi địa điểm có chính sách hủy riêng. Trước khi đặt chỗ, vui lòng đọc kỹ chính sách hủy của địa điểm đó.
                </p>
                <p className="text-muted-foreground mb-2">
                  <strong className="text-foreground">Quy định chung:</strong>
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Hủy trước 48 giờ: Hoàn tiền 100%</li>
                  <li>Hủy trước 24 giờ: Hoàn tiền 50%</li>
                  <li>Hủy trong vòng 24 giờ: Không hoàn tiền</li>
                  <li>Không đến (no-show): Không hoàn tiền</li>
                </ul>
                <p className="text-muted-foreground mt-3 text-sm">
                  <em>Lưu ý: Chính sách cụ thể có thể khác nhau tùy địa điểm.</em>
                </p>
              </div>

              <h3 className="mb-3 text-primary mt-6">4.3. Thanh toán</h3>
              <p className="text-muted-foreground leading-relaxed">
                Thanh toán được xử lý an toàn thông qua các cổng thanh toán được chứng nhận. VivuViet không lưu trữ thông 
                tin thẻ tín dụng/ghi nợ đầy đủ của bạn. Tất cả giao dịch phải tuân thủ pháp luật Việt Nam.
              </p>

              <h3 className="mb-3 text-primary mt-6">4.4. Giá cả và phí</h3>
              <p className="text-muted-foreground leading-relaxed">
                Giá cả hiển thị trên nền tảng đã bao gồm VAT và các loại thuế áp dụng (trừ khi có ghi chú khác). VivuViet 
                có thể thu phí dịch vụ cho một số giao dịch. Phí dịch vụ sẽ được hiển thị rõ ràng trước khi bạn xác nhận 
                đặt chỗ.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="mb-4">5. Quy tắc sử dụng</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Khi sử dụng VivuViet, bạn đồng ý KHÔNG:
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-destructive mb-1">Vi phạm pháp luật</h3>
                    <p className="text-muted-foreground text-sm">
                      Sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp hoặc vi phạm pháp luật Việt Nam.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-destructive mb-1">Gian lận</h3>
                    <p className="text-muted-foreground text-sm">
                      Cung cấp thông tin sai lệch, giả mạo danh tính, hoặc thực hiện gian lận thanh toán.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-destructive mb-1">Spam và lạm dụng</h3>
                    <p className="text-muted-foreground text-sm">
                      Gửi spam, quảng cáo không mong muốn, hoặc lạm dụng hệ thống đánh giá.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-destructive mb-1">Nội dung không phù hợp</h3>
                    <p className="text-muted-foreground text-sm">
                      Đăng tải nội dung vi phạm, xúc phạm, khiêu dâm, hoặc gây thù ghét.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-destructive mb-1">Tấn công hệ thống</h3>
                    <p className="text-muted-foreground text-sm">
                      Can thiệp, phá hoại, hoặc cố gắng truy cập trái phép vào hệ thống.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-destructive mb-1">Vi phạm bản quyền</h3>
                    <p className="text-muted-foreground text-sm">
                      Sao chép, phân phối, hoặc sử dụng nội dung của người khác mà không có sự cho phép.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-destructive">Hậu quả:</strong> Vi phạm các quy tắc trên có thể dẫn đến cảnh cáo, 
                  tạm ngưng, hoặc vô hiệu hóa vĩnh viễn tài khoản của bạn mà không cần thông báo trước. Trong các trường 
                  hợp nghiêm trọng, chúng tôi có thể báo cáo cho cơ quan pháp luật.
                </p>
              </div>
            </section>

            {/* Reviews and Content */}
            <section>
              <h2 className="mb-4">6. Đánh giá và nội dung người dùng</h2>
              
              <h3 className="mb-3 text-primary">6.1. Quyền đăng đánh giá</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Để đảm bảo tính xác thực, bạn chỉ có thể đánh giá địa điểm mà bạn đã:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Có đơn đặt chỗ đã hoàn thành</li>
                <li>Thực sự đã đến và trải nghiệm dịch vụ</li>
                <li>Chưa từng đánh giá địa điểm đó trước đây</li>
              </ul>

              <h3 className="mb-3 text-primary mt-6">6.2. Yêu cầu đánh giá</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Đánh giá của bạn phải:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Dựa trên trải nghiệm thực tế của bạn</li>
                <li>Trung thực, chính xác, và khách quan</li>
                <li>Không chứa ngôn từ xúc phạm hoặc phân biệt đối xử</li>
                <li>Tuân thủ luật pháp và các quy tắc sử dụng</li>
                <li>Không tiết lộ thông tin cá nhân của người khác</li>
              </ul>

              <h3 className="mb-3 text-primary mt-6">6.3. Quyền sở hữu nội dung</h3>
              <p className="text-muted-foreground leading-relaxed">
                Khi đăng tải nội dung (đánh giá, ảnh, bình luận), bạn cấp cho VivuViet quyền sử dụng, hiển thị, phân phối, 
                và sửa đổi nội dung đó trên nền tảng và các kênh marketing của chúng tôi. Bạn vẫn giữ quyền sở hữu nội dung 
                gốc của mình.
              </p>

              <h3 className="mb-3 text-primary mt-6">6.4. Kiểm duyệt nội dung</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi có quyền (nhưng không có nghĩa vụ) xem xét, chỉnh sửa, hoặc xóa bất kỳ nội dung nào vi phạm điều 
                khoản này hoặc gây hại cho nền tảng, người dùng khác, hoặc bên thứ ba.
              </p>
            </section>

            {/* Business Owners */}
            <section>
              <h2 className="mb-4">7. Dành cho chủ sở hữu địa điểm</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nếu bạn là chủ sở hữu địa điểm liệt kê trên VivuViet, bạn đồng ý:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Thông tin chính xác</h3>
                  <p className="text-muted-foreground text-sm">
                    Cung cấp và duy trì thông tin địa điểm chính xác, bao gồm giá cả, tiện nghi, chính sách, và hình ảnh 
                    thực tế.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Phản hồi đặt chỗ</h3>
                  <p className="text-muted-foreground text-sm">
                    Phản hồi yêu cầu đặt chỗ trong vòng 24 giờ và tuân thủ các đơn đặt chỗ đã xác nhận.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Tuân thủ pháp luật</h3>
                  <p className="text-muted-foreground text-sm">
                    Đảm bảo địa điểm của bạn có đầy đủ giấy phép kinh doanh và tuân thủ luật pháp Việt Nam.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Chất lượng dịch vụ</h3>
                  <p className="text-muted-foreground text-sm">
                    Duy trì chất lượng dịch vụ và xử lý khiếu nại của khách hàng một cách chuyên nghiệp.
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <h3 className="text-primary mb-2">Phí dịch vụ</h3>
                  <p className="text-muted-foreground text-sm">
                    Thanh toán phí dịch vụ và hoa hồng theo thỏa thuận với VivuViet.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">Auto-deactivation:</strong> Địa điểm có đánh giá trung bình dưới 2.0 sao 
                  trong 30 ngày liên tiếp sẽ tự động bị ẩn khỏi nền tảng cho đến khi chất lượng được cải thiện.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="mb-4">8. Quyền sở hữu trí tuệ</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                VivuViet và nội dung của nó (bao gồm văn bản, đồ họa, logo, icon, hình ảnh, âm thanh, video, và phần mềm) 
                là tài sản của VivuViet và được bảo vệ bởi luật bản quyền, thương hiệu, và sở hữu trí tuệ Việt Nam và quốc tế.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Bạn KHÔNG được phép:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Sao chép, sửa đổi, hoặc phân phối nội dung của VivuViet</li>
                <li>Sử dụng logo, thương hiệu của VivuViet mà không có sự cho phép</li>
                <li>Dịch ngược, decompile, hoặc disassemble phần mềm</li>
                <li>Tạo các công cụ tự động để truy cập nền tảng (bots, scrapers)</li>
                <li>Sử dụng nội dung cho mục đích thương mại mà không có giấy phép</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Bạn có thể sử dụng nền tảng cho mục đích cá nhân, phi thương mại. Mọi sử dụng khác cần có sự cho phép bằng 
                văn bản từ VivuViet.
              </p>
            </section>

            {/* Liability */}
            <section>
              <h2 className="mb-4">9. Giới hạn trách nhiệm</h2>
              
              <div className="p-4 bg-card rounded-lg border border-primary/20 mb-4">
                <h3 className="text-primary mb-3">9.1. Vai trò của VivuViet</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  VivuViet là nền tảng kết nối giữa khách du lịch và chủ sở hữu địa điểm. Chúng tôi KHÔNG trực tiếp cung cấp 
                  dịch vụ du lịch, nhà hàng, hoặc khách sạn. Chúng tôi không chịu trách nhiệm về:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4 mt-2">
                  <li>Chất lượng dịch vụ tại địa điểm</li>
                  <li>Hành vi của chủ sở hữu địa điểm hoặc khách hàng</li>
                  <li>Tranh chấp giữa người dùng</li>
                  <li>Mất mát, thiệt hại, hoặc thương tích xảy ra tại địa điểm</li>
                  <li>Nội dung do người dùng tạo ra</li>
                </ul>
              </div>

              <div className="p-4 bg-card rounded-lg border border-primary/20 mb-4">
                <h3 className="text-primary mb-3">9.2. Không bảo đảm</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Dịch vụ được cung cấp "nguyên trạng" và "có sẵn". Chúng tôi không bảo đảm rằng:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4 mt-2">
                  <li>Dịch vụ sẽ luôn khả dụng, không bị gián đoạn, hoặc không có lỗi</li>
                  <li>Thông tin trên nền tảng luôn chính xác, đầy đủ, hoặc cập nhật</li>
                  <li>Kết quả sử dụng dịch vụ sẽ đáp ứng kỳ vọng của bạn</li>
                </ul>
              </div>

              <div className="p-4 bg-card rounded-lg border border-primary/20">
                <h3 className="text-primary mb-3">9.3. Giới hạn bồi thường</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Trong mọi trường hợp, VivuViet không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, 
                  hoặc mang tính hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ, ngay cả khi chúng tôi 
                  đã được thông báo về khả năng xảy ra thiệt hại đó.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="mb-4">10. Bồi thường</h2>
              
              <p className="text-muted-foreground leading-relaxed">
                Bạn đồng ý bồi thường, bảo vệ, và giữ cho VivuViet, các giám đốc, nhân viên, đại lý, và đối tác của chúng tôi 
                không bị tổn hại khỏi bất kỳ khiếu nại, thiệt hại, nghĩa vụ, tổn thất, trách nhiệm pháp lý, chi phí, hoặc khoản 
                nợ, và phí tổn (bao gồm phí luật sư) phát sinh từ:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Vi phạm Điều khoản Sử dụng này</li>
                <li>Vi phạm bất kỳ quyền nào của bên thứ ba</li>
                <li>Vi phạm pháp luật hoặc quy định hiện hành</li>
                <li>Nội dung bạn đăng tải hoặc truyền tải qua nền tảng</li>
                <li>Hành vi gian lận hoặc lạm dụng dịch vụ</li>
              </ul>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="mb-4">11. Giải quyết tranh chấp</h2>
              
              <h3 className="mb-3 text-primary">11.1. Thương lượng</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Trong trường hợp có tranh chấp, chúng tôi khuyến khích các bên cố gắng giải quyết thông qua thương lượng trực 
                tiếp và thiện chí. Vui lòng liên hệ với chúng tôi để được hỗ trợ trung gian.
              </p>

              <h3 className="mb-3 text-primary">11.2. Luật áp dụng</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Điều khoản Sử dụng này được điều chỉnh và giải thích theo luật pháp Việt Nam.
              </p>

              <h3 className="mb-3 text-primary">11.3. Thẩm quyền tòa án</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nếu tranh chấp không thể giải quyết thông qua thương lượng, các bên đồng ý rằng tòa án có thẩm quyền tại Việt Nam 
                sẽ có quyền tài phán độc quyền để giải quyết tranh chấp.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="mb-4">12. Chấm dứt</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bạn có thể chấm dứt tài khoản bất kỳ lúc nào bằng cách liên hệ với chúng tôi hoặc xóa tài khoản trong cài đặt.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn và quyền truy cập vào dịch vụ, ngay lập tức và 
                không cần thông báo trước, nếu:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Bạn vi phạm Điều khoản Sử dụng này</li>
                <li>Bạn cung cấp thông tin sai lệch hoặc gian lận</li>
                <li>Có yêu cầu từ cơ quan pháp luật hoặc chính phủ</li>
                <li>Tài khoản của bạn không hoạt động trong thời gian dài</li>
                <li>Chúng tôi ngừng cung cấp dịch vụ</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Khi tài khoản bị chấm dứt, quyền sử dụng dịch vụ của bạn sẽ ngay lập tức chấm dứt. Các điều khoản vẫn có hiệu 
                lực sau khi chấm dứt bao gồm quyền sở hữu trí tuệ, giới hạn trách nhiệm, và bồi thường.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="mb-4">13. Thay đổi điều khoản</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi có quyền sửa đổi Điều khoản Sử dụng này bất kỳ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng tải 
                trên nền tảng, trừ khi có quy định khác.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi sẽ thông báo cho bạn về các thay đổi quan trọng thông qua:
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Email thông báo</li>
                <li>Thông báo nổi bật trên nền tảng</li>
                <li>Yêu cầu chấp nhận điều khoản mới khi đăng nhập</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận Điều khoản Sử dụng mới. 
                Nếu không đồng ý với thay đổi, vui lòng ngừng sử dụng dịch vụ và xóa tài khoản của bạn.
              </p>
            </section>

            {/* Miscellaneous */}
            <section>
              <h2 className="mb-4">14. Điều khoản khác</h2>
              
              <h3 className="mb-3 text-primary">14.1. Toàn bộ thỏa thuận</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Điều khoản Sử dụng này, cùng với Chính sách Bảo mật, tạo thành toàn bộ thỏa thuận giữa bạn và VivuViet và thay 
                thế tất cả các thỏa thuận trước đó.
              </p>

              <h3 className="mb-3 text-primary">14.2. Tính độc lập</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nếu bất kỳ điều khoản nào trong thỏa thuận này bị coi là không hợp lệ hoặc không thể thực thi, các điều khoản 
                còn lại vẫn có hiệu lực đầy đủ.
              </p>

              <h3 className="mb-3 text-primary">14.3. Từ bỏ quyền</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Việc chúng tôi không thực thi bất kỳ quyền hoặc điều khoản nào không được coi là từ bỏ quyền hoặc điều khoản đó.
              </p>

              <h3 className="mb-3 text-primary">14.4. Chuyển nhượng</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bạn không được chuyển nhượng hoặc ủy quyền quyền và nghĩa vụ của mình theo Điều khoản Sử dụng này mà không có 
                sự đồng ý bằng văn bản từ VivuViet. Chúng tôi có thể chuyển nhượng quyền của mình cho bất kỳ bên liên kết, công 
                ty con, hoặc người kế nhiệm trong kinh doanh.
              </p>
            </section>

            {/* Contact */}
            <section className="p-6 bg-card rounded-lg border border-primary/20">
              <h2 className="mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Liên hệ với chúng tôi
              </h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Điều khoản Sử dụng này, vui lòng liên hệ:
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
                  <strong className="text-primary">Thời gian phản hồi:</strong> Chúng tôi cam kết phản hồi mọi yêu cầu và thắc 
                  mắc trong vòng 48 giờ làm việc.
                </p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="p-6 bg-primary/10 rounded-lg border border-primary/20">
              <h2 className="mb-4">Xác nhận chấp nhận</h2>
              
              <p className="text-muted-foreground leading-relaxed">
                Bằng việc sử dụng VivuViet, bạn xác nhận rằng bạn đã đọc, hiểu, và đồng ý bị ràng buộc bởi Điều khoản Sử dụng này. 
                Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>

              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong className="text-foreground">Ngày có hiệu lực:</strong> 04 tháng 11, 2024
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

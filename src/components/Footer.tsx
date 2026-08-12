import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-secondary border-t border-muted-gray/30">
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="font-heading text-2xl text-primary mb-4">Locanex</h3>
            <p className="font-paragraph text-base text-foreground/70 mb-4">
              Locanex International Co., Ltd.
            </p>
            <p className="font-paragraph text-sm text-foreground/60">
              专业电动工具制造商<br />
              致力于为全球市场提供高品质产品
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl text-foreground mb-4">快速链接</h4>
            <ul className="space-y-3">
              {[
                { label: '关于Locanex', href: '#company' },
                { label: '产品系列', href: '#products' },
                { label: '经销商申请', href: '#application' },
                { label: '常见问题', href: '#faq' }
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="font-paragraph text-base text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-xl text-foreground mb-4">联系方式</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm text-foreground/60 mb-1">电子邮箱</p>
                  <a href="mailto:info@locanex.com" className="font-paragraph text-base text-foreground/80 hover:text-primary transition-colors">
                    info@locanex.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm text-foreground/60 mb-1">联系电话</p>
                  <a href="tel:0937281730" className="font-paragraph text-base text-foreground/80 hover:text-primary transition-colors">
                    093 728 1730
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm text-foreground/60 mb-1">LINE ID</p>
                  <a href="https://line.me/ti/p/~0937281730" className="font-paragraph text-base text-foreground/80 hover:text-primary transition-colors">
                    0937281730
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-heading text-xl text-foreground mb-4">营业时间</h4>
            <ul className="space-y-3 font-paragraph text-base text-foreground/70">
              <li>
                <span className="text-foreground/60">周一至周五</span><br />
                09:00 - 18:00
              </li>
              <li>
                <span className="text-foreground/60">周六</span><br />
                09:00 - 13:00
              </li>
              <li>
                <span className="text-foreground/60">周日及公众假期</span><br />
                休息
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-muted-gray/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-foreground/60 text-center md:text-left">
              © {currentYear} Locanex International Co., Ltd. 保留所有权利
            </p>
            <div className="flex gap-6">
              <button className="font-paragraph text-sm text-foreground/60 hover:text-primary transition-colors">
                隐私政策
              </button>
              <button className="font-paragraph text-sm text-foreground/60 hover:text-primary transition-colors">
                使用条款
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

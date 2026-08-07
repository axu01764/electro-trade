// HPI 1.7-V
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronDown, CheckCircle, Package, TrendingUp, Shield, 
  Users, Zap, Award, Clock, Globe, Phone, Mail, 
  MessageCircle, ArrowRight, Settings, Wrench, Factory,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Coreproducts, Faq, Distributorapplications } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  // --- CANONICAL DATA SOURCES & STATE ---
  const [products, setProducts] = useState<Coreproducts[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [applicationStep, setApplicationStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPersonName: '',
    contactPhone: '',
    email: '',
    companyType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DATA FETCHING LOGIC ---
  useEffect(() => {
    loadProducts();
    loadFaqs();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await BaseCrudService.getAll<Coreproducts>('coreproducts');
      setProducts(result.items);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadFaqs = async () => {
    try {
      const result = await BaseCrudService.getAll<Faq>('faq');
      setFaqs(result.items);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    } finally {
      setIsLoadingFaqs(false);
    }
  };

  // --- FORM HANDLING LOGIC ---
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (applicationStep === 1) {
      setApplicationStep(2);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      await BaseCrudService.create<Distributorapplications>('distributorapplications', {
        _id: crypto.randomUUID(),
        companyName: formData.companyName,
        contactPersonName: formData.contactPersonName,
        contactPhone: formData.contactPhone,
        email: formData.email,
        companyType: formData.companyType
      });
      
      setFormData({
        companyName: '',
        contactPersonName: '',
        contactPhone: '',
        email: '',
        companyType: ''
      });
      setApplicationStep(1);
      alert('申请已成功提交！我们的团队将在48小时内与您联系。');
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('提交失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ANIMATION & SCROLL LOGIC ---
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-clip">
      <style>{`
        .industrial-noise {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 1;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
        }
        .clip-diagonal-reverse {
          clip-path: polygon(0 10%, 100% 0, 100% 100%, 0 100%);
        }
        .glow-border {
          position: relative;
        }
        .glow-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(45deg, transparent, rgba(255, 153, 0, 0.3), transparent);
          z-index: -1;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .glow-border:hover::before {
          opacity: 1;
        }
      `}</style>

      <Header />

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative w-full h-[680px] md:h-[720px] flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <Image 
            src="https://static.wixstatic.com/media/556c5c_03f932509c344150a4ec208291edf3d0~mv2.png"
            alt="Locanex power tools background"
            className="w-full h-full object-cover"
            width={1920}
          />
          {/* Gradient mask: 60% black on left to 10-15% on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10"></div>
          <div className="industrial-noise"></div>
        </motion.div>

        <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 md:px-12 h-full flex items-center">
          {/* Left side: ~45% - Text and CTA */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="w-full md:w-[45%] flex flex-col justify-center"
          >
            <motion.div variants={fadeUpVariant} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-muted-gray/50 backdrop-blur-md w-fit">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-paragraph text-sm tracking-wider text-foreground/90 uppercase">Thailand Dealer Recruitment Program</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-[1.2] tracking-tight text-left">
              寻找泰国本地<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500">电动工具经销商</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="font-paragraph text-base md:text-lg text-foreground/80 mb-8 leading-relaxed text-left">
              有竞争力的经销价格、稳定供货和市场支持。<br />
              符合条件的经销商可申请免费产品样品。
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 items-start mb-6">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base px-8 py-6 h-auto rounded-none relative overflow-hidden group whitespace-nowrap"
                onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10 flex items-center gap-2">
                  申请免费样品评估 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-muted-gray text-foreground hover:bg-secondary hover:text-primary font-heading text-base px-8 py-6 h-auto rounded-none transition-colors whitespace-nowrap"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                添加LINE咨询
              </Button>
            </motion.div>

            <motion.p variants={fadeUpVariant} className="font-paragraph text-xs text-muted-gray-foreground text-left">
              申请约需60秒｜无需支付申请费用｜审核通过后安排样品
            </motion.p>

            {/* Trust points */}
            <motion.div variants={fadeUpVariant} className="mt-10 grid grid-cols-2 gap-4 text-left">
              {[
                '有竞争力的经销价格',
                '样品测试机会',
                '营销支持',
                '售后支持'
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                  <span className="font-paragraph text-sm text-foreground/80">{point}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side: ~55% - Product showcase (handled by background image) */}
          <div className="hidden md:block w-[55%]"></div>
        </div>
      </section>

      {/* --- DEALER OPPORTUNITIES (B2B) --- */}
      <section id="opportunities" className="relative w-full overflow-hidden" style={{ minHeight: '450px', maxHeight: '520px', display: 'flex', alignItems: 'center' }}>
        {/* Background with warehouse image and 30% black overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/556c5c_f85184c7b62946029429c579009fc6be~mv2.png"
            alt="Industrial warehouse background"
            className="w-full h-full object-cover"
            width={1920}
          />
          {/* 30% black overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="industrial-noise"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-12">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="mb-12 text-center"
          >
            <h2 className="font-heading text-3xl md:text-5xl lg:text-5xl text-foreground mb-4">
              为什么 Locanex 值得成为您的<br />下一个<span className="text-primary">合作品牌？</span>
            </h2>
            <p className="font-paragraph text-base md:text-lg text-foreground/70 max-w-3xl mx-auto mt-4">
              不仅提供产品，更为经销商提供具有长期销售潜力的合作方案。
            </p>
          </motion.div>

          {/* Cards Grid - Desktop: 6 cards in 1 row | Tablet: 3 cards x 2 rows | Mobile: 2 cards x 3 rows */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {/* 6 Advantage Cards */}
            {[
              { 
                number: '01',
                icon: TrendingUp, 
                title: '有竞争力的经销价格', 
                desc: '通过资质审核后获取经销商合作报价' 
              },
              { 
                number: '02',
                icon: Package, 
                title: '阶梯采购政策', 
                desc: '根据采购数量提供不同级别的合作方案' 
              },
              { 
                number: '03',
                icon: Zap, 
                title: '统一无线电池平台', 
                desc: '多款无线工具共享电池平台，带来持续销售机会' 
              },
              { 
                number: '04',
                icon: Award, 
                title: '组合销售机会', 
                desc: '工具、电池、充电器和配件可组合销售' 
              },
              { 
                number: '05',
                icon: Clock, 
                title: '稳定供货', 
                desc: '提供稳定供货和长期补货支持' 
              },
              { 
                number: '06',
                icon: Globe, 
                title: '泰国市场支持', 
                desc: '提供泰文产品资料、图片、视频和营销支持' 
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group bg-black/60 backdrop-blur-sm border border-muted-gray/40 p-5 md:p-6 hover:border-primary transition-all duration-300 flex flex-col justify-between h-[170px] md:h-[180px] lg:h-[190px] hover:-translate-y-1"
              >
                <div>
                  <div className="mb-3 inline-flex items-center justify-center w-8 h-8 bg-primary/20 border border-muted-gray/50 group-hover:border-primary/80 transition-colors">
                    <span className="font-heading text-xs text-primary font-bold">{item.number}</span>
                  </div>
                  <h3 className="font-heading text-sm md:text-base text-foreground mb-2 line-clamp-2 leading-tight">{item.title}</h3>
                </div>
                <p className="font-paragraph text-xs text-foreground/70 leading-relaxed line-clamp-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CORE PRODUCTS SHOWCASE --- */}
      <section id="products" className="relative w-full py-20 md:py-32 bg-secondary/40 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="max-w-[120rem] mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-16 md:mb-24"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/50 text-primary text-xs font-heading mb-6 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              PROFESSIONAL 21V BRUSHLESS SERIES
            </div>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Locanex 21V 专业无刷电动工具系列
            </h2>
            <p className="font-paragraph text-base md:text-lg text-foreground/70 max-w-4xl mx-auto leading-relaxed">
              为专业施工、安装、维修与工业用户打造｜五款21V工具覆盖高频作业场景｜适合经销商门店展示与样品测试
            </p>
          </motion.div>

          <div className="min-h-[500px]">
            {isLoadingProducts ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : products.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={fadeUpVariant}
                    className="group relative bg-secondary/60 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300"
                  >
                    {/* Product Image - Full Cover */}
                    <div className="relative w-full aspect-[3/4] bg-secondary/80 overflow-hidden">
                      {product.productImage ? (
                        <Image 
                          src={product.productImage}
                          alt={product.productName || 'Locanex Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          width={300}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
                          <Wrench className="w-16 h-16 text-muted-gray/50" />
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-5 md:p-6 flex-grow flex flex-col relative z-30 bg-secondary/60">
                      {/* Brand Label */}
                      <div className="mb-3">
                        <span className="font-heading text-xs md:text-sm font-bold text-primary tracking-widest uppercase">
                          LOCANEX 21V
                        </span>
                      </div>
                      
                      {/* Product Name */}
                      <h3 className="font-heading text-base md:text-lg text-foreground font-bold mb-4 line-clamp-2 leading-tight">
                        {product.productName}
                      </h3>
                      
                      {/* Professional Use */}
                      {product.productDescription && (
                        <div className="mb-4">
                          <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                            专业用途：
                          </p>
                          <p className="font-paragraph text-sm text-foreground/80 leading-relaxed">
                            {product.productDescription}
                          </p>
                        </div>
                      )}
                      
                      {/* Dealer Highlight */}
                      {product.keyFeatures && (
                        <div className="mb-6">
                          <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                            经销商看点：
                          </p>
                          <p className="font-paragraph text-sm text-foreground/80 leading-relaxed">
                            {product.keyFeatures}
                          </p>
                        </div>
                      )}
                      
                      {/* CTA Button */}
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-sm md:text-base py-3 md:py-4 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                        onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        申请该产品样品
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 border border-dashed border-muted-gray/30 bg-secondary/20">
                <Package className="w-16 h-16 text-muted-gray mx-auto mb-4" />
                <p className="font-paragraph text-lg text-foreground/60">产品目录正在更新中</p>
              </div>
            )}
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 md:mt-28 text-center"
          >
            <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
              想先测试哪一款？
            </h3>
            <p className="font-paragraph text-base md:text-lg text-foreground/70 max-w-3xl mx-auto mb-8">
              符合条件的泰国经销商可申请指定产品样品进行评估与测试。样品数量有限，申请需经资质审核。
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base md:text-lg px-10 md:px-12 py-6 md:py-7 h-auto rounded-none uppercase tracking-wider font-bold"
              onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
            >
              申请免费样品评估
            </Button>
          </motion.div>
        </div>
      </section>

      {/* --- DIFFERENTIATION (COMPARISON) --- */}
      <section id="differentiation" className="relative w-full py-32 bg-background">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              产品与经销<span className="text-primary">支持对比</span>
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="p-6 text-left font-heading text-xl text-foreground/60 border-b border-muted-gray/30 w-1/3">比较项目</th>
                  <th className="p-6 text-left font-heading text-2xl text-primary border-b-2 border-primary w-1/3 bg-secondary/30">Locanex</th>
                  <th className="p-6 text-left font-heading text-xl text-foreground/60 border-b border-muted-gray/30 w-1/3">一般市场产品</th>
                </tr>
              </thead>
              <tbody className="font-paragraph">
                {[
                  { label: '电机性能', pro: '动力稳定，效率更高', con: '性能不稳定，效率一般' },
                  { label: '电池保护', pro: '多重保护系统', con: '基础保护或无保护' },
                  { label: '耐用性', pro: '更耐用，寿命更长', con: '耐用性较低' },
                  { label: '质量检测', pro: '出厂严格检测', con: '检测标准不一' },
                  { label: '配件供应', pro: '配件齐全，供应稳定', con: '配件短缺，供应不稳定' },
                  { label: '经销商支持', pro: '提供培训、营销全方位支持', con: '支持有限或无支持' },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-secondary/20 transition-colors">
                    <td className="p-6 border-b border-muted-gray/20 text-foreground/80 font-bold">{row.label}</td>
                    <td className="p-6 border-b border-muted-gray/20 text-foreground bg-secondary/10 group-hover:bg-secondary/30 transition-colors flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" /> {row.pro}
                    </td>
                    <td className="p-6 border-b border-muted-gray/20 text-foreground/50">{row.con}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* --- SAMPLE PROGRAM (PARALLAX BANNER) --- */}
      <section id="sample-program" className="relative w-full py-32 overflow-hidden clip-diagonal-reverse bg-black">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <Image 
            src="https://static.wixstatic.com/media/556c5c_28f53801f0e948cdbcdc7a7fee4b1933~mv2.png?originWidth=1152&originHeight=640"
            alt="Industrial background"
            className="w-full h-full object-cover opacity-40"
            width={1920}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </motion.div>

        <div className="relative z-10 max-w-[100rem] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/50 text-primary text-sm font-heading mb-6">
              <Settings className="w-4 h-4" /> 零风险评估
            </div>
            <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-6 leading-tight">
              申请加入泰国经销商<br />
              <span className="text-primary">产品测试计划</span>
            </h2>
            <p className="font-paragraph text-lg text-foreground/80 mb-8">
              我们深知产品品质是合作的基础。符合条件的意向经销商，可申请获取 Locanex 核心产品进行免费实地测试。
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                '提交经销商申请', '添加LINE保持沟通', '资质评估与确认', '寄送测试样品'
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-primary/30 flex items-center justify-center text-primary font-heading text-sm">
                    {i + 1}
                  </div>
                  <span className="font-paragraph text-foreground/90">{step}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-lg px-10 py-7 h-auto rounded-none"
              onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
            >
              立即申请免费样品
            </Button>
            <p className="mt-4 font-paragraph text-sm text-muted-gray-foreground">
              * 样品数量有限，申请不代表自动获得，需经资质审核。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block w-full max-w-md relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <Image 
              src="https://static.wixstatic.com/media/556c5c_497fc267e9ff4f9fade69572550d690d~mv2.png?originWidth=1152&originHeight=640"
              alt="Sample Kit"
              className="relative z-10 w-full h-auto border border-muted-gray/30 shadow-2xl"
              width={600}
            />
          </motion.div>
        </div>
      </section>

      {/* --- COMPANY & SUPPLY CAPABILITY --- */}
      <section id="company" className="relative w-full py-32 bg-background">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-20"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              公司实力、<span className="text-primary">质量控制</span>与供货能力
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '工厂与生产线', desc: '现代化生产线，稳定的生产能力', icon: Factory },
              { title: '产品质量检测', desc: '严格的质量检测流程，确保产品品质', icon: Shield },
              { title: '仓库与库存', desc: '充足的库存管理，确保稳定交货', icon: Package }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative h-80 overflow-hidden border border-muted-gray/20"
              >
                <Image 
                  src="https://static.wixstatic.com/media/556c5c_2d011c292e894241b0fb7190e8d6f640~mv2.png?originWidth=576&originHeight=448"
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  width={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading text-2xl text-foreground mb-2">{item.title}</h3>
                  <p className="font-paragraph text-foreground/70">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="font-heading text-xl text-primary tracking-wide">我们正在寻找首批泰国市场合作伙伴。</p>
          </motion.div>
        </div>
      </section>

      {/* --- IDEAL DISTRIBUTOR & APPLICATION FORM (SPLIT LAYOUT) --- */}
      <section id="application-section" className="relative w-full bg-secondary/30 border-t border-muted-gray/20">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Side: Ideal Distributor */}
          <div className="p-12 md:p-20 lg:p-32 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-muted-gray/20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-12">
                哪些合作伙伴<span className="text-primary">适合申请？</span>
              </h2>
              
              <div className="space-y-12">
                <div>
                  <h3 className="font-heading text-xl text-foreground mb-6 flex items-center gap-2">
                    <CheckCircle className="text-green-500 w-6 h-6" /> 适合申请
                  </h3>
                  <ul className="space-y-4 font-paragraph text-foreground/80">
                    {['电动工具经销商', '五金店/建材店', '工业用品供应商', '电商卖家', '批发商', '拥有区域渠道的公司'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-heading text-xl text-foreground mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-sm font-bold">X</div> 暂不适合
                  </h3>
                  <ul className="space-y-4 font-paragraph text-foreground/60">
                    {['仅希望购买个人试用品', '没有相关销售渠道', '无法提供真实经营信息', '不接受核心产品测试反馈'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-gray"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Application Form */}
          <div id="application" className="p-12 md:p-20 lg:p-32 bg-background relative overflow-hidden">
            <div className="industrial-noise"></div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-md mx-auto lg:mx-0"
            >
              <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
                申请成为<span className="text-primary">Locanex经销商</span>
              </h2>
              <p className="font-paragraph text-foreground/60 mb-10">填写基本信息，获取产品资料与评估资格。</p>

              {/* Step Indicator */}
              <div className="flex items-center mb-10">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${applicationStep >= 1 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>1</div>
                <div className="font-paragraph text-sm ml-3 mr-4 text-foreground/80">步骤 1: 基本信息</div>
                <div className={`flex-grow h-px ${applicationStep >= 2 ? 'bg-primary' : 'bg-muted-gray/30'} transition-colors`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ml-4 ${applicationStep >= 2 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>2</div>
                <div className="font-paragraph text-sm ml-3 text-foreground/80">步骤 2: 联系方式</div>
              </div>

              <div className="bg-secondary/20 border border-muted-gray/20 p-8">
                {applicationStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="font-paragraph text-foreground/80">公司名称 *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-12"
                        placeholder="请输入公司全称"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPersonName" className="font-paragraph text-foreground/80">联系人姓名 *</Label>
                      <Input
                        id="contactPersonName"
                        value={formData.contactPersonName}
                        onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                        className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-12"
                        placeholder="请输入联系人姓名"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyType" className="font-paragraph text-foreground/80">公司类型 *</Label>
                      <Select value={formData.companyType} onValueChange={(value) => handleInputChange('companyType', value)}>
                        <SelectTrigger className="bg-background border-muted-gray/30 text-foreground focus:ring-primary rounded-none h-12">
                          <SelectValue placeholder="请选择公司类型" />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary border-muted-gray/30 text-foreground">
                          <SelectItem value="五金工具经销商">五金工具经销商</SelectItem>
                          <SelectItem value="建材市场经销商">建材市场经销商</SelectItem>
                          <SelectItem value="工业用品供应商">工业用品供应商</SelectItem>
                          <SelectItem value="电商平台卖家">电商平台卖家</SelectItem>
                          <SelectItem value="批发商">批发商</SelectItem>
                          <SelectItem value="零售连锁店">零售连锁店</SelectItem>
                          <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-lg py-6 h-auto rounded-none mt-4"
                      onClick={handleNextStep}
                      disabled={!formData.companyName || !formData.contactPersonName || !formData.companyType}
                    >
                      下一步
                    </Button>
                  </motion.div>
                )}

                {applicationStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="font-paragraph text-foreground/80">联系电话 *</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-12"
                        placeholder="请输入联系电话"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-paragraph text-foreground/80">电子邮箱 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-12"
                        placeholder="请输入电子邮箱"
                      />
                    </div>

                    <div className="flex gap-4 mt-4">
                      <Button
                        variant="outline"
                        className="w-1/3 border-muted-gray/50 text-foreground hover:bg-secondary font-heading py-6 h-auto rounded-none"
                        onClick={() => setApplicationStep(1)}
                      >
                        返回
                      </Button>
                      <Button
                        className="w-2/3 bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-lg py-6 h-auto rounded-none"
                        onClick={handleSubmitApplication}
                        disabled={!formData.contactPhone || !formData.email || isSubmitting}
                      >
                        {isSubmitting ? '提交中...' : '提交申请'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="relative w-full py-32 bg-background">
        <div className="max-w-[60rem] mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              常见<span className="text-primary">问题</span>
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto"></div>
          </motion.div>

          <div className="min-h-[300px]">
            {isLoadingFaqs ? (
               <div className="flex justify-center items-center h-32">
                 <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
               </div>
            ) : faqs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={faq._id} 
                      value={`item-${index}`}
                      className="bg-secondary/20 border border-muted-gray/20 px-6 rounded-none data-[state=open]:border-primary/50 transition-colors"
                    >
                      <AccordionTrigger className="font-heading text-lg text-foreground hover:text-primary hover:no-underline py-6 text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-paragraph text-base text-foreground/70 pb-6 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ) : (
              <div className="text-center py-12 border border-dashed border-muted-gray/30">
                <p className="font-paragraph text-foreground/60">暂无常见问题</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section id="final-cta" className="relative w-full py-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
           <Image 
            src="https://static.wixstatic.com/media/556c5c_e0859bd4b0844dfdb2784bdbbeb0dab7~mv2.png?originWidth=1920&originHeight=1024"
            alt="Texture"
            className="w-full h-full object-cover"
            width={1920}
          />
        </div>
        
        <div className="relative z-10 max-w-[80rem] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-6xl text-black mb-6 font-bold">
              准备与 Locanex 一起开拓<br />泰国电动工具市场吗？
            </h2>
            <p className="font-paragraph text-xl text-black/80 max-w-2xl mx-auto mb-12 font-medium">
              提交经销商申请，获取产品资料、经销价格和免费产品评估资格。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-black hover:bg-black/80 text-white font-heading text-lg px-12 py-7 h-auto rounded-none shadow-2xl"
                onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
              >
                申请免费样品评估
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-black text-black hover:bg-black hover:text-white font-heading text-lg px-12 py-7 h-auto rounded-none transition-colors"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                添加LINE咨询
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
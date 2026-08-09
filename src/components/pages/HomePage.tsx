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
      const result = await BaseCrudService.getAll<Faq>('faq', [], { limit: 8 });
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-clip pb-24 max-sm:pb-32">
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
        /* Mobile Fixed CTA Bar */
        .fixed-cta-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          display: none;
          background: rgba(18, 18, 18, 0.98);
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(74, 74, 74, 0.3);
          padding: 12px 16px;
          gap: 8px;
        }
        @media (max-width: 767px) {
          .fixed-cta-bar {
            display: flex;
          }
        }
        .fixed-cta-bar button {
          flex: 1;
          height: 48px;
          font-size: 14px;
          border-radius: 0;
        }
      `}</style>

      <Header />

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative w-full max-sm:min-h-[820px] sm:min-h-[680px] md:h-[680px] lg:h-[720px] flex items-center justify-center overflow-hidden bg-black pt-20 max-sm:pt-16 sm:pt-24 md:pt-0">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Desktop/Tablet Background */}
          <Image 
            src="https://static.wixstatic.com/media/556c5c_03f932509c344150a4ec208291edf3d0~mv2.png"
            alt="Locanex power tools background"
            className="hidden md:block w-full h-full object-cover object-center"
            width={1920}
          />
          {/* Mobile Background */}
          <Image 
            src="https://static.wixstatic.com/media/556c5c_af548caae38c4dc7bdeef8e9e74a4efc~mv2.png"
            alt="Locanex power tools mobile background"
            className="block md:hidden w-full h-full object-cover object-bottom"
            style={{ backgroundColor: '#080909' }}
            width={1920}
          />
          {/* Mobile: Top-to-bottom gradient for text readability | Desktop: Left-to-right gradient */}
          <div className="absolute inset-0 max-sm:bg-gradient-to-b max-sm:from-black/80 max-sm:via-black/40 max-sm:to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-black/20 lg:from-black/60 lg:via-black/30 lg:to-black/10"></div>
          <div className="industrial-noise"></div>
        </motion.div>

        <div className="relative z-10 w-full max-w-[1300px] mx-auto max-sm:px-5 sm:px-6 md:px-12 h-full max-sm:flex max-sm:flex-col max-sm:justify-between md:flex md:items-center">
          {/* Mobile: Top section - Text and CTA | Desktop: Left side ~45% */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="w-full max-sm:pt-8 md:w-[45%] flex flex-col justify-center"
          >
            <motion.div variants={fadeUpVariant} className="mb-3 max-sm:mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/80 border border-muted-gray/50 backdrop-blur-md w-fit max-sm:text-[10px] max-sm:px-2 max-sm:py-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse max-sm:w-1.5 max-sm:h-1.5"></span>
              <span className="font-paragraph text-xs sm:text-sm tracking-wider text-foreground/90 uppercase max-sm:whitespace-nowrap">Thailand Dealer Recruitment Program</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="font-heading text-3xl max-sm:text-[32px] sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-3 max-sm:mb-4 sm:mb-6 max-sm:leading-[1.1] md:leading-[1.2] tracking-tight text-left">
              寻找泰国本地<br />
              <span className="text-primary">电动工具经销商</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="font-paragraph text-sm max-sm:text-[15px] sm:text-base md:text-lg text-foreground/80 mb-4 max-sm:mb-5 sm:mb-8 max-sm:leading-[1.65] md:leading-[1.6] text-left">
              有竞争力的经销价格、稳定供货和市场支持。<br />
              符合条件的经销商可申请免费产品样品。
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 max-sm:gap-3 sm:gap-4 items-stretch sm:items-start mb-3 max-sm:mb-4 sm:mb-6 max-sm:w-full">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-sm max-sm:text-sm sm:text-base px-4 max-sm:px-4 sm:px-8 max-sm:py-3 sm:py-6 max-sm:h-[52px] sm:h-auto rounded-none relative overflow-hidden group max-sm:w-full sm:w-auto"
                onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10 flex items-center justify-center sm:justify-start gap-2">
                  申请免费样品评估 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform hidden sm:inline" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-muted-gray text-foreground hover:bg-secondary hover:text-primary font-heading text-sm max-sm:text-sm sm:text-base px-4 max-sm:px-4 sm:px-8 max-sm:py-3 sm:py-6 max-sm:h-[52px] sm:h-auto rounded-none transition-colors max-sm:w-full sm:w-auto"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                添加LINE咨询
              </Button>
            </motion.div>

            <motion.p variants={fadeUpVariant} className="font-paragraph text-xs max-sm:text-xs text-muted-gray-foreground text-left">
              申请约需60秒｜无需支付申请费用｜审核通过后安排样品
            </motion.p>

            {/* Trust points - Hidden on mobile */}
            <motion.div variants={fadeUpVariant} className="mt-4 max-sm:hidden sm:mt-10 grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-2 max-sm:gap-2 sm:gap-4 text-left">
              {[
                '有竞争力的经销价格',
                '样品测试机会',
                '营销支持',
                '售后支持'
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                  <span className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80">{point}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>


        </div>
      </section>

      {/* --- DEALER OPPORTUNITIES (B2B) --- */}
      <section id="opportunities" className="relative w-full overflow-hidden py-16 max-sm:py-12 sm:py-20 md:py-32 flex items-center">
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

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 max-sm:px-4 sm:px-6 md:px-12">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="mb-8 max-sm:mb-8 sm:mb-12 text-center"
          >
            <h2 className="font-heading text-2xl max-sm:text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-foreground mb-3 max-sm:mb-3 sm:mb-4 leading-[1.2]">
              为什么 Locanex 值得成为您的<br />下一个<span className="text-primary">合作品牌？</span>
            </h2>
            <p className="font-paragraph text-sm max-sm:text-sm sm:text-base md:text-lg text-foreground/70 max-w-3xl mx-auto mt-3 max-sm:mt-3 sm:mt-4 leading-[1.6]">
              不仅提供产品，更为经销商提供具有长期销售潜力的合作方案。
            </p>
          </motion.div>

          {/* Cards Grid - Desktop: 6 cards in 1 row | Tablet: 3 cards x 2 rows | Mobile: 1 column */}
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 max-sm:gap-2 sm:gap-3 md:gap-4">
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
                className="group bg-black/60 backdrop-blur-sm border border-muted-gray/40 p-3 max-sm:p-3 sm:p-4 md:p-6 hover:border-primary transition-all duration-300 flex flex-col justify-between min-h-[140px] max-sm:min-h-[140px] sm:min-h-[160px] md:h-[180px] lg:h-[190px] hover:-translate-y-1"
              >
                <div>
                  <div className="mb-2 max-sm:mb-2 sm:mb-3 inline-flex items-center justify-center w-8 h-8 bg-primary/20 border border-muted-gray/50 group-hover:border-primary/80 transition-colors">
                    <span className="font-heading text-xs text-primary font-bold">{item.number}</span>
                  </div>
                  <h3 className="font-heading text-xs max-sm:text-xs sm:text-sm md:text-base text-foreground mb-1 max-sm:mb-1 sm:mb-2 line-clamp-2 leading-tight">{item.title}</h3>
                </div>
                <p className="font-paragraph text-xs max-sm:text-xs text-foreground/70 leading-[1.4] line-clamp-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CORE PRODUCTS SHOWCASE (21V PROFESSIONAL SERIES) --- */}
      <section id="products" className="relative w-full py-12 max-sm:py-12 sm:py-20 md:py-32 overflow-hidden">
        {/* Background with industrial image and 60-75% dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/556c5c_f85184c7b62946029429c579009fc6be~mv2.png"
            alt="Industrial warehouse background"
            className="w-full h-full object-cover"
            width={1920}
          />
          {/* 65% black overlay */}
          <div className="absolute inset-0 bg-black/65"></div>
          <div className="industrial-noise"></div>
        </div>
        
        <div className="relative z-10 max-w-[120rem] mx-auto px-4 max-sm:px-4 sm:px-6 md:px-12">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-12 max-sm:mb-10 sm:mb-16 md:mb-24"
          >
            <h2 className="font-heading text-2xl max-sm:text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-foreground mb-3 max-sm:mb-3 sm:mb-4 leading-[1.2]">
              LOCANEX 21V<br />
              <span className="text-primary">专业无刷电动工具系列</span>
            </h2>
            <p className="font-paragraph text-sm max-sm:text-sm sm:text-base md:text-lg text-foreground/80 max-w-4xl mx-auto leading-[1.6] mt-3 max-sm:mt-3 sm:mt-6">
              为专业施工、安装、维修与工业用户打造<br />
              五款21V专业工具覆盖高频作业场景<br />
              适合经销商门店展示与样品测试
            </p>
          </motion.div>

          {/* 5 Product Cards - Desktop: 5 in row | Mobile: 1 column */}
          <div className="min-h-[400px] max-sm:min-h-[auto]">
            <motion.div 
              className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 max-sm:gap-2 sm:gap-3 md:gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Product 1: Impact Drill */}
              <motion.div
                variants={fadeUpVariant}
                className="group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300"
              >
                {/* Product Image - Full Cover */}
                <div className="relative w-full aspect-[3/4] bg-black/80 overflow-hidden">
                  <Image 
                    src="https://static.wixstatic.com/media/556c5c_8aae7f52450e4b5bb621c5beaa1fbd8b~mv2.png"
                    alt="Locanex 21V Impact Drill"
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    width={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Product Info */}
                <div className="p-3 max-sm:p-3 sm:p-4 md:p-5 flex-grow flex flex-col relative z-30 bg-black/70">
                  <div className="mb-2 max-sm:mb-2 sm:mb-3">
                    <span className="font-heading text-xs max-sm:text-xs md:text-sm font-bold text-primary tracking-widest uppercase">
                      LOCANEX 21V
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-sm max-sm:text-sm md:text-lg text-foreground font-bold mb-2 max-sm:mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-tight">
                    无刷冲击钻
                  </h3>
                  
                  <div className="mb-2 max-sm:mb-2 sm:mb-3 md:mb-4">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      专业用途
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      钻孔、紧固、安装与维修作业
                    </p>
                  </div>
                  
                  <div className="mb-3 max-sm:mb-3 sm:mb-4 md:mb-6">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      经销商看点
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      高频施工工具，同时覆盖钻孔与紧固需求。
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs max-sm:text-xs md:text-sm py-2 max-sm:py-2 md:py-3 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                    onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    申请该产品样品
                  </Button>
                </div>
              </motion.div>

              {/* Product 2: Impact Wrench */}
              <motion.div
                variants={fadeUpVariant}
                className="group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300"
              >
                <div className="relative w-full aspect-[3/4] bg-black/80 overflow-hidden">
                  <Image 
                    src="https://static.wixstatic.com/media/556c5c_12ea91a36dc44157a25ecf3cabd84403~mv2.png"
                    alt="Locanex 21V Impact Wrench"
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    width={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-3 max-sm:p-3 sm:p-4 md:p-5 flex-grow flex flex-col relative z-30 bg-black/70">
                  <div className="mb-2 max-sm:mb-2 sm:mb-3">
                    <span className="font-heading text-xs max-sm:text-xs md:text-sm font-bold text-primary tracking-widest uppercase">
                      LOCANEX 21V
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-sm max-sm:text-sm md:text-lg text-foreground font-bold mb-2 max-sm:mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-tight">
                    无刷冲击扳手
                  </h3>
                  
                  <div className="mb-2 max-sm:mb-2 sm:mb-3 md:mb-4">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      专业用途
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      轮胎、机械、钢结构及螺栓拆装
                    </p>
                  </div>
                  
                  <div className="mb-3 max-sm:mb-3 sm:mb-4 md:mb-6">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      经销商看点
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      专业紧固定位，适合汽修、工程与设备维护渠道。
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs max-sm:text-xs md:text-sm py-2 max-sm:py-2 md:py-3 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                    onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    申请该产品样品
                  </Button>
                </div>
              </motion.div>

              {/* Product 3: Chainsaw */}
              <motion.div
                variants={fadeUpVariant}
                className="group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300"
              >
                <div className="relative w-full aspect-[3/4] bg-black/80 overflow-hidden">
                  <Image 
                    src="https://static.wixstatic.com/media/556c5c_7457eb978ebd4fbcaec544aa7c991a4f~mv2.png"
                    alt="Locanex 21V Chainsaw"
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    width={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-3 max-sm:p-3 sm:p-4 md:p-5 flex-grow flex flex-col relative z-30 bg-black/70">
                  <div className="mb-2 max-sm:mb-2 sm:mb-3">
                    <span className="font-heading text-xs max-sm:text-xs md:text-sm font-bold text-primary tracking-widest uppercase">
                      LOCANEX 21V
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-sm max-sm:text-sm md:text-lg text-foreground font-bold mb-2 max-sm:mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-tight">
                    无刷无绳链锯
                  </h3>
                  
                  <div className="mb-2 max-sm:mb-2 sm:mb-3 md:mb-4">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      专业用途
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      木材切割、园林修枝与现场木工作业
                    </p>
                  </div>
                  
                  <div className="mb-3 max-sm:mb-3 sm:mb-4 md:mb-6">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      经销商看点
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      无绳作业更灵活，用途直观，方便门店演示。
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs max-sm:text-xs md:text-sm py-2 max-sm:py-2 md:py-3 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                    onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    申请该产品样品
                  </Button>
                </div>
              </motion.div>

              {/* Product 4: Circular Saw */}
              <motion.div
                variants={fadeUpVariant}
                className="group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300"
              >
                <div className="relative w-full aspect-[3/4] bg-black/80 overflow-hidden">
                  <Image 
                    src="https://static.wixstatic.com/media/556c5c_a6b7cb813d1c45b8839817121694b305~mv2.png"
                    alt="Locanex 21V Circular Saw"
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    width={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-3 max-sm:p-3 sm:p-4 md:p-5 flex-grow flex flex-col relative z-30 bg-black/70">
                  <div className="mb-2 max-sm:mb-2 sm:mb-3">
                    <span className="font-heading text-xs max-sm:text-xs md:text-sm font-bold text-primary tracking-widest uppercase">
                      LOCANEX 21V
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-sm max-sm:text-sm md:text-lg text-foreground font-bold mb-2 max-sm:mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-tight">
                    无刷电圆锯
                  </h3>
                  
                  <div className="mb-2 max-sm:mb-2 sm:mb-3 md:mb-4">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      专业用途
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      木板、模板、板材与施工现场切割
                    </p>
                  </div>
                  
                  <div className="mb-3 max-sm:mb-3 sm:mb-4 md:mb-6">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      经销商看点
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      专业切割场景明确，适合木工、建筑与装修渠道。
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs max-sm:text-xs md:text-sm py-2 max-sm:py-2 md:py-3 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                    onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    申请该产品样品
                  </Button>
                </div>
              </motion.div>

              {/* Product 5: Angle Grinder */}
              <motion.div
                variants={fadeUpVariant}
                className="group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300"
              >
                <div className="relative w-full aspect-[3/4] bg-black/80 overflow-hidden">
                  <Image 
                    src="https://static.wixstatic.com/media/556c5c_554ad7a1a9ec4d3b8e6cc4a0ccc41b1e~mv2.png"
                    alt="Locanex 21V Angle Grinder"
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    width={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-3 max-sm:p-3 sm:p-4 md:p-5 flex-grow flex flex-col relative z-30 bg-black/70">
                  <div className="mb-2 max-sm:mb-2 sm:mb-3">
                    <span className="font-heading text-xs max-sm:text-xs md:text-sm font-bold text-primary tracking-widest uppercase">
                      LOCANEX 21V
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-sm max-sm:text-sm md:text-lg text-foreground font-bold mb-2 max-sm:mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-tight">
                    无刷角磨机
                  </h3>
                  
                  <div className="mb-2 max-sm:mb-2 sm:mb-3 md:mb-4">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      专业用途
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      金属切割、打磨、去毛刺与表面处理
                    </p>
                  </div>
                  
                  <div className="mb-3 max-sm:mb-3 sm:mb-4 md:mb-6">
                    <p className="font-paragraph text-xs max-sm:text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                      经销商看点
                    </p>
                    <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80 leading-[1.4]">
                      覆盖高频金工任务，适合维修、工程与工业渠道。
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs max-sm:text-xs md:text-sm py-2 max-sm:py-2 md:py-3 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                    onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    申请该产品样品
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 max-sm:mt-10 sm:mt-20 md:mt-28 text-center"
          >
            <h3 className="font-heading text-xl max-sm:text-xl sm:text-2xl md:text-3xl text-foreground mb-3 max-sm:mb-3 sm:mb-4">
              想先测试哪一款？
            </h3>
            <p className="font-paragraph text-sm max-sm:text-sm sm:text-base md:text-lg text-foreground/70 max-w-3xl mx-auto mb-6 max-sm:mb-5 sm:mb-8 leading-[1.6]">
              符合条件的泰国经销商可申请指定产品样品进行评估与测试。样品数量有限，申请需经资质审核。
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-sm max-sm:text-sm md:text-base md:text-lg px-6 max-sm:px-6 md:px-10 md:px-12 py-3 max-sm:py-3 md:py-6 md:py-7 h-auto rounded-none uppercase tracking-wider font-bold"
              onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
            >
              申请免费样品评估
            </Button>
          </motion.div>
        </div>
      </section>

      {/* --- DIFFERENTIATION (COMPARISON) --- */}
      <section 
        id="differentiation" 
        className="relative w-full py-16 max-sm:py-12 sm:py-20 md:py-32 bg-background"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/556c5c_8fa7d834ed1349b3b5ef9ffa2cee64d1~mv2.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-[100rem] mx-auto px-4 max-sm:px-4 sm:px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-12 max-sm:mb-10 sm:mb-16"
          >
            <h2 className="font-heading text-2xl max-sm:text-2xl sm:text-3xl md:text-4xl md:text-5xl text-foreground mb-3 max-sm:mb-3 sm:mb-4 leading-[1.2]">
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
                  <th className="p-4 max-sm:p-3 sm:p-6 text-left font-heading text-lg max-sm:text-sm sm:text-xl text-foreground/60 border-b border-muted-gray/30 w-1/3">比较项目</th>
                  <th className="p-4 max-sm:p-3 sm:p-6 text-left font-heading text-lg max-sm:text-sm sm:text-2xl text-primary border-b-2 border-primary w-1/3 bg-secondary/30">Locanex</th>
                  <th className="p-4 max-sm:p-3 sm:p-6 text-left font-heading text-lg max-sm:text-sm sm:text-xl text-foreground/60 border-b border-muted-gray/30 w-1/3">一般供应商</th>
                </tr>
              </thead>
              <tbody className="font-paragraph">
                {[
                  { label: '工厂供货', pro: '✓ 工厂直供，利润空间更大', con: '中间环节多，成本更高' },
                  { label: 'OEM 贴牌', pro: '✓ 品牌、Logo、包装均可定制', con: '以标准产品为主' },
                  { label: 'ODM 开发', pro: '✓ 根据你的客户需求开发产品', con: '只能选择现有产品' },
                  { label: '产品差异化', pro: '✓ 打造专属配置与产品系列', con: '产品同质化严重' },
                  { label: '市场测试', pro: '✓ 先测试市场，再扩大采购', con: '批量采购，试错成本高' },
                  { label: '长期支持', pro: '✓ 根据市场反馈持续优化产品', con: '以供货为主，支持有限' },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-secondary/20 transition-colors">
                    <td className="p-4 max-sm:p-3 sm:p-6 border-b border-muted-gray/20 text-foreground/80 font-bold text-sm max-sm:text-xs sm:text-base">{row.label}</td>
                    <td className="p-4 max-sm:p-3 sm:p-6 border-b border-muted-gray/20 text-foreground bg-secondary/10 group-hover:bg-secondary/30 transition-colors flex items-center gap-3 text-sm max-sm:text-xs sm:text-base">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" /> {row.pro}
                    </td>
                    <td className="p-4 max-sm:p-3 sm:p-6 border-b border-muted-gray/20 text-foreground/50 text-sm max-sm:text-xs sm:text-base">{row.con}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* --- SAMPLE PROGRAM (WORKFLOW) --- */}
      <section id="sample-program" className="relative w-full py-16 max-sm:py-12 sm:py-20 md:py-32 overflow-hidden">
        {/* Background with overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(https://static.wixstatic.com/media/556c5c_bf739abb11f348c09b52556495b9071f~mv2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        <div className="relative z-10 max-w-[100rem] mx-auto px-4 max-sm:px-4 sm:px-6 md:px-12">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 max-sm:mb-10 sm:mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/50 text-primary text-xs max-sm:text-xs sm:text-sm font-heading mb-4 max-sm:mb-4 sm:mb-6">
              <Settings className="w-4 h-4" /> 经销商样品测试计划
            </div>
            <h2 className="font-heading text-2xl max-sm:text-2xl sm:text-3xl md:text-5xl text-foreground mb-3 max-sm:mb-3 sm:mb-4 leading-tight">
              申请加入泰国经销商<br />
              <span className="text-primary">产品测试计划</span>
            </h2>
            <p className="font-paragraph text-sm max-sm:text-sm sm:text-base md:text-lg text-foreground/80 max-w-3xl mx-auto leading-[1.6]">
              通过样品测试了解真实产品表现，并根据测试反馈制定长期合作方案。
            </p>
          </motion.div>

          {/* Workflow Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8 max-sm:mb-8 sm:mb-12"
          >
            {/* Desktop: Horizontal Layout */}
            <div className="hidden md:flex items-center justify-between gap-2 mb-12">
              {[
                { num: 1, title: '提交经销商申请', desc: '填写申请表\n提交基本信息' },
                { num: 2, title: '添加 LINE', desc: '添加官方 LINE\n保持沟通' },
                { num: 3, title: '资质评估', desc: '评估经销商资质\n与经营能力' },
                { num: 4, title: '确认样品', desc: '确认可申请的产品\n与样品数量' },
                { num: 5, title: '产品测试', desc: '签收样品并进行\n产品测试' },
                { num: 6, title: '制定合作方案', desc: '根据测试反馈\n制定合作方案' }
              ].map((step, index) => (
                <div key={step.num} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-secondary border-2 border-primary flex items-center justify-center text-primary font-heading text-lg mb-3">
                      {step.num}
                    </div>
                    <h3 className="font-heading text-sm text-foreground text-center mb-1 w-20">
                      {step.title}
                    </h3>
                    <p className="font-paragraph text-xs text-foreground/70 text-center w-24 leading-tight">
                      {step.desc}
                    </p>
                  </div>

                  {/* Arrow between steps */}
                  {index < 5 && (
                    <div className="flex-1 flex items-center justify-center px-2">
                      <div className="h-px bg-primary/50 flex-1"></div>
                      <ChevronRight className="w-5 h-5 text-primary mx-1" />
                      <div className="h-px bg-primary/50 flex-1"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: Vertical Layout */}
            <div className="md:hidden space-y-4 max-sm:space-y-4 sm:space-y-6">
              {[
                { num: 1, title: '提交经销商申请', desc: '填写申请表\n提交基本信息' },
                { num: 2, title: '添加 LINE', desc: '添加官方 LINE\n保持沟通' },
                { num: 3, title: '资质评估', desc: '评估经销商资质\n与经营能力' },
                { num: 4, title: '确认样品', desc: '确认可申请的产品\n与样品数量' },
                { num: 5, title: '产品测试', desc: '签收样品并进行\n产品测试' },
                { num: 6, title: '制定合作方案', desc: '根据测试反馈\n制定合作方案' }
              ].map((step, index) => (
                <div key={step.num}>
                  <div className="flex items-start gap-3 max-sm:gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary border-2 border-primary flex items-center justify-center text-primary font-heading text-sm flex-shrink-0">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-sm max-sm:text-sm text-foreground mb-1">
                        {step.title}
                      </h3>
                      <p className="font-paragraph text-xs max-sm:text-xs text-foreground/70 leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {index < 5 && (
                    <div className="flex justify-center py-2 ml-5">
                      <ChevronDown className="w-5 h-5 text-primary/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notice Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-primary/60 bg-black/40 px-4 max-sm:px-4 sm:px-6 py-3 max-sm:py-3 sm:py-4 mb-6 max-sm:mb-6 sm:mb-8 text-center"
          >
            <p className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground">
              样品数量有限 ｜ 申请不代表自动获得样品 ｜ 需提供真实经营信息
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center gap-3 max-sm:gap-3 sm:gap-4"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-sm max-sm:text-sm md:text-base md:text-lg px-6 max-sm:px-6 md:px-8 md:px-12 py-3 max-sm:py-3 md:py-4 h-auto rounded-none"
              onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
            >
              申请免费样品评估
            </Button>
            <p className="font-paragraph text-xs max-sm:text-xs md:text-sm text-muted-gray-foreground text-center max-w-2xl leading-[1.5]">
              * 免费样品需经经销商资质审核，样品型号与数量由双方沟通后确定。
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- COMPANY & SUPPLY CAPABILITY --- */}
      <section id="company" className="relative w-full py-16 max-sm:py-12 sm:py-20 md:py-32 bg-background">
        <div className="max-w-[100rem] mx-auto px-4 max-sm:px-4 sm:px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-12 max-sm:mb-10 sm:mb-20"
          >
            <h2 className="font-heading text-2xl max-sm:text-2xl sm:text-3xl md:text-4xl md:text-5xl text-foreground mb-3 max-sm:mb-3 sm:mb-4 leading-[1.2]">
              公司实力、<span className="text-primary">产品展示</span>与供货能力
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-sm:gap-4 sm:gap-6 md:gap-8">
            {[
              { title: '工厂与生产线', desc: '现代化生产线，稳定的生产与交付能力', image: 'https://static.wixstatic.com/media/556c5c_35ab86ea4b674d54a597438efd805d7e~mv2.png' },
              { title: '产品展示间', desc: '产品系列集中展示，方便选品与样品确认', image: 'https://static.wixstatic.com/media/556c5c_45196851bba147288f733a9256fc8b92~mv2.png' },
              { title: '仓库与库存', desc: '完善的库存管理，支持稳定供货与及时补货', image: 'https://static.wixstatic.com/media/556c5c_e15fa405088f43b9930bbc0f26594e70~mv2.png' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative h-64 max-sm:h-64 sm:h-72 md:h-80 overflow-hidden border border-muted-gray/20"
              >
                <Image 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  width={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 max-sm:p-4 sm:p-6 md:p-8">
                  <h3 className="font-heading text-lg max-sm:text-lg sm:text-xl md:text-2xl text-foreground mb-1 max-sm:mb-1 sm:mb-2">{item.title}</h3>
                  <p className="font-paragraph text-sm max-sm:text-sm text-foreground/70 leading-[1.4]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 max-sm:mt-8 sm:mt-12 text-center"
          >
            <p className="font-heading text-lg max-sm:text-lg sm:text-xl text-primary tracking-wide">我们正在寻找首批泰国市场合作伙伴。</p>
          </motion.div>
        </div>
      </section>

      {/* --- IDEAL DISTRIBUTOR & APPLICATION FORM (SPLIT LAYOUT) --- */}
      <section id="application-section" className="relative w-full bg-secondary/30 border-t border-muted-gray/20">
        <div className="grid grid-cols-1 max-sm:grid-cols-1 lg:grid-cols-2">
          
          {/* Left Side: Ideal Distributor */}
          <div className="p-6 max-sm:p-4 sm:p-12 md:p-20 lg:p-32 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-muted-gray/20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading text-2xl max-sm:text-2xl sm:text-3xl md:text-4xl text-foreground mb-8 max-sm:mb-8 sm:mb-12">
                哪些合作伙伴<span className="text-primary">适合申请？</span>
              </h2>
              
              <div className="space-y-8 max-sm:space-y-8 sm:space-y-12">
                <div>
                  <h3 className="font-heading text-lg max-sm:text-lg sm:text-xl text-foreground mb-4 max-sm:mb-4 sm:mb-6 flex items-center gap-2">
                    <CheckCircle className="text-green-500 w-6 h-6" /> 适合申请
                  </h3>
                  <ul className="space-y-2 max-sm:space-y-2 sm:space-y-4 font-paragraph text-foreground/80">
                    {['电动工具经销商', '五金店/建材店', '工业用品供应商', '电商卖家', '批发商', '拥有区域渠道的公司'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm max-sm:text-sm sm:text-base">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-heading text-lg max-sm:text-lg sm:text-xl text-foreground mb-4 max-sm:mb-4 sm:mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-sm font-bold">X</div> 暂不适合
                  </h3>
                  <ul className="space-y-2 max-sm:space-y-2 sm:space-y-4 font-paragraph text-foreground/60">
                    {['仅希望购买个人试用品', '没有相关销售渠道', '无法提供真实经营信息', '不接受核心产品测试反馈'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm max-sm:text-sm sm:text-base">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-gray"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Application Form */}
          <div id="application" className="p-6 max-sm:p-4 sm:p-12 md:p-20 lg:p-32 bg-background relative overflow-hidden">
            <div className="industrial-noise"></div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-md mx-auto lg:mx-0"
            >
              <h2 className="font-heading text-2xl max-sm:text-2xl sm:text-3xl md:text-4xl text-foreground mb-2 max-sm:mb-2 sm:mb-4">
                申请成为<span className="text-primary">Locanex经销商</span>
              </h2>
              <p className="font-paragraph text-foreground/60 mb-6 max-sm:mb-6 sm:mb-10 text-sm max-sm:text-sm sm:text-base">填写基本信息，获取产品资料与评估资格。</p>

              {/* Step Indicator */}
              <div className="flex items-center mb-8 max-sm:mb-8 sm:mb-10">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${applicationStep >= 1 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>1</div>
                <div className="font-paragraph text-xs max-sm:text-xs sm:text-sm ml-3 mr-4 text-foreground/80">步骤 1: 基本信息</div>
                <div className={`flex-grow h-px ${applicationStep >= 2 ? 'bg-primary' : 'bg-muted-gray/30'} transition-colors`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ml-4 ${applicationStep >= 2 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>2</div>
                <div className="font-paragraph text-xs max-sm:text-xs sm:text-sm ml-3 text-foreground/80">步骤 2: 联系方式</div>
              </div>

              <div className="bg-secondary/20 border border-muted-gray/20 p-4 max-sm:p-4 sm:p-8">
                {applicationStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 max-sm:space-y-4 sm:space-y-6"
                  >
                    <div className="space-y-1 max-sm:space-y-1 sm:space-y-2">
                      <Label htmlFor="companyName" className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80">公司名称 *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-10 max-sm:h-10 sm:h-12 text-sm max-sm:text-sm"
                        placeholder="请输入公司全称"
                      />
                    </div>

                    <div className="space-y-1 max-sm:space-y-1 sm:space-y-2">
                      <Label htmlFor="contactPersonName" className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80">联系人姓名 *</Label>
                      <Input
                        id="contactPersonName"
                        value={formData.contactPersonName}
                        onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                        className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-10 max-sm:h-10 sm:h-12 text-sm max-sm:text-sm"
                        placeholder="请输入联系人姓名"
                      />
                    </div>

                    <div className="space-y-1 max-sm:space-y-1 sm:space-y-2">
                      <Label htmlFor="companyType" className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80">公司类型 *</Label>
                      <Select value={formData.companyType} onValueChange={(value) => handleInputChange('companyType', value)}>
                        <SelectTrigger className="bg-background border-muted-gray/30 text-foreground focus:ring-primary rounded-none h-10 max-sm:h-10 sm:h-12 text-sm max-sm:text-sm">
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
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-sm max-sm:text-sm py-3 max-sm:py-3 sm:py-6 h-auto rounded-none mt-3 max-sm:mt-3 sm:mt-4"
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
                    className="space-y-4 max-sm:space-y-4 sm:space-y-6"
                  >
                    <div className="space-y-1 max-sm:space-y-1 sm:space-y-2">
                      <Label htmlFor="contactPhone" className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80">联系电话 *</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-10 max-sm:h-10 sm:h-12 text-sm max-sm:text-sm"
                        placeholder="请输入联系电话"
                      />
                    </div>

                    <div className="space-y-1 max-sm:space-y-1 sm:space-y-2">
                      <Label htmlFor="email" className="font-paragraph text-xs max-sm:text-xs sm:text-sm text-foreground/80">电子邮箱 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-10 max-sm:h-10 sm:h-12 text-sm max-sm:text-sm"
                        placeholder="请输入电子邮箱"
                      />
                    </div>

                    <div className="flex gap-2 max-sm:gap-2 sm:gap-4 mt-4 max-sm:mt-4 sm:mt-4">
                      <Button
                        variant="outline"
                        className="w-1/3 border-muted-gray/50 text-foreground hover:bg-secondary font-heading py-3 max-sm:py-3 sm:py-6 h-auto rounded-none text-xs max-sm:text-xs sm:text-sm"
                        onClick={() => setApplicationStep(1)}
                      >
                        返回
                      </Button>
                      <Button
                        className="w-2/3 bg-primary hover:bg-primary/90 text-primary-foreground font-heading py-3 max-sm:py-3 sm:py-6 h-auto rounded-none text-xs max-sm:text-xs sm:text-sm"
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
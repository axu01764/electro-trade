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
    companyType: '',
    // Step 1: Procurement needs (Desktop/Tablet only)
    toolTypes: [] as string[],
    powerType: '',
    cordlessVoltage: [] as string[],
    cordedPower: [] as string[],
    // Step 2: Company info (Desktop/Tablet only)
    position: '',
    privacyAgreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [capabilityCarouselIndex, setCapabilityCarouselIndex] = useState(0);
  const capabilityCarouselRef = useRef<HTMLDivElement>(null);

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

  // --- CAROUSEL LOGIC ---
  const handleCarouselPrev = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
      scrollCarouselToIndex(carouselIndex - 1);
    }
  };

  const handleCarouselNext = () => {
    if (carouselIndex < products.length - 1) {
      setCarouselIndex(carouselIndex + 1);
      scrollCarouselToIndex(carouselIndex + 1);
    }
  };

  const scrollCarouselToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth - 32;
      const gap = 12;
      const scrollLeft = index * (cardWidth + gap);
      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const scrollCapabilityCarouselToIndex = (index: number) => {
    if (capabilityCarouselRef.current) {
      const containerWidth = capabilityCarouselRef.current.offsetWidth;
      const cardWidth = containerWidth * 0.88;
      const gap = 12;
      const peekWidth = (containerWidth - cardWidth) / 2;
      const scrollLeft = index * (cardWidth + gap) - peekWidth;
      capabilityCarouselRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
    }
  };

  // --- FORM HANDLING LOGIC ---
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => {
      const current = prev[field as keyof typeof prev] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSingleSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleQuestion = (questionId: string) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
    }
  };

  const markQuestionComplete = (questionId: string) => {
    setCompletedQuestions(prev => new Set([...prev, questionId]));
  };

  const isStep1Complete = () => {
    const hasToolTypes = formData.toolTypes.length > 0;
    const hasPowerType = formData.powerType !== '';
    const hasCordlessOrCordedIfNeeded = 
      (formData.powerType === '无绳电动工具' || formData.powerType === '两种都会采购') && formData.cordlessVoltage.length > 0 ||
      (formData.powerType === '有绳电动工具' || formData.powerType === '两种都会采购') && formData.cordedPower.length > 0 ||
      formData.powerType === '无绳电动工具' && formData.cordlessVoltage.length > 0 ||
      formData.powerType === '有绳电动工具' && formData.cordedPower.length > 0;
    return hasToolTypes && hasPowerType && hasCordlessOrCordedIfNeeded;
  };

  const isStep2Complete = () => {
    return formData.contactPersonName && formData.companyName && formData.companyType && 
           formData.position && formData.contactPhone && formData.privacyAgreed;
  };

  const handleNextStep = () => {
    if (applicationStep === 1 && isStep1Complete()) {
      setApplicationStep(2);
      setExpandedQuestion(null);
    }
  };

  const handleBackStep = () => {
    if (applicationStep === 2) {
      setApplicationStep(1);
      setExpandedQuestion(null);
    }
  };

  const handleSubmitApplication = async () => {
    if (!isStep2Complete()) return;
    
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
        companyType: '',
        toolTypes: [],
        powerType: '',
        cordlessVoltage: [],
        cordedPower: [],
        position: '',
        privacyAgreed: false
      });
      setApplicationStep(1);
      setExpandedQuestion(null);
      setCompletedQuestions(new Set());
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
        /* Mobile Carousel Styles */
        @media (max-width: 767px) {
          .product-carousel {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            gap: 12px;
            padding: 0 16px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .product-carousel::-webkit-scrollbar {
            display: none;
          }
          .product-carousel-item {
            flex: 0 0 calc(100% - 36px);
            scroll-snap-align: start;
            scroll-snap-stop: always;
          }
        }
        /* Mobile Capability Carousel Styles */
        @media (max-width: 767px) {
          .capability-carousel {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            gap: 12px;
            padding: 0 16px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .capability-carousel::-webkit-scrollbar {
            display: none;
          }
          .capability-carousel-item {
            flex: 0 0 calc(88% - 3.36px);
            scroll-snap-align: start;
            scroll-snap-stop: always;
          }
        }
      `}</style>
      <Header />
      {/* --- HERO SECTION --- */}
      <section 
        id="hero" 
        className="relative w-full sm:min-h-[680px] md:h-[680px] lg:h-[720px] flex items-center justify-center overflow-hidden bg-black pt-0 sm:pt-24 md:pt-0 max-sm:!relative max-sm:!min-h-[800px] max-sm:!h-auto max-sm:!overflow-hidden max-sm:!pt-0 max-sm:!mt-0"
        style={{
          minHeight: 'auto',
          height: 'auto',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 0,
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            #hero {
              min-height: 800px !important;
              height: auto !important;
              position: relative !important;
              overflow: hidden !important;
              padding-top: 0 !important;
              margin-top: 0 !important;
              background-position: center bottom !important;
              background-size: 100% auto !important;
              background-repeat: no-repeat !important;
            }
          }
        `}</style>
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

        <div 
          className="relative z-10 w-full max-w-[1300px] mx-auto max-sm:px-4 sm:px-6 md:px-12 md:h-full md:flex md:items-center max-sm:!absolute max-sm:!top-[64px] max-sm:!left-0 max-sm:!right-0 max-sm:!bottom-auto max-sm:!w-full max-sm:!h-auto max-sm:!m-0 max-sm:!translate-y-0 max-sm:!px-4 max-sm:!pt-7 max-sm:!pb-0 max-sm:!z-[2]"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            width: '100%',
            height: 'auto',
            margin: 0,
            padding: '32px 16px 0',
            transform: 'none',
            zIndex: 2,
          }}
        >
          {/* Mobile: Top section - Text and CTA | Desktop: Left side ~45% */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="w-full md:w-[45%] flex flex-col justify-start"
          >
            <motion.div variants={fadeUpVariant} className="mb-4 max-sm:mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-none bg-secondary/80 border border-muted-gray/50 backdrop-blur-md w-fit max-sm:text-[10px] max-sm:px-3 max-sm:py-1.5 max-sm:h-7 max-sm:text-[9px] max-sm:leading-none">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse max-sm:w-1.5 max-sm:h-1.5 flex-shrink-0"></span>
              <span className="font-paragraph text-xs sm:text-sm tracking-wider text-foreground/90 uppercase max-sm:whitespace-nowrap">Thailand Dealer Recruitment Program</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="font-heading text-3xl max-sm:text-[30px] sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 max-sm:mb-4 sm:mb-6 max-sm:leading-[1.1] md:leading-[1.2] tracking-tight text-left">
              寻找泰国本地<br />
              <span className="text-primary">电动工具经销商</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="font-paragraph text-sm max-sm:text-[14px] sm:text-base md:text-lg text-foreground/80 mb-5 max-sm:mb-5 sm:mb-8 max-sm:leading-[1.65] md:leading-[1.6] text-left">
              有竞争力的经销价格、稳定供货和市场支持。<br />
              符合条件的经销商可申请免费产品样品。
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-3 max-sm:gap-3 sm:gap-4 items-stretch sm:items-start mb-4 max-sm:mb-4 sm:mb-6 max-sm:w-full">
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

            <motion.p variants={fadeUpVariant} className="font-paragraph text-xs max-sm:text-[10px] text-muted-gray-foreground text-left">
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

      {/* ... keep existing code (all other sections - opportunities, products, differentiation, sample-program, company, FAQ, final-cta) ... */}
      
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

          {/* Right Side: Application Form - Desktop/Tablet Only */}
          <div id="application" className="hidden lg:block p-6 max-sm:p-4 sm:p-12 md:p-20 lg:p-32 bg-background relative overflow-hidden">
            <div className="industrial-noise"></div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-2 sm:mb-4">
                申请成为 Locanex<br /><span className="text-primary">经销商</span>
              </h2>
              <p className="font-paragraph text-foreground/60 mb-8 sm:mb-10 text-sm sm:text-base">
                填写采购需求与公司信息，申请经销商合作与样品评估。
              </p>

              {/* Step Indicator */}
              <div className="flex items-center gap-4 mb-10 sm:mb-12">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${applicationStep >= 1 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>1</div>
                <div className="font-paragraph text-sm text-foreground/80">步骤1：采购需求</div>
                <div className={`flex-grow h-px ${applicationStep >= 2 ? 'bg-primary' : 'bg-muted-gray/30'} transition-colors`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${applicationStep >= 2 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>2</div>
                <div className="font-paragraph text-sm text-foreground/80">步骤2：公司信息</div>
              </div>

              {/* Step 1: Procurement Needs */}
              {applicationStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Question 1: Tool Types */}
                  <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <button
                      onClick={() => toggleQuestion('q1')}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left flex-1">
                        <span className="font-heading text-primary text-sm font-bold">Q1</span>
                        <div className="flex-1">
                          <h3 className="font-heading text-sm sm:text-base text-foreground">您经常采购哪些类型的电动工具？</h3>
                          {completedQuestions.has('q1') && expandedQuestion !== 'q1' && (
                            <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已完成</p>
                          )}
                          {!completedQuestions.has('q1') && expandedQuestion !== 'q1' && (
                            <p className="font-paragraph text-xs text-foreground/60 mt-1">请选择</p>
                          )}
                          {expandedQuestion === 'q1' && formData.toolTypes.length > 0 && (
                            <p className="font-paragraph text-xs text-foreground/70 mt-1">{formData.toolTypes.length} 项已选</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 'q1' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedQuestion === 'q1' && (
                      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                        {['电钻或冲击钻', '电动冲击扳手', '无绳链锯', '电圆锯', '角磨机', '电锤', '电池和充电器', '电动工具配件', '其他'].map(tool => (
                          <label key={tool} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <input
                              type="checkbox"
                              checked={formData.toolTypes.includes(tool)}
                              onChange={() => handleMultiSelect('toolTypes', tool)}
                              className="w-4 h-4 accent-primary"
                            />
                            <span className="font-paragraph text-sm text-foreground">{tool}</span>
                          </label>
                        ))}
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-black font-heading text-sm py-2 h-auto rounded-none mt-4"
                          onClick={() => {
                            if (formData.toolTypes.length > 0) {
                              markQuestionComplete('q1');
                              setExpandedQuestion(null);
                            }
                          }}
                          disabled={formData.toolTypes.length === 0}
                        >
                          确认选择
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Question 2: Power Type */}
                  <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <button
                      onClick={() => toggleQuestion('q2')}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left flex-1">
                        <span className="font-heading text-primary text-sm font-bold">Q2</span>
                        <div className="flex-1">
                          <h3 className="font-heading text-sm sm:text-base text-foreground">您主要采购哪种供电类型的电动工具？</h3>
                          {completedQuestions.has('q2') && expandedQuestion !== 'q2' && (
                            <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已完成</p>
                          )}
                          {!completedQuestions.has('q2') && expandedQuestion !== 'q2' && (
                            <p className="font-paragraph text-xs text-foreground/60 mt-1">请选择</p>
                          )}
                          {expandedQuestion === 'q2' && formData.powerType && (
                            <p className="font-paragraph text-xs text-foreground/70 mt-1">{formData.powerType}</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 'q2' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedQuestion === 'q2' && (
                      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                        {['无绳电动工具', '有绳电动工具', '两种都会采购'].map(type => (
                          <label key={type} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <input
                              type="radio"
                              name="powerType"
                              checked={formData.powerType === type}
                              onChange={() => {
                                handleSingleSelect('powerType', type);
                                markQuestionComplete('q2');
                                setExpandedQuestion(null);
                              }}
                              className="w-4 h-4 accent-primary"
                            />
                            <span className="font-paragraph text-sm text-foreground">{type}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Question 3: Cordless Voltage - Conditional */}
                  {(formData.powerType === '无绳电动工具' || formData.powerType === '两种都会采购') && (
                    <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                      <button
                        onClick={() => toggleQuestion('q3')}
                        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 text-left flex-1">
                          <span className="font-heading text-primary text-sm font-bold">Q3</span>
                          <div className="flex-1">
                            <h3 className="font-heading text-sm sm:text-base text-foreground">您经常采购的无绳工具电压平台是？</h3>
                            {completedQuestions.has('q3') && expandedQuestion !== 'q3' && (
                              <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已完成</p>
                            )}
                            {!completedQuestions.has('q3') && expandedQuestion !== 'q3' && (
                              <p className="font-paragraph text-xs text-foreground/60 mt-1">请选择</p>
                            )}
                            {expandedQuestion === 'q3' && formData.cordlessVoltage.length > 0 && (
                              <p className="font-paragraph text-xs text-foreground/70 mt-1">{formData.cordlessVoltage.length} 项已选</p>
                            )}
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 'q3' ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedQuestion === 'q3' && (
                        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                          {['12V及以下', '16.8V', '18V', '20V或21V', '36V或40V及以上', '根据具体产品选择', '不确定'].map(voltage => (
                            <label key={voltage} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                              <input
                                type="checkbox"
                                checked={formData.cordlessVoltage.includes(voltage)}
                                onChange={() => handleMultiSelect('cordlessVoltage', voltage)}
                                className="w-4 h-4 accent-primary"
                              />
                              <span className="font-paragraph text-sm text-foreground">{voltage}</span>
                            </label>
                          ))}
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 text-black font-heading text-sm py-2 h-auto rounded-none mt-4"
                            onClick={() => {
                              if (formData.cordlessVoltage.length > 0) {
                                markQuestionComplete('q3');
                                setExpandedQuestion(null);
                              }
                            }}
                            disabled={formData.cordlessVoltage.length === 0}
                          >
                            确认选择
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question 4: Corded Power - Conditional */}
                  {(formData.powerType === '有绳电动工具' || formData.powerType === '两种都会采购') && (
                    <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                      <button
                        onClick={() => toggleQuestion('q4')}
                        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 text-left flex-1">
                          <span className="font-heading text-primary text-sm font-bold">Q4</span>
                          <div className="flex-1">
                            <h3 className="font-heading text-sm sm:text-base text-foreground">您经常采购的有绳工具功率范围是？</h3>
                            {completedQuestions.has('q4') && expandedQuestion !== 'q4' && (
                              <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已完成</p>
                            )}
                            {!completedQuestions.has('q4') && expandedQuestion !== 'q4' && (
                              <p className="font-paragraph text-xs text-foreground/60 mt-1">请选择</p>
                            )}
                            {expandedQuestion === 'q4' && formData.cordedPower.length > 0 && (
                              <p className="font-paragraph text-xs text-foreground/70 mt-1">{formData.cordedPower.length} 项已选</p>
                            )}
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 'q4' ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedQuestion === 'q4' && (
                        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                          {['600W及以下', '601W–1000W', '1001W–1500W', '1500W以上', '根据具体产品选择', '不确定'].map(power => (
                            <label key={power} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                              <input
                                type="checkbox"
                                checked={formData.cordedPower.includes(power)}
                                onChange={() => handleMultiSelect('cordedPower', power)}
                                className="w-4 h-4 accent-primary"
                              />
                              <span className="font-paragraph text-sm text-foreground">{power}</span>
                            </label>
                          ))}
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 text-black font-heading text-sm py-2 h-auto rounded-none mt-4"
                            onClick={() => {
                              if (formData.cordedPower.length > 0) {
                                markQuestionComplete('q4');
                                setExpandedQuestion(null);
                              }
                            }}
                            disabled={formData.cordedPower.length === 0}
                          >
                            确认选择
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next Button */}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-black font-heading text-sm py-3 h-auto rounded-none mt-6 sm:mt-8"
                    onClick={handleNextStep}
                    disabled={!isStep1Complete()}
                  >
                    下一步：填写公司信息
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Company Info */}
              {applicationStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Question 1: Contact Name */}
                  <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <button
                      onClick={() => toggleQuestion('s1')}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left flex-1">
                        <span className="font-heading text-primary text-sm font-bold">Q1</span>
                        <div className="flex-1">
                          <h3 className="font-heading text-sm sm:text-base text-foreground">联系人姓名</h3>
                          {completedQuestions.has('s1') && expandedQuestion !== 's1' && (
                            <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已填写</p>
                          )}
                          {!completedQuestions.has('s1') && expandedQuestion !== 's1' && (
                            <p className="font-paragraph text-xs text-foreground/60 mt-1">请填写</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 's1' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedQuestion === 's1' && (
                      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                        <Input
                          value={formData.contactPersonName}
                          onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                          className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-10 sm:h-12 text-sm"
                          placeholder="请输入联系人姓名"
                        />
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-black font-heading text-sm py-2 h-auto rounded-none"
                          onClick={() => {
                            if (formData.contactPersonName) {
                              markQuestionComplete('s1');
                              setExpandedQuestion(null);
                            }
                          }}
                          disabled={!formData.contactPersonName}
                        >
                          确认
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Question 2: Company Name */}
                  <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <button
                      onClick={() => toggleQuestion('s2')}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left flex-1">
                        <span className="font-heading text-primary text-sm font-bold">Q2</span>
                        <div className="flex-1">
                          <h3 className="font-heading text-sm sm:text-base text-foreground">公司或店铺名称</h3>
                          {completedQuestions.has('s2') && expandedQuestion !== 's2' && (
                            <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已填写</p>
                          )}
                          {!completedQuestions.has('s2') && expandedQuestion !== 's2' && (
                            <p className="font-paragraph text-xs text-foreground/60 mt-1">请填写</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 's2' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedQuestion === 's2' && (
                      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                        <Input
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-10 sm:h-12 text-sm"
                          placeholder="请输入公司或店铺名称"
                        />
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-black font-heading text-sm py-2 h-auto rounded-none"
                          onClick={() => {
                            if (formData.companyName) {
                              markQuestionComplete('s2');
                              setExpandedQuestion(null);
                            }
                          }}
                          disabled={!formData.companyName}
                        >
                          确认
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Question 3: Company Type */}
                  <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <button
                      onClick={() => toggleQuestion('s3')}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left flex-1">
                        <span className="font-heading text-primary text-sm font-bold">Q3</span>
                        <div className="flex-1">
                          <h3 className="font-heading text-sm sm:text-base text-foreground">您的公司属于哪种类型？</h3>
                          {completedQuestions.has('s3') && expandedQuestion !== 's3' && (
                            <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已完成</p>
                          )}
                          {!completedQuestions.has('s3') && expandedQuestion !== 's3' && (
                            <p className="font-paragraph text-xs text-foreground/60 mt-1">请选择</p>
                          )}
                          {expandedQuestion === 's3' && formData.companyType && (
                            <p className="font-paragraph text-xs text-foreground/70 mt-1">{formData.companyType}</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 's3' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedQuestion === 's3' && (
                      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                        {['电动工具经销商', '五金工具店', '建材经销商', '工业用品供应商', '建筑工具批发商', '电商平台卖家', '工程或施工公司', '其他'].map(type => (
                          <label key={type} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <input
                              type="radio"
                              name="companyType"
                              checked={formData.companyType === type}
                              onChange={() => {
                                handleSingleSelect('companyType', type);
                                markQuestionComplete('s3');
                                setExpandedQuestion(null);
                              }}
                              className="w-4 h-4 accent-primary"
                            />
                            <span className="font-paragraph text-sm text-foreground">{type}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Question 4: Position */}
                  <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <button
                      onClick={() => toggleQuestion('s4')}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left flex-1">
                        <span className="font-heading text-primary text-sm font-bold">Q4</span>
                        <div className="flex-1">
                          <h3 className="font-heading text-sm sm:text-base text-foreground">您在公司中的身份或职位是？</h3>
                          {completedQuestions.has('s4') && expandedQuestion !== 's4' && (
                            <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已完成</p>
                          )}
                          {!completedQuestions.has('s4') && expandedQuestion !== 's4' && (
                            <p className="font-paragraph text-xs text-foreground/60 mt-1">请选择</p>
                          )}
                          {expandedQuestion === 's4' && formData.position && (
                            <p className="font-paragraph text-xs text-foreground/70 mt-1">{formData.position}</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 's4' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedQuestion === 's4' && (
                      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                        {['公司老板或店主', '采购负责人', '渠道负责人', '销售负责人', '电商运营负责人', '其他'].map(pos => (
                          <label key={pos} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <input
                              type="radio"
                              name="position"
                              checked={formData.position === pos}
                              onChange={() => {
                                handleSingleSelect('position', pos);
                                markQuestionComplete('s4');
                                setExpandedQuestion(null);
                              }}
                              className="w-4 h-4 accent-primary"
                            />
                            <span className="font-paragraph text-sm text-foreground">{pos}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Question 5: Phone */}
                  <div className="bg-black/40 border border-muted-gray/30 rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <button
                      onClick={() => toggleQuestion('s5')}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left flex-1">
                        <span className="font-heading text-primary text-sm font-bold">Q5</span>
                        <div className="flex-1">
                          <h3 className="font-heading text-sm sm:text-base text-foreground">手机号码</h3>
                          {completedQuestions.has('s5') && expandedQuestion !== 's5' && (
                            <p className="font-paragraph text-xs text-green-500 mt-1">✓ 已填写</p>
                          )}
                          {!completedQuestions.has('s5') && expandedQuestion !== 's5' && (
                            <p className="font-paragraph text-xs text-foreground/60 mt-1">请填写</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedQuestion === 's5' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedQuestion === 's5' && (
                      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/20 border-t border-muted-gray/20 space-y-3">
                        <Input
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-10 sm:h-12 text-sm"
                          placeholder="请输入手机号码"
                          type="tel"
                        />
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-black font-heading text-sm py-2 h-auto rounded-none"
                          onClick={() => {
                            if (formData.contactPhone) {
                              markQuestionComplete('s5');
                              setExpandedQuestion(null);
                            }
                          }}
                          disabled={!formData.contactPhone}
                        >
                          确认
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Privacy Agreement */}
                  <div className="bg-black/40 border border-muted-gray/30 rounded-lg p-4 sm:p-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.privacyAgreed}
                        onChange={(e) => handleInputChange('privacyAgreed', e.target.checked)}
                        className="w-4 h-4 accent-primary mt-1 flex-shrink-0"
                      />
                      <span className="font-paragraph text-xs sm:text-sm text-foreground/80">
                        我同意公司根据隐私政策收集和使用我的信息，用于经销商申请评估、联系、样品安排、市场调研和合作沟通。
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <Button
                      variant="outline"
                      className="flex-1 border-muted-gray/50 text-foreground hover:bg-secondary font-heading py-3 h-auto rounded-none text-sm"
                      onClick={handleBackStep}
                    >
                      返回上一步
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-black font-heading py-3 h-auto rounded-none text-sm"
                      onClick={handleSubmitApplication}
                      disabled={!isStep2Complete() || isSubmitting}
                    >
                      {isSubmitting ? '提交中...' : '提交申请并获取经销商方案'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Mobile Form - Keep existing version */}
          <div id="application" className="lg:hidden p-6 max-sm:p-4 sm:p-12 md:p-20 bg-background relative overflow-hidden">
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
                      onClick={() => setApplicationStep(2)}
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

      <Footer />
    </div>
  );
}

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
  const [desktopFormStep, setDesktopFormStep] = useState(1);
  const [desktopFormData, setDesktopFormData] = useState({
    toolTypes: [] as string[],
    powerType: '',
    cordlessVoltage: [] as string[],
    cordedPower: [] as string[],
    contactPersonName: '',
    companyName: '',
    companyType: '',
    jobTitle: '',
    contactPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesktopSubmitting, setIsDesktopSubmitting] = useState(false);
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

  // --- DESKTOP FORM HANDLING LOGIC ---
  const handleDesktopFormChange = (field: string, value: string | string[]) => {
    setDesktopFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDesktopToolTypeChange = (toolType: string) => {
    setDesktopFormData(prev => ({
      ...prev,
      toolTypes: prev.toolTypes.includes(toolType)
        ? prev.toolTypes.filter(t => t !== toolType)
        : [...prev.toolTypes, toolType]
    }));
  };

  const handleDesktopCordlessVoltageChange = (voltage: string) => {
    setDesktopFormData(prev => ({
      ...prev,
      cordlessVoltage: prev.cordlessVoltage.includes(voltage)
        ? prev.cordlessVoltage.filter(v => v !== voltage)
        : [...prev.cordlessVoltage, voltage]
    }));
  };

  const handleDesktopCordedPowerChange = (power: string) => {
    setDesktopFormData(prev => ({
      ...prev,
      cordedPower: prev.cordedPower.includes(power)
        ? prev.cordedPower.filter(p => p !== power)
        : [...prev.cordedPower, power]
    }));
  };

  const handleDesktopNextStep = () => {
    if (desktopFormStep === 1 && desktopFormData.toolTypes.length > 0 && desktopFormData.powerType) {
      setDesktopFormStep(2);
    }
  };

  const handleDesktopPrevStep = () => {
    if (desktopFormStep === 2) {
      setDesktopFormStep(1);
    }
  };

  const handleDesktopSubmitApplication = async () => {
    setIsDesktopSubmitting(true);
    try {
      await BaseCrudService.create<Distributorapplications>('distributorapplications', {
        _id: crypto.randomUUID(),
        companyName: desktopFormData.companyName,
        contactPersonName: desktopFormData.contactPersonName,
        contactPhone: desktopFormData.contactPhone,
        email: desktopFormData.contactPersonName,
        companyType: desktopFormData.companyType
      });
      
      setDesktopFormData({
        toolTypes: [],
        powerType: '',
        cordlessVoltage: [],
        cordedPower: [],
        contactPersonName: '',
        companyName: '',
        companyType: '',
        jobTitle: '',
        contactPhone: '',
      });
      setDesktopFormStep(1);
      alert('申请已成功提交！我们的团队将在48小时内与您联系。');
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('提交失败，请稍后重试。');
    } finally {
      setIsDesktopSubmitting(false);
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
      {/* ... keep existing code (hero, opportunities, products, differentiation, sample-program, company sections) ... */}
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
            
            {/* MOBILE FORM - Only visible on screens < 768px */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-md mx-auto lg:mx-0 md:hidden"
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

            {/* DESKTOP/TABLET FORM - Only visible on screens >= 768px */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-2xl mx-auto lg:mx-0 hidden md:block"
            >
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-2 sm:mb-4">
                申请成为<span className="text-primary">Locanex经销商</span>
              </h2>
              <p className="font-paragraph text-foreground/60 mb-6 sm:mb-10 text-sm sm:text-base">填写采购需求和公司信息，获取产品资料与评估资格。</p>

              {/* Step Indicator */}
              <div className="flex items-center mb-8 sm:mb-10">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${desktopFormStep >= 1 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>1</div>
                <div className="font-paragraph text-xs sm:text-sm ml-3 mr-4 text-foreground/80">第1步，共2步</div>
                <div className={`flex-grow h-px ${desktopFormStep >= 2 ? 'bg-primary' : 'bg-muted-gray/30'} transition-colors`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ml-4 ${desktopFormStep >= 2 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>2</div>
                <div className="font-paragraph text-xs sm:text-sm ml-3 text-foreground/80">第2步，共2步</div>
              </div>

              <div className="bg-secondary/20 border border-muted-gray/20 p-8">
                {desktopFormStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="font-heading text-lg text-foreground mb-6">告诉我们您的采购需求</h3>
                      
                      {/* Question 1: Tool Types */}
                      <div className="mb-8">
                        <Label className="font-paragraph text-sm text-foreground/80 mb-4 block">您经常采购哪些类型的电动工具？ *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {['电钻或冲击钻', '电动冲击扳手', '无绳链锯', '电圆锯', '角磨机', '电锤', '电池和充电器', '电动工具配件', '其他'].map((tool) => (
                            <button
                              key={tool}
                              onClick={() => handleDesktopToolTypeChange(tool)}
                              className={`p-3 border rounded-lg text-sm font-paragraph text-left transition-all ${
                                desktopFormData.toolTypes.includes(tool)
                                  ? 'border-primary bg-primary/10 text-foreground'
                                  : 'border-muted-gray/30 bg-background text-foreground/70 hover:border-muted-gray/50'
                              }`}
                            >
                              {tool}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question 2: Power Type */}
                      <div className="mb-8">
                        <Label className="font-paragraph text-sm text-foreground/80 mb-4 block">您主要采购哪种供电类型的电动工具？ *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {['无绳电动工具', '有绳电动工具', '两种都会采购'].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleDesktopFormChange('powerType', type)}
                              className={`p-3 border rounded-lg text-sm font-paragraph text-left transition-all ${
                                desktopFormData.powerType === type
                                  ? 'border-primary bg-primary/10 text-foreground'
                                  : 'border-muted-gray/30 bg-background text-foreground/70 hover:border-muted-gray/50'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question 3: Cordless Voltage */}
                      {(desktopFormData.powerType === '无绳电动工具' || desktopFormData.powerType === '两种都会采购') && (
                        <div className="mb-8">
                          <Label className="font-paragraph text-sm text-foreground/80 mb-4 block">您经常采购的无绳工具电压平台是？</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {['12V及以下', '16.8V', '18V', '20V或21V', '36V或40V及以上', '根据具体产品选择', '不确定'].map((voltage) => (
                              <button
                                key={voltage}
                                onClick={() => handleDesktopCordlessVoltageChange(voltage)}
                                className={`p-3 border rounded-lg text-sm font-paragraph text-left transition-all ${
                                  desktopFormData.cordlessVoltage.includes(voltage)
                                    ? 'border-primary bg-primary/10 text-foreground'
                                    : 'border-muted-gray/30 bg-background text-foreground/70 hover:border-muted-gray/50'
                                }`}
                              >
                                {voltage}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Question 4: Corded Power */}
                      {(desktopFormData.powerType === '有绳电动工具' || desktopFormData.powerType === '两种都会采购') && (
                        <div className="mb-8">
                          <Label className="font-paragraph text-sm text-foreground/80 mb-4 block">您经常采购的有绳工具功率范围是？</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {['600W及以下', '601W–1000W', '1001W–1500W', '1500W以上', '根据具体产品选择', '不确定'].map((power) => (
                              <button
                                key={power}
                                onClick={() => handleDesktopCordedPowerChange(power)}
                                className={`p-3 border rounded-lg text-sm font-paragraph text-left transition-all ${
                                  desktopFormData.cordedPower.includes(power)
                                    ? 'border-primary bg-primary/10 text-foreground'
                                    : 'border-muted-gray/30 bg-background text-foreground/70 hover:border-muted-gray/50'
                                }`}
                              >
                                {power}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-sm py-6 h-auto rounded-none mt-6"
                      onClick={handleDesktopNextStep}
                      disabled={desktopFormData.toolTypes.length === 0 || !desktopFormData.powerType}
                    >
                      下一步：填写公司信息
                    </Button>
                  </motion.div>
                )}

                {desktopFormStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="font-heading text-lg text-foreground mb-6">公司身份与联系方式</h3>
                      
                      {/* Question 1: Contact Person Name */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label className="font-paragraph text-sm text-foreground/80">联系人姓名 *</Label>
                          <Input
                            value={desktopFormData.contactPersonName}
                            onChange={(e) => handleDesktopFormChange('contactPersonName', e.target.value)}
                            className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-12 text-sm"
                            placeholder="请输入联系人姓名"
                          />
                        </div>

                        {/* Question 2: Company Name */}
                        <div className="space-y-2">
                          <Label className="font-paragraph text-sm text-foreground/80">公司或店铺名称 *</Label>
                          <Input
                            value={desktopFormData.companyName}
                            onChange={(e) => handleDesktopFormChange('companyName', e.target.value)}
                            className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-12 text-sm"
                            placeholder="请输入公司全称"
                          />
                        </div>
                      </div>

                      {/* Question 3: Company Type */}
                      <div className="mb-6">
                        <Label className="font-paragraph text-sm text-foreground/80 mb-4 block">您的公司属于哪种类型？ *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {['电动工具经销商', '五金工具店', '建材经销商', '工业用品供应商', '建筑工具批发商', '电商平台卖家', '工程或施工公司', '其他'].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleDesktopFormChange('companyType', type)}
                              className={`p-3 border rounded-lg text-sm font-paragraph text-left transition-all ${
                                desktopFormData.companyType === type
                                  ? 'border-primary bg-primary/10 text-foreground'
                                  : 'border-muted-gray/30 bg-background text-foreground/70 hover:border-muted-gray/50'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question 4: Job Title */}
                      <div className="mb-6">
                        <Label className="font-paragraph text-sm text-foreground/80 mb-4 block">您在公司中的身份或职位是？ *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {['公司老板或店主', '采购负责人', '渠道负责人', '销售负责人', '电商运营负责人', '其他'].map((title) => (
                            <button
                              key={title}
                              onClick={() => handleDesktopFormChange('jobTitle', title)}
                              className={`p-3 border rounded-lg text-sm font-paragraph text-left transition-all ${
                                desktopFormData.jobTitle === title
                                  ? 'border-primary bg-primary/10 text-foreground'
                                  : 'border-muted-gray/30 bg-background text-foreground/70 hover:border-muted-gray/50'
                              }`}
                            >
                              {title}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question 5: Phone Number */}
                      <div className="space-y-2">
                        <Label className="font-paragraph text-sm text-foreground/80">手机号码 *</Label>
                        <Input
                          value={desktopFormData.contactPhone}
                          onChange={(e) => handleDesktopFormChange('contactPhone', e.target.value)}
                          className="bg-background border-muted-gray/30 text-foreground focus-visible:ring-primary rounded-none h-12 text-sm"
                          placeholder="请输入手机号码"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <Button
                        variant="outline"
                        className="flex-1 border-muted-gray/50 text-foreground hover:bg-secondary font-heading py-6 h-auto rounded-none text-sm"
                        onClick={handleDesktopPrevStep}
                      >
                        返回上一步
                      </Button>
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-heading py-6 h-auto rounded-none text-sm"
                        onClick={handleDesktopSubmitApplication}
                        disabled={!desktopFormData.contactPersonName || !desktopFormData.companyName || !desktopFormData.companyType || !desktopFormData.jobTitle || !desktopFormData.contactPhone || isDesktopSubmitting}
                      >
                        {isDesktopSubmitting ? '提交中...' : '提交申请并获取经销商方案'}
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

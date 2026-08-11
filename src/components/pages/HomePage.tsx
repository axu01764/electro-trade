// HPI 1.7-V
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coreproducts, Distributorapplications, Faq } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock, Globe,
  MessageCircle,
  Package,
  Settings,
  TrendingUp,
  Zap
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type ApplicationFormData = {
  companyName: string;
  contactPersonName: string;
  contactPhone: string;
  email: string;
  companyType: string;
  purchaseToolTypes: string[];
  purchasePreference: string;
  cordlessVoltagePlatforms: string[];
  cordedPowerRange: string;
  applicantRole: string;
  privacyConsent: boolean;
};

type FormQuestionProps = {
  value: string;
  number: number;
  title: string;
  complete: boolean;
  incompleteLabel?: string;
  children: React.ReactNode;
};

const purchaseToolOptions = [
  '冲击钻/电钻',
  '冲击扳手',
  '角磨机',
  '电圆锯',
  '电链锯',
  '电锤/电镐',
  '砂光机/抛光机',
  '其他电动工具'
];

const purchasePreferenceOptions = ['无绳工具为主', '有绳工具为主', '无绳与有绳都采购'];
const cordlessVoltageOptions = ['12V', '16V', '18V', '20V', '21V', '36V', '40V', '其他'];
const cordedPowerOptions = ['600W及以下', '601W–1000W', '1001W–1500W', '1501W–2000W', '2000W以上'];
const companyTypeOptions = [
  '电动工具经销商',
  '五金店/建材店',
  '工业用品供应商',
  '电商平台卖家',
  '批发商',
  '建筑工具供应商',
  '拥有区域渠道的公司',
  '其他'
];
const applicantRoleOptions = ['公司负责人/老板', '采购负责人', '销售负责人', '店铺经理', '电商运营负责人', '其他'];
const LINE_CONTACT_URL = 'https://line.me/ti/p/G_saKyMNTQ';
const MOBILE_PRODUCT_CARD_COUNT = 6;

// Upload the approved MT2081 product image to Wix Media, then paste its
// https://static.wixstatic.com/media/... URL between the quotation marks.
const MT2081_IMAGE_URL = 'https://static.wixstatic.com/media/556c5c_54b8f299430a4095bbc35c1e25c5f3ba~mv2.png';

const createInitialFormData = (): ApplicationFormData => ({
  companyName: '',
  contactPersonName: '',
  contactPhone: '',
  email: '',
  companyType: '',
  purchaseToolTypes: [],
  purchasePreference: '',
  cordlessVoltagePlatforms: [],
  cordedPowerRange: '',
  applicantRole: '',
  privacyConsent: false
});

function FormQuestion({
  value,
  number,
  title,
  complete,
  incompleteLabel = '请选择',
  children
}: FormQuestionProps) {
  return (
    <AccordionItem value={value} className="border border-muted-gray/25 bg-background/40 px-4 sm:px-5">
      <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
        <div className="flex min-w-0 flex-1 items-start gap-3 pr-2 sm:items-center sm:pr-3">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center border text-[11px] font-heading ${complete ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
            {String(number).padStart(2, '0')}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-paragraph text-sm font-medium leading-5 text-foreground">{title}</span>
            <span className={`mt-1 block text-[11px] sm:hidden ${complete ? 'text-green-400' : 'text-foreground/45'}`}>
              {complete ? '✓ 已完成' : incompleteLabel}
            </span>
          </span>
          <span className={`ml-auto hidden shrink-0 text-[11px] sm:block ${complete ? 'text-green-400' : 'text-foreground/45'}`}>
            {complete ? '✓ 已完成' : incompleteLabel}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-5 pt-1">{children}</AccordionContent>
    </AccordionItem>
  );
}

type ChoiceButtonProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ChoiceButton({ selected, onClick, children }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-11 border px-3 py-2 text-left font-paragraph text-sm transition-colors ${selected ? 'border-primary bg-primary/15 text-foreground' : 'border-muted-gray/30 bg-secondary/20 text-foreground/75 hover:border-primary/60 hover:text-foreground'}`}
    >
      <span className="flex items-center gap-2">
        <span className={`flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] ${selected ? 'border-primary bg-primary text-black' : 'border-muted-gray/50'}`}>
          {selected ? '✓' : ''}
        </span>
        {children}
      </span>
    </button>
  );
}

export default function HomePage() {
  // --- CANONICAL DATA SOURCES & STATE ---
  const [products, setProducts] = useState<Coreproducts[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [applicationStep, setApplicationStep] = useState(1);
  const [openFormQuestion, setOpenFormQuestion] = useState('');
  const [formData, setFormData] = useState<ApplicationFormData>(createInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [capabilityCarouselIndex, setCapabilityCarouselIndex] = useState(0);
  const capabilityCarouselRef = useRef<HTMLDivElement>(null);

  // --- DATA FETCHING LOGIC ---
  useEffect(() => {
    loadProducts();
    loadFaqs();
  }, []);

  // Keep every LINE consultation CTA consistent across Header, HomePage and Footer.
  // Event delegation also covers the responsive desktop, tablet and mobile variants.
  useEffect(() => {
    const handleLineContactClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactiveElement = target.closest('button, a');
      if (!interactiveElement) return;

      const normalizedLabel = (interactiveElement.textContent || '')
        .replace(/\s+/g, '')
        .toLowerCase();

      if (!normalizedLabel.includes('line咨询')) return;

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(LINE_CONTACT_URL);
    };

    document.addEventListener('click', handleLineContactClick, true);
    return () => document.removeEventListener('click', handleLineContactClick, true);
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
    if (carouselIndex < MOBILE_PRODUCT_CARD_COUNT - 1) {
      setCarouselIndex(carouselIndex + 1);
      scrollCarouselToIndex(carouselIndex + 1);
    }
  };

  const scrollCarouselToIndex = (index: number) => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.querySelector<HTMLElement>('.product-carousel-item');
      const cardWidth = firstCard?.offsetWidth ?? carouselRef.current.offsetWidth - 32;
      const gap = 12;
      const scrollLeft = index * (cardWidth + gap);
      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Keep the counter and dots synchronized when the visitor swipes by touch.
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;

    const firstCard = carouselRef.current.querySelector<HTMLElement>('.product-carousel-item');
    const cardWidth = firstCard?.offsetWidth ?? carouselRef.current.offsetWidth - 32;
    const index = Math.round(carouselRef.current.scrollLeft / (cardWidth + 12));
    const boundedIndex = Math.min(MOBILE_PRODUCT_CARD_COUNT - 1, Math.max(0, index));

    setCarouselIndex((currentIndex) => currentIndex === boundedIndex ? currentIndex : boundedIndex);
  };

  const scrollCapabilityCarouselToIndex = (index: number) => {
    if (capabilityCarouselRef.current) {
      const containerWidth = capabilityCarouselRef.current.offsetWidth;
      const cardWidth = containerWidth * 0.88; // 88% of container
      const gap = 12;
      const peekWidth = (containerWidth - cardWidth) / 2; // Space for peek
      const scrollLeft = index * (cardWidth + gap) - peekWidth;
      capabilityCarouselRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
    }
  };

  // --- FORM HANDLING LOGIC ---
  const handleInputChange = (field: keyof ApplicationFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (
    field: 'purchaseToolTypes' | 'cordlessVoltagePlatforms',
    value: string
  ) => {
    setFormData(prev => {
      const selectedValues = prev[field];
      return {
        ...prev,
        [field]: selectedValues.includes(value)
          ? selectedValues.filter(item => item !== value)
          : [...selectedValues, value]
      };
    });
  };

  const handlePurchasePreferenceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      purchasePreference: value,
      cordlessVoltagePlatforms: value === '有绳工具为主' ? [] : prev.cordlessVoltagePlatforms,
      cordedPowerRange: value === '无绳工具为主' ? '' : prev.cordedPowerRange
    }));
    setOpenFormQuestion('');
  };

  const purchasesCordless = formData.purchasePreference === '无绳工具为主' || formData.purchasePreference === '无绳与有绳都采购';
  const purchasesCorded = formData.purchasePreference === '有绳工具为主' || formData.purchasePreference === '无绳与有绳都采购';
  const isPurchaseStepComplete =
    formData.purchaseToolTypes.length > 0 &&
    Boolean(formData.purchasePreference) &&
    (!purchasesCordless || formData.cordlessVoltagePlatforms.length > 0) &&
    (!purchasesCorded || Boolean(formData.cordedPowerRange));
  const isCompanyStepComplete =
    Boolean(formData.contactPersonName.trim()) &&
    Boolean(formData.companyName.trim()) &&
    Boolean(formData.companyType) &&
    Boolean(formData.applicantRole) &&
    /^\+?[0-9\s-]{8,20}$/.test(formData.contactPhone.trim()) &&
    formData.privacyConsent;

  // 保留原手机端两步表单的前进逻辑，避免本次桌面/平板优化影响移动端。
  const handleNextStep = () => {
    if (applicationStep === 1) {
      setApplicationStep(2);
    }
  };

  const handlePurchaseStepNext = () => {
    if (!isPurchaseStepComplete) return;
    setApplicationStep(2);
    setOpenFormQuestion('');
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const purchaseProfile = [
        `常购工具：${formData.purchaseToolTypes.join('、') || '未填写'}`,
        `采购类型：${formData.purchasePreference || '未填写'}`,
        `无绳电压平台：${formData.cordlessVoltagePlatforms.join('、') || '不适用/未填写'}`,
        `有绳功率范围：${formData.cordedPowerRange || '不适用/未填写'}`
      ].join('；');

      const applicationRecord = {
        _id: crypto.randomUUID(),
        companyName: formData.companyName,
        contactPersonName: formData.contactPersonName,
        contactPhone: formData.contactPhone,
        email: formData.email,
        companyType: formData.companyType,
        applicantRole: formData.applicantRole,
        purchaseToolTypes: formData.purchaseToolTypes.join('、'),
        purchasePreference: formData.purchasePreference,
        cordlessVoltagePlatforms: formData.cordlessVoltagePlatforms.join('、'),
        cordedPowerRange: formData.cordedPowerRange,
        purchaseProfile,
        privacyConsent: formData.privacyConsent
      } as unknown as Distributorapplications;

      await BaseCrudService.create<Distributorapplications>('distributorapplications', applicationRecord);

      setFormData(createInitialFormData());
      setApplicationStep(1);
      setOpenFormQuestion('');
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
      {/* --- DEALER OPPORTUNITIES (B2B) --- */}
      <section id="opportunities" className="relative w-full overflow-hidden py-16 max-sm:py-12 sm:py-20 md:py-32 flex items-center">
        {/* Background with warehouse image and 30% black overlay */}
        <div className="absolute inset-0 z-0">
          {/* Desktop/Tablet: Original warehouse background */}
          <Image
            src="https://static.wixstatic.com/media/556c5c_f85184c7b62946029429c579009fc6be~mv2.png"
            alt="Industrial warehouse background"
            className="hidden sm:block w-full h-full object-cover"
            width={1920}
          />
          {/* Mobile: New background image */}
          <Image
            src="https://static.wixstatic.com/media/556c5c_6f86a0666f48483985f986158f9a1c4e~mv2.png"
            alt="Mobile dealer advantages background"
            className="block sm:hidden w-full h-full object-cover"
            width={1920}
          />
          {/* 30% black overlay for desktop/tablet */}
          <div className="hidden sm:block absolute inset-0 bg-black/30"></div>
          {/* 80% dark overlay (#030506) for mobile */}
          <div className="block sm:hidden absolute inset-0" style={{ backgroundColor: 'rgba(3, 5, 6, 0.8)' }}></div>
          <div className="industrial-noise"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 max-sm:px-5 sm:px-6 md:px-12">
          {/* Section Header - Desktop/Tablet centered, Mobile left-aligned */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="mb-8 max-sm:mb-6 sm:mb-12 max-sm:text-left sm:text-center"
          >
            {/* Mobile: Orange English subtitle */}
            <span className="hidden max-sm:block text-[#FF9D00] text-xs font-bold tracking-widest uppercase mb-2 block">
              Dealer Advantages
            </span>

            <h2 className="font-heading text-2xl max-sm:text-[25px] sm:text-3xl md:text-5xl lg:text-5xl text-foreground mb-3 max-sm:mb-2 sm:mb-4 leading-[1.2] max-sm:leading-[1.3]">
              <span className="block sm:hidden">
                为什么 Locanex 值得成为你的下一个<span className="text-primary">合作伙伴？</span>
              </span>
              <span className="hidden sm:inline">
                为什么 Locanex 值得成为你的<br />下一个<span className="text-primary">合作伙伴？</span>
              </span>
            </h2>
            <p className="font-paragraph text-xs max-sm:text-[12px] sm:text-base md:text-lg text-[#AEB4B9] max-w-3xl max-sm:max-w-none mx-auto mt-3 max-sm:mt-2 sm:mt-4 leading-[1.6] max-sm:leading-[1.6]">
              不仅提供产品，更为经销商提供具有长期销售潜力的合作方案。
            </p>
          </motion.div>

          {/* Cards Grid - Desktop: 6 cards in 1 row | Tablet: 3 cards x 2 rows | Mobile: 2 columns x 3 rows */}
          <div className="grid grid-cols-1 max-sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 max-sm:gap-[10px] sm:gap-3 md:gap-4">
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
              <span className="sm:hidden">六款21V专业产品覆盖高频作业与续航需求</span>
              <span className="hidden sm:inline">五款21V专业工具覆盖高频作业场景</span><br />
              适合经销商门店展示与样品测试
            </p>
          </motion.div>

          {/* Desktop/tablet keep the existing 5 cards; mobile uses a 6-card carousel. */}
          <div className="min-h-[400px] max-sm:min-h-[auto]">
            {/* Desktop & Tablet Grid */}
            <motion.div
              className="hidden sm:grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4"
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

            {/* Mobile Carousel */}
            <div className="sm:hidden">
              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="product-carousel mb-6"
                onScroll={handleCarouselScroll}
                aria-label="Locanex 21V 产品横向轮播，共6款"
              >
                {/* Product 1 */}
                <div className="product-carousel-item group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300">
                  <div className="relative w-full h-[220px] bg-black/80 overflow-hidden">
                    <Image
                      src="https://static.wixstatic.com/media/556c5c_8aae7f52450e4b5bb621c5beaa1fbd8b~mv2.png"
                      alt="Locanex 21V Impact Drill"
                      className="w-full h-full object-contain object-center"
                      width={300}
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col relative z-30 bg-black/70">
                    <div className="mb-2">
                      <span className="font-heading text-xs font-bold text-primary tracking-widest uppercase">LOCANEX 21V</span>
                    </div>
                    <h3 className="font-heading text-sm text-foreground font-bold mb-2 line-clamp-2 leading-tight">无刷冲击钻</h3>
                    <div className="mb-2">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">专业用途</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">钻孔、紧固、安装与维修作业</p>
                    </div>
                    <div className="mb-3">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">经销商看点</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">高频施工工具，同时覆盖钻孔与紧固需求。</p>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs py-2 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                      onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      申请该产品样品
                    </Button>
                  </div>
                </div>

                {/* Product 2 */}
                <div className="product-carousel-item group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300">
                  <div className="relative w-full h-[220px] bg-black/80 overflow-hidden">
                    <Image
                      src="https://static.wixstatic.com/media/556c5c_12ea91a36dc44157a25ecf3cabd84403~mv2.png"
                      alt="Locanex 21V Impact Wrench"
                      className="w-full h-full object-contain object-center"
                      width={300}
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col relative z-30 bg-black/70">
                    <div className="mb-2">
                      <span className="font-heading text-xs font-bold text-primary tracking-widest uppercase">LOCANEX 21V</span>
                    </div>
                    <h3 className="font-heading text-sm text-foreground font-bold mb-2 line-clamp-2 leading-tight">无刷冲击扳手</h3>
                    <div className="mb-2">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">专业用途</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">轮胎、机械、钢结构及螺栓拆装</p>
                    </div>
                    <div className="mb-3">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">经销商看点</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">专业紧固定位，适合汽修、工程与设备维护渠道。</p>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs py-2 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                      onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      申请该产品样品
                    </Button>
                  </div>
                </div>

                {/* Product 3 */}
                <div className="product-carousel-item group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300">
                  <div className="relative w-full h-[220px] bg-black/80 overflow-hidden">
                    <Image
                      src="https://static.wixstatic.com/media/556c5c_7457eb978ebd4fbcaec544aa7c991a4f~mv2.png"
                      alt="Locanex 21V Chainsaw"
                      className="w-full h-full object-contain object-center"
                      width={300}
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col relative z-30 bg-black/70">
                    <div className="mb-2">
                      <span className="font-heading text-xs font-bold text-primary tracking-widest uppercase">LOCANEX 21V</span>
                    </div>
                    <h3 className="font-heading text-sm text-foreground font-bold mb-2 line-clamp-2 leading-tight">无刷无绳链锯</h3>
                    <div className="mb-2">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">专业用途</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">木材切割、园林修枝与现场木工作业</p>
                    </div>
                    <div className="mb-3">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">经销商看点</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">无绳作业更灵活，用途直观，方便门店演示。</p>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs py-2 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                      onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      申请该产品样品
                    </Button>
                  </div>
                </div>

                {/* Product 4 */}
                <div className="product-carousel-item group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300">
                  <div className="relative w-full h-[220px] bg-black/80 overflow-hidden">
                    <Image
                      src="https://static.wixstatic.com/media/556c5c_a6b7cb813d1c45b8839817121694b305~mv2.png"
                      alt="Locanex 21V Circular Saw"
                      className="w-full h-full object-contain object-center"
                      width={300}
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col relative z-30 bg-black/70">
                    <div className="mb-2">
                      <span className="font-heading text-xs font-bold text-primary tracking-widest uppercase">LOCANEX 21V</span>
                    </div>
                    <h3 className="font-heading text-sm text-foreground font-bold mb-2 line-clamp-2 leading-tight">无刷电圆锯</h3>
                    <div className="mb-2">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">专业用途</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">木板、模板、板材与施工现场切割</p>
                    </div>
                    <div className="mb-3">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">经销商看点</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">专业切割场景明确，适合木工、建筑与装修渠道。</p>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs py-2 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                      onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      申请该产品样品
                    </Button>
                  </div>
                </div>

                {/* Product 5 */}
                <div className="product-carousel-item group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300">
                  <div className="relative w-full h-[220px] bg-black/80 overflow-hidden">
                    <Image
                      src="https://static.wixstatic.com/media/556c5c_554ad7a1a9ec4d3b8e6cc4a0ccc41b1e~mv2.png"
                      alt="Locanex 21V Angle Grinder"
                      className="w-full h-full object-contain object-center"
                      width={300}
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col relative z-30 bg-black/70">
                    <div className="mb-2">
                      <span className="font-heading text-xs font-bold text-primary tracking-widest uppercase">LOCANEX 21V</span>
                    </div>
                    <h3 className="font-heading text-sm text-foreground font-bold mb-2 line-clamp-2 leading-tight">无刷角磨机</h3>
                    <div className="mb-2">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">专业用途</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">金属切割、打磨、去毛刺与表面处理</p>
                    </div>
                    <div className="mb-3">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">经销商看点</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">覆盖高频金工任务，适合维修、工程与工业渠道。</p>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs py-2 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                      onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      申请该产品样品
                    </Button>
                  </div>
                </div>

                {/* Product 6: MT2081 Battery Pack */}
                <div className="product-carousel-item group relative bg-black/70 border border-muted-gray/40 overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors duration-300">
                  <div className="relative w-full h-[220px] bg-black/80 overflow-hidden">
                    {MT2081_IMAGE_URL ? (
                      <Image
                        src={MT2081_IMAGE_URL}
                        alt="Locanex 21V MT2081 8.0Ah Battery Pack"
                        className="w-full h-full object-cover object-center"
                        width={600}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-primary/35 bg-secondary/30 px-6 text-center">
                        <Package className="h-8 w-8 text-primary/80" />
                        <span className="font-paragraph text-xs leading-5 text-foreground/60">
                          请将 MT2081 图片上传至 Wix，并填写 MT2081_IMAGE_URL
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-grow flex flex-col relative z-30 bg-black/70">
                    <div className="mb-2">
                      <span className="font-heading text-xs font-bold text-primary tracking-widest uppercase">LOCANEX 21V</span>
                    </div>
                    <h3 className="font-heading text-sm text-foreground font-bold mb-2 line-clamp-2 leading-tight">MT2081 大容量锂电池包</h3>
                    <div className="mb-2">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">专业用途</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">为21V无绳工具提供长时间供电，适合高频钻孔、紧固、切割与打磨。</p>
                    </div>
                    <div className="mb-3">
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-1">经销商看点</p>
                      <p className="font-paragraph text-xs text-foreground/80 leading-[1.4]">8.0Ah / 148Wh大容量，适合作为升级和备用电池销售，带动工具、电池组合销售与复购。</p>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xs py-2 h-auto rounded-none mt-auto transition-all duration-300 uppercase tracking-wider font-bold"
                      onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      申请该产品样品
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Carousel Controls */}
              <div className="flex items-center justify-between gap-3 px-4">
                {/* Product Counter */}
                <div className="text-center flex-1">
                  <span className="font-heading text-sm text-primary font-bold">
                    {String(carouselIndex + 1).padStart(2, '0')} / {String(MOBILE_PRODUCT_CARD_COUNT).padStart(2, '0')}
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCarouselPrev}
                    disabled={carouselIndex === 0}
                    className="w-10 h-10 flex items-center justify-center border border-primary/50 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button
                    onClick={handleCarouselNext}
                    disabled={carouselIndex === MOBILE_PRODUCT_CARD_COUNT - 1}
                    className="w-10 h-10 flex items-center justify-center border border-primary/50 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: MOBILE_PRODUCT_CARD_COUNT }, (_, index) => index).map((index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCarouselIndex(index);
                      scrollCarouselToIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      carouselIndex === index ? 'bg-primary' : 'bg-primary/30'
                    }`}
                  />
                ))}
              </div>
            </div>
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
        <style>{`
          @media (max-width: 767px) {
            .comparison-table-mobile {
              width: 100%;
              max-width: 100%;
              table-layout: fixed;
              background: linear-gradient(135deg, #0D1011, #07090A);
              border: 1px solid rgba(190, 200, 208, 0.18);
              border-radius: 14px;
              overflow: hidden;
              box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
            }
            .comparison-table-mobile thead {
              background-color: #141719;
              height: 48px;
            }
            .comparison-table-mobile th {
              padding: 14px 8px;
              text-align: left;
              vertical-align: top;
              border: none;
              font-weight: 600;
              font-size: 10px;
              line-height: 1;
              color: #9EA5AA;
              white-space: normal;
              word-break: break-word;
              overflow-wrap: anywhere;
            }
            .comparison-table-mobile th:nth-child(2) {
              font-weight: 700;
              font-size: 11px;
              color: #FF9D00;
              background-color: rgba(255, 157, 0, 0.10);
              border-bottom: 2px solid #FF9D00;
            }
            .comparison-table-mobile tbody tr {
              border-bottom: 1px solid rgba(190, 200, 208, 0.12);
            }
            .comparison-table-mobile tbody tr:nth-child(odd) {
              background-color: rgba(255, 255, 255, 0.012);
            }
            .comparison-table-mobile tbody tr:nth-child(even) {
              background-color: transparent;
            }
            .comparison-table-mobile td {
              padding: 14px 8px;
              border: none;
              text-align: left;
              vertical-align: top;
              white-space: normal;
              word-break: break-word;
              overflow-wrap: anywhere;
              height: auto;
            }
            .comparison-table-mobile td:nth-child(1) {
              font-size: 11px;
              font-weight: 700;
              color: #F1F3F4;
              line-height: 1.45;
              width: 24%;
              border-right: 1px solid rgba(190, 200, 208, 0.08);
            }
            .comparison-table-mobile td:nth-child(2) {
              font-size: 10px;
              font-weight: 500;
              color: #ECEEEF;
              line-height: 1.6;
              width: 39%;
              background-color: rgba(255, 157, 0, 0.035);
              border-right: 1px solid rgba(190, 200, 208, 0.08);
            }
            .comparison-table-mobile td:nth-child(3) {
              font-size: 9.5px;
              font-weight: 400;
              color: #727A80;
              line-height: 1.6;
              width: 37%;
            }
            .comparison-checkmark {
              display: inline-flex;
              align-items: center;
              gap: 5px;
              margin-right: 0;
            }
            .comparison-checkmark-circle {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 14px;
              height: 14px;
              min-width: 14px;
              border-radius: 50%;
              background-color: rgba(255, 157, 0, 0.08);
              border: 1px solid rgba(255, 157, 0, 0.30);
              flex-shrink: 0;
            }
            .comparison-checkmark-icon {
              width: 8px;
              height: 8px;
              color: #FF9D00;
              stroke-width: 2;
            }
          }
        `}</style>
        <div className="max-w-[100rem] mx-auto px-4 max-sm:px-4 sm:px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="max-sm:text-left sm:text-center mb-12 max-sm:mb-10 sm:mb-16"
          >
            {/* Mobile: English subtitle + Title with split colors + Subtitle */}
            <div className="sm:hidden">
              <span className="block text-[#FF9D00] text-[10px] font-bold tracking-[1.4px] uppercase mb-3">
                FACTORY · OEM · ODM
              </span>
              <h2 className="font-heading text-[25px] leading-[1.25] font-black text-foreground mb-3">
                <span className="text-[#F5F6F7]">产品与经销</span>
                <span className="text-[#FF9D00]">支持对比</span>
              </h2>
              <p className="font-paragraph text-[12px] leading-[1.65] text-[#9DA5AB]">
                从工厂直供到市场测试，为泰国经销商提供更灵活的合作支持。
              </p>
            </div>

            {/* Desktop/Tablet: Original centered layout */}
            <div className="hidden sm:block">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4 leading-[1.2]">
                产品与经销<span className="text-primary">支持对比</span>
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-sm:overflow-visible sm:overflow-x-auto"
          >
            {/* Mobile: Premium table */}
            <table className="comparison-table-mobile sm:hidden">
              <thead>
                <tr>
                  <th>比较项目</th>
                  <th>我们</th>
                  <th>一般供应商</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '工厂供货', pro: '自有工厂直供，价格优势明显', con: '多级代理，成本较高' },
                  { label: 'OEM贴牌', pro: '支持小批量定制，灵活度高', con: '起订量要求极高' },
                  { label: 'ODM开发', pro: '专业研发团队，支持功能定制', con: '仅提供公模产品' },
                  { label: '产品差异化', pro: '独特工业设计，避免价格战', con: '同质化严重，竞争激烈' },
                  { label: '市场测试', pro: '支持样机试销，降低风险', con: '需大批量进货' },
                  { label: '长期支持', pro: '提供品牌营销与售后全方位支持', con: '仅负责产品销售' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td>{row.label}</td>
                    <td>
                      <span className="comparison-checkmark">
                        <span className="comparison-checkmark-circle">
                          <svg className="comparison-checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <span>{row.pro}</span>
                      </span>
                    </td>
                    <td>{row.con}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Desktop/Tablet: Original table */}
            <table className="hidden sm:table w-full min-w-[800px] border-collapse">
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

          <div className="max-sm:flex max-sm:overflow-x-auto max-sm:scroll-snap-type-x-mandatory max-sm:gap-3 max-sm:pl-5 max-sm:-mx-4 max-sm:px-4 max-sm:pb-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6 md:gap-8 max-sm:[&::-webkit-scrollbar]:hidden max-sm:scrollbar-hide">
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
                className="group relative h-64 max-sm:h-64 sm:h-72 md:h-80 overflow-hidden border border-muted-gray/20 max-sm:flex-shrink-0 max-sm:scroll-snap-align-start max-sm:w-[calc(100vw-64px)]"
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
              <p className="mb-6 font-paragraph text-sm text-foreground/60 md:mb-10 md:text-base">先填写采购需求，再补充公司身份与联系方式。</p>

              {/* Step Indicator */}
              <div className="hidden md:flex items-center mb-10">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${applicationStep >= 1 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>1</div>
                <div className="font-paragraph text-sm ml-3 mr-4 text-foreground/80">步骤 1: 采购需求</div>
                <div className={`flex-grow h-px ${applicationStep >= 2 ? 'bg-primary' : 'bg-muted-gray/30'} transition-colors`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ml-4 ${applicationStep >= 2 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>2</div>
                <div className="font-paragraph text-sm ml-3 text-foreground/80">步骤 2: 公司与联系信息</div>
              </div>
              <div className="flex md:hidden items-center mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${applicationStep >= 1 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>1</div>
                <div className="font-paragraph text-xs ml-2 mr-2 text-foreground/80">步骤 1：采购需求</div>
                <div className={`flex-grow h-px ${applicationStep >= 2 ? 'bg-primary' : 'bg-muted-gray/30'} transition-colors`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ml-2 ${applicationStep >= 2 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold transition-colors`}>2</div>
                <div className="font-paragraph text-xs ml-2 text-foreground/80">步骤 2：公司信息</div>
              </div>

              <div className="bg-secondary/20 border border-muted-gray/20 p-4 max-sm:p-4 sm:p-8">
                {/* All breakpoints: accordion-style dealer qualification form */}
                <div className="block">
                  {applicationStep === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Accordion
                        type="single"
                        collapsible
                        value={openFormQuestion}
                        onValueChange={setOpenFormQuestion}
                        className="space-y-3"
                      >
                        <FormQuestion
                          value="purchaseToolTypes"
                          number={1}
                          title="经常采购的电动工具类型"
                          complete={formData.purchaseToolTypes.length > 0}
                        >
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {purchaseToolOptions.map(option => (
                              <ChoiceButton
                                key={option}
                                selected={formData.purchaseToolTypes.includes(option)}
                                onClick={() => toggleMultiSelect('purchaseToolTypes', option)}
                              >
                                {option}
                              </ChoiceButton>
                            ))}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            className="mt-4 bg-primary text-black hover:bg-primary/90 rounded-none"
                            disabled={formData.purchaseToolTypes.length === 0}
                            onClick={() => setOpenFormQuestion('')}
                          >
                            确认选择
                          </Button>
                        </FormQuestion>

                        <FormQuestion
                          value="purchasePreference"
                          number={2}
                          title="主要采购无绳还是有绳工具"
                          complete={Boolean(formData.purchasePreference)}
                        >
                          <div className="grid grid-cols-1 gap-2">
                            {purchasePreferenceOptions.map(option => (
                              <ChoiceButton
                                key={option}
                                selected={formData.purchasePreference === option}
                                onClick={() => handlePurchasePreferenceChange(option)}
                              >
                                {option}
                              </ChoiceButton>
                            ))}
                          </div>
                        </FormQuestion>

                        {purchasesCordless && (
                          <FormQuestion
                            value="cordlessVoltagePlatforms"
                            number={3}
                            title="常购无绳工具电压平台"
                            complete={formData.cordlessVoltagePlatforms.length > 0}
                          >
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {cordlessVoltageOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.cordlessVoltagePlatforms.includes(option)}
                                  onClick={() => toggleMultiSelect('cordlessVoltagePlatforms', option)}
                                >
                                  {option}
                                </ChoiceButton>
                              ))}
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              className="mt-4 bg-primary text-black hover:bg-primary/90 rounded-none"
                              disabled={formData.cordlessVoltagePlatforms.length === 0}
                              onClick={() => setOpenFormQuestion('')}
                            >
                              确认选择
                            </Button>
                          </FormQuestion>
                        )}

                        {purchasesCorded && (
                          <FormQuestion
                            value="cordedPowerRange"
                            number={4}
                            title="经常采购的有绳工具功率范围"
                            complete={Boolean(formData.cordedPowerRange)}
                          >
                            <div className="grid grid-cols-1 gap-2">
                              {cordedPowerOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.cordedPowerRange === option}
                                  onClick={() => {
                                    handleInputChange('cordedPowerRange', option);
                                    setOpenFormQuestion('');
                                  }}
                                >
                                  {option}
                                </ChoiceButton>
                              ))}
                            </div>
                          </FormQuestion>
                        )}
                      </Accordion>

                      <p className="mt-5 font-paragraph text-xs text-foreground/50">
                        点击问题标题展开填写；同一时间只展开一个问题，已填写内容会自动保留。
                      </p>
                      <Button
                        className="mt-5 w-full rounded-none bg-primary py-6 font-heading text-sm text-primary-foreground hover:bg-primary/90"
                        onClick={handlePurchaseStepNext}
                        disabled={!isPurchaseStepComplete}
                      >
                        下一步：公司身份与联系方式
                      </Button>
                    </motion.div>
                  )}

                  {applicationStep === 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Accordion
                        type="single"
                        collapsible
                        value={openFormQuestion}
                        onValueChange={setOpenFormQuestion}
                        className="space-y-3"
                      >
                        <FormQuestion
                          value="contactPersonName"
                          number={1}
                          title="联系人姓名"
                          complete={Boolean(formData.contactPersonName.trim())}
                          incompleteLabel="请填写"
                        >
                          <Label htmlFor="desktopContactPersonName" className="sr-only">联系人姓名</Label>
                          <Input
                            id="desktopContactPersonName"
                            value={formData.contactPersonName}
                            onChange={(event) => handleInputChange('contactPersonName', event.target.value)}
                            className="h-12 rounded-none border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary"
                            placeholder="请输入联系人姓名"
                            autoComplete="name"
                          />
                          <Button
                            type="button"
                            size="sm"
                            className="mt-3 rounded-none bg-primary text-black hover:bg-primary/90"
                            disabled={!formData.contactPersonName.trim()}
                            onClick={() => setOpenFormQuestion('')}
                          >
                            保存并收起
                          </Button>
                        </FormQuestion>

                        <FormQuestion
                          value="companyName"
                          number={2}
                          title="公司或店铺名称"
                          complete={Boolean(formData.companyName.trim())}
                          incompleteLabel="请填写"
                        >
                          <Label htmlFor="desktopCompanyName" className="sr-only">公司或店铺名称</Label>
                          <Input
                            id="desktopCompanyName"
                            value={formData.companyName}
                            onChange={(event) => handleInputChange('companyName', event.target.value)}
                            className="h-12 rounded-none border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary"
                            placeholder="请输入公司或店铺名称"
                            autoComplete="organization"
                          />
                          <Button
                            type="button"
                            size="sm"
                            className="mt-3 rounded-none bg-primary text-black hover:bg-primary/90"
                            disabled={!formData.companyName.trim()}
                            onClick={() => setOpenFormQuestion('')}
                          >
                            保存并收起
                          </Button>
                        </FormQuestion>

                        <FormQuestion
                          value="companyType"
                          number={3}
                          title="公司类型"
                          complete={Boolean(formData.companyType)}
                        >
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {companyTypeOptions.map(option => (
                              <ChoiceButton
                                key={option}
                                selected={formData.companyType === option}
                                onClick={() => {
                                  handleInputChange('companyType', option);
                                  setOpenFormQuestion('');
                                }}
                              >
                                {option}
                              </ChoiceButton>
                            ))}
                          </div>
                        </FormQuestion>

                        <FormQuestion
                          value="applicantRole"
                          number={4}
                          title="申请人身份/职位"
                          complete={Boolean(formData.applicantRole)}
                        >
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {applicantRoleOptions.map(option => (
                              <ChoiceButton
                                key={option}
                                selected={formData.applicantRole === option}
                                onClick={() => {
                                  handleInputChange('applicantRole', option);
                                  setOpenFormQuestion('');
                                }}
                              >
                                {option}
                              </ChoiceButton>
                            ))}
                          </div>
                        </FormQuestion>

                        <FormQuestion
                          value="contactPhone"
                          number={5}
                          title="手机号码"
                          complete={/^\+?[0-9\s-]{8,20}$/.test(formData.contactPhone.trim())}
                          incompleteLabel="请填写"
                        >
                          <Label htmlFor="desktopContactPhone" className="sr-only">手机号码</Label>
                          <Input
                            id="desktopContactPhone"
                            type="tel"
                            inputMode="tel"
                            value={formData.contactPhone}
                            onChange={(event) => handleInputChange('contactPhone', event.target.value)}
                            className="h-12 rounded-none border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary"
                            placeholder="例如：0937281730 或 +66..."
                            autoComplete="tel"
                          />
                          <p className="mt-2 font-paragraph text-xs text-foreground/45">请输入 8–20 位数字，可包含 +、空格或连字符。</p>
                          <Button
                            type="button"
                            size="sm"
                            className="mt-3 rounded-none bg-primary text-black hover:bg-primary/90"
                            disabled={!/^\+?[0-9\s-]{8,20}$/.test(formData.contactPhone.trim())}
                            onClick={() => setOpenFormQuestion('')}
                          >
                            保存并收起
                          </Button>
                        </FormQuestion>
                      </Accordion>

                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={formData.privacyConsent}
                        onClick={() => handleInputChange('privacyConsent', !formData.privacyConsent)}
                        className="mt-5 flex w-full items-start gap-3 text-left font-paragraph text-xs leading-5 text-foreground/65"
                      >
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] ${formData.privacyConsent ? 'border-primary bg-primary text-black' : 'border-muted-gray/50'}`}>
                          {formData.privacyConsent ? '✓' : ''}
                        </span>
                        <span>我同意公司根据隐私政策收集和使用我的信息，用于经销商申请评估、联系、样品安排、市场调研和合作沟通。</span>
                      </button>

                      <div className="mt-5 flex gap-4">
                        <Button
                          variant="outline"
                          className="w-1/3 rounded-none border-muted-gray/50 py-6 font-heading text-sm text-foreground hover:bg-secondary"
                          onClick={() => {
                            setApplicationStep(1);
                            setOpenFormQuestion('');
                          }}
                        >
                          返回
                        </Button>
                        <Button
                          className="w-2/3 rounded-none bg-primary py-6 font-heading text-sm text-primary-foreground hover:bg-primary/90"
                          onClick={handleSubmitApplication}
                          disabled={!isCompanyStepComplete || isSubmitting}
                        >
                          {isSubmitting ? '提交中...' : '提交申请并获取经销商方案'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Legacy mobile form retained in source for rollback, but no longer rendered. */}
                <div className="hidden">
                  {applicationStep === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-sm:space-y-4 sm:space-y-6">
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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-sm:space-y-4 sm:space-y-6">
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

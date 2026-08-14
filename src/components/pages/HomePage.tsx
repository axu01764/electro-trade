import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Distributorapplications } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { motion } from 'framer-motion';
import { Globe, Lock, MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { analytics } from '@wix/site';

type SiteLanguage = 'zh' | 'th';
const LANGUAGE_STORAGE_KEY = 'locanex-site-language';
const LINE_CONTACT_URL = 'https://line.me/ti/p/G_saKyMNTQ';

const ZH_TO_TH_TEXT: Record<string, string> = {
  '返回官网': 'กลับไปยังเว็บไซต์',
  '中文': '中文',
  'ไทย': 'ไทย',
  'LINE咨询': 'ปรึกษาทาง LINE',
  'THAILAND PARTNER PROGRAM': 'THAILAND PARTNER PROGRAM',
  '申请成为 Locanex': 'สมัครเป็น Locanex',
  '泰国合作伙伴': 'สมัครเป็นพันธมิตร Locanex ในประเทศไทย',
  '泰国合作经销商': 'ตัวแทนจำหน่ายพันธมิตรในประเทศไทย',
  '告诉我们您的采购需求与销售渠道，获取产品资料、合作方案及免费样品评估资格。': 'บอกเราถึงความต้องการจัดซื้อและช่องทางการขายของคุณ เพื่อรับข้อมูลสินค้า แนวทางการร่วมมือ และสิทธิ์ประเมินตัวอย่างสินค้าฟรี',
  '告诉我们您的采购需求与销售渠道，获取产品资料、经销方案及免费样品评估资格。': 'บอกเราถึงความต้องการจัดซื้อและช่องทางการขาย เพื่อรับข้อมูลสินค้า แผนสำหรับตัวแทนจำหน่าย และสิทธิ์ประเมินตัวอย่างสินค้าฟรี',
  '与 Locanex 合作，你将获得': 'ความร่วมมือกับ Locanex คุณจะได้รับ',
  '工厂直接供货': 'จัดส่งตรงจากโรงงาน',
  '提供具有竞争力的供货方案与长期稳定的产品支持。': 'ให้ความเห็นที่มีความสามารถในการแข่งขันและการสนับสนุนผลิตภัณฑ์ที่มั่นคง',
  'OEM / ODM 合作': 'ความร่วมมือ OEM / ODM',
  '支持品牌Logo、包装及基于当地市场需求的产品开发。': 'สนับสนุนโลโก้แบรนด์ การบรรจุภัณฑ์ และการพัฒนาผลิตภัณฑ์ตามความต้องการของตลาดท้องถิ่น',
  '21V专业产品平台': 'แพลตฟอร์มผลิตภัณฑ์มืออาชีพ 21V',
  '覆盖电动工具、电池和充电器，便于组合销售与系列化经营。': 'ครอบคลุมเครื่องมือไฟฟ้า แบตเตอรี่ และเครื่องชาร์จ เพื่อให้ง่ายต่อการขายแบบรวมและการจัดการแบบอนุกรม',
  '样品与市场测试': 'ตัวอย่างและการทดสอบตลาด',
  '符合条件的合作伙伴可申请样品，先进行产品和市场评估。': 'พันธมิตรที่มีคุณสมบัติสามารถขอตัวอย่างเพื่อประเมินผลิตภัณฑ์และตลาดก่อน',
  '泰国市场支持': 'การสนับสนุนตลาดไทย',
  '提供产品资料、合作沟通及后续市场反馈优化支持。': 'ให้ข้อมูลผลิตภัณฑ์ การสื่อสารความร่วมมือ และการสนับสนุนการปรับปรุงข้อเสนอแนะตลาดในภายหลัง',
  '适合申请的合作伙伴': 'พันธมิตรที่เหมาะสมสำหรับการสมัคร',
  '电动工具渠道商': 'ผู้จัดจำหน่ายช่องทางเครื่องมือไฟฟ้า',
  '五金／建材门店': 'ร้านฮาร์ดแวร์ / ร้านวัสดุก่อสร้าง',
  '工业用品供应商': 'ผู้จำหน่ายอุปกรณ์อุตสาหกรรม',
  '批发及电商渠道': 'ช่องทางส่งและอีคอมเมิร์ซ',
  '样品数量有限，提交申请不代表自动获得样品。我们将在审核经营信息后与您联系。': 'ตัวอย่างมีจำนวนจำกัด การส่งใบสมัครไม่ได้หมายถึงได้รับตัวอย่างโดยอัตโนมัติ เราจะติดต่อคุณหลังจากตรวจสอบข้อมูลธุรกิจ',
  '样品数量有限，申请不代表自动获得样品。我们将在审核经营信息后与您联系。': 'ตัวอย่างมีจำนวนจำกัด การสมัครไม่ได้หมายถึงได้รับตัวอย่างโดยอัตโนมัติ เราจะติดต่อคุณหลังจากตรวจสอบข้อมูลธุรกิจ',
  '样品申请单': 'แบบฟอร์มขอรับตัวอย่างสินค้า',
  '经销商申请': 'ใบสมัครตัวแทนจำหน่าย',
  '您的信息仅用于合作伙伴资格审核、样品评估与合作联系': 'ข้อมูลของท่านจะใช้เพื่อประเมินคุณสมบัติพันธมิตร การขอตัวอย่างสินค้า และการติดต่อด้านความร่วมมือเท่านั้น',
  '预计填写时间：约2分钟': 'เวลาที่คาดว่าจะใช้: ประมาณ 2 นาที',
  '采购需求': 'ความต้องการจัดซื้อ',
  '公司信息': 'ข้อมูลบริษัท',
  '已完成': 'กรอกแล้ว',
  '公司与联系方式': 'บริษัทและข้อมูลติดต่อ',
  '经常采购的电动工具类型': 'ประเภทเครื่องมือไฟฟ้าที่จัดซื้อเป็นประจำ',
  '冲击钻/电钻': 'สว่านกระแทก / สว่านไฟฟ้า',
  '角磨机': 'เครื่องเจียรไฟฟ้า',
  '电链锯': 'เลื่อยโซ่ไฟฟ้า',
  '冲击扳手': 'บล็อกกระแทก',
  '电圆锯': 'เลื่อยวงเดือนไฟฟ้า',
  '电锤/电镐': 'สว่านโรตารี่ / เครื่องสกัดไฟฟ้า',
  '绿篱机': 'เครื่องตัดแต่งกิ่ง',
  '21V电池包': 'แบตเตอรี่ 21V',
  '其他': 'อื่น ๆ',
  '主要采购无绳还是有绳工具': 'โดยหลักจัดซื้อเครื่องมือไร้สายหรือแบบมีสาย',
  '无绳工具为主': 'เครื่องมือไร้สายเป็นหลัก',
  '有绳工具为主': 'เครื่องมือแบบมีสายเป็นหลัก',
  '无绳与有绳都采购': 'จัดซื้อทั้งแบบไร้สายและมีสาย',
  '您单次五金采购量在多少': 'ปริมาณการจัดซื้อฮาร์ดแวร์ต่อครั้งของคุณเท่าไร',
  '100件以下': 'น้อยกว่า 100 ชิ้น',
  '100–500件': '100–500 ชิ้น',
  '500件以上': 'มากกว่า 500 ชิ้น',
  '您目前最看重工具的哪些方面？': 'คุณให้ความสำคัญกับด้านใดของเครื่องมือมากที่สุด?',
  '价格': 'ราคา',
  '耐用性': 'ความทนทาน',
  '电池续航': 'ระยะเวลาการใช้งานแบตเตอรี่',
  '售后服务': 'บริการหลังการขาย',
  '本地发货速度': 'ความเร็วในการจัดส่งในท้องถิ่น',
  '可定制性': 'ความสามารถในการปรับแต่ง',
  '是否愿意接收样品试用？': 'คุณยินดีรับตัวอย่างเพื่อทดลองใช้หรือไม่?',
  '是，希望免费试用（需符合资格）': 'ใช่ ต้องการทดลองใช้ฟรี (ต้องผ่านเกณฑ์)',
  '是，可接受按批发价购买样品': 'ใช่ ยอมรับการซื้อตัวอย่างในราคาส่ง',
  '暂不需要样品，仅投票': 'ไม่ต้องการตัวอย่างในตอนนี้ เพียงแค่ลงคะแนน',
  '请选择': 'โปรดเลือก',
  '下一步：填写公司信息': 'ถัดไป: กรอกข้อมูลบริษัท',
  '联系人姓名': 'ชื่อผู้ติดต่อ',
  '请输入联系人姓名': 'กรุณากรอกชื่อผู้ติดต่อ',
  '公司或店铺名称': 'ชื่อบริษัทหรือร้านค้า',
  '请输入公司或店铺名称': 'กรุณากรอกชื่อบริษัทหรือร้านค้า',
  '公司类型': 'ประเภทธุรกิจ',
  '电动工具经销商': 'ผู้จัดจำหน่ายเครื่องมือไฟฟ้า',
  '批发商': 'ผู้ค้าส่ง',
  '拥有区域渠道的公司': 'บริษัทที่มีเครือข่ายจำหน่ายในภูมิภาค',
  '五金店/建材店': 'ร้านฮาร์ดแวร์ / ร้านวัสดุก่อสร้าง',
  '电商平台卖家': 'ผู้ขายบนแพลตฟอร์มอีคอมเมิร์ซ',
  '建筑工具供应商': 'ผู้จำหน่ายเครื่องมือก่อสร้าง',
  '申请人身份/职位': 'ตำแหน่งของผู้สมัคร',
  '公司负责人/老板': 'เจ้าของกิจการ / ผู้บริหารบริษัท',
  '销售负责人': 'ผู้จัดการฝ่ายขาย',
  '电商运营负责人': 'ผู้ดูแลอีคอมเมิร์ซ',
  '采购负责人': 'ผู้จัดการฝ่ายจัดซื้อ',
  '店铺经理': 'ผู้จัดการร้าน',
  '手机号码': 'หมายเลขโทรศัพท์มือถือ',
  '例如：0937281730 或 +66...': 'เช่น 0937281730 หรือ +66...',
  '请输入 8–20 位数字，可包含 +、空格或连字符。': 'กรอกตัวเลข 8–20 หลัก โดยใส่ + เว้นวรรค หรือขีดกลางได้',
  '您的信息仅用于经销商审核与合作联系': 'ข้อมูลของคุณใช้เพื่อการตรวจสอบตัวแทนจำหน่ายและการติดต่อความร่วมมือเท่านั้น',
  '上一步': 'ย้อนกลับ',
  '提交申请': 'ส่งใบสมัคร',
  '提交中...': 'กำลังส่ง...',
  '符合条件可申请样品测试': 'ผู้ที่ผ่านเกณฑ์สามารถขอทดสอบตัวอย่างได้',
  '我同意公司根据隐私政策收集和使用我的信息，用于经销商申请评估、联系、样品安排、市场调研和合作沟通。': 'ฉันยินยอมให้บริษัทเก็บรวบรวมและใช้ข้อมูลของฉันตามนโยบายความเป็นส่วนตัว เพื่อประเมินใบสมัครตัวแทนจำหน่าย ติดต่อ จัดตัวอย่าง วิจัยตลาด และสื่อสารความร่วมมือ',
  '✓ 已完成': '✓ กรอกแล้ว',
  '请填写': 'โปรดกรอก',
};

const TH_TO_ZH_TEXT = Object.entries(ZH_TO_TH_TEXT).reduce<Record<string, string>>(
  (result, [chinese, thai]) => {
    result[thai.replace(/\s+/g, ' ').trim()] = chinese;
    return result;
  },
  {}
);

type ApplicationFormData = {
  purchaseToolTypes: string[];
  purchasePreference: string;
  purchaseQuantity: string;
  toolAspects: string[];
  sampleWillingness: string;
  contactPersonName: string;
  companyName: string;
  companyType: string;
  applicantRole: string;
  contactPhone: string;
  privacyConsent: boolean;
};

const purchaseToolOptions = [
  '冲击钻/电钻',
  '角磨机',
  '电链锯',
  '冲击扳手',
  '电圆锯',
  '电锤/电镐',
  '绿篱机',
  '21V电池包',
  '其他'
];

const purchasePreferenceOptions = ['无绳工具为主', '有绳工具为主', '无绳与有绳都采购'];
const purchaseQuantityOptions = ['100件以下', '100–500件', '500件以上'];
const toolAspectsOptions = ['价格', '耐用性', '电池续航', '售后服务', '本地发货速度', '可定制性'];
const sampleWillingnessOptions = ['是，希望免费试用（需符合资格）', '是，可接受按批发价购买样品', '暂不需要样品，仅投票'];
const companyTypeOptions = ['电动工具经销商', '工业用品供应商', '批发商', '拥有区域渠道的公司', '五金店/建材店', '电商平台卖家', '建筑工具供应商', '其他'];
const applicantRoleOptions = ['公司负责人/老板', '销售负责人', '电商运营负责人', '采购负责人', '店铺经理', '其他'];

function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 border px-3 py-2 text-left font-paragraph text-sm transition-colors rounded-lg ${
        selected
          ? 'border-primary bg-primary/15 text-foreground'
          : 'border-muted-gray/30 bg-secondary/20 text-foreground/75 hover:border-primary/60 hover:text-foreground'
      }`}
    >
      <span className="flex items-center gap-2">
        <span className={`flex h-4 w-4 shrink-0 items-center justify-center border rounded-sm text-[10px] ${selected ? 'border-primary bg-primary text-black' : 'border-muted-gray/50'}`}>
          {selected ? '✓' : ''}
        </span>
        {children}
      </span>
    </button>
  );
}

export default function DealerApplicationPage() {
  const [siteLanguage, setSiteLanguage] = useState<SiteLanguage>('zh');
  const [languageReady, setLanguageReady] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const [openFormQuestion, setOpenFormQuestion] = useState('');
  const [formData, setFormData] = useState<ApplicationFormData>({
    purchaseToolTypes: [],
    purchasePreference: '',
    purchaseQuantity: '',
    toolAspects: [],
    sampleWillingness: '',
    contactPersonName: '',
    companyName: '',
    companyType: '',
    applicantRole: '',
    contactPhone: '',
    privacyConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Language initialization
  useEffect(() => {
    let savedLanguage: string | null = null;
    try {
      savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (error) {
      console.warn('Language preference storage is unavailable:', error);
    }

    const preferredLanguage: SiteLanguage =
      savedLanguage === 'zh' || savedLanguage === 'th'
        ? savedLanguage
        : window.navigator.language.toLowerCase().startsWith('th')
          ? 'th'
          : 'zh';

    setSiteLanguage(preferredLanguage);
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!languageReady) return;

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, siteLanguage);
    } catch (error) {
      console.warn('Language preference could not be saved:', error);
    }
    document.documentElement.lang = siteLanguage === 'th' ? 'th' : 'zh-CN';
    document.documentElement.dataset.locanexLanguage = siteLanguage;
  }, [siteLanguage, languageReady]);

  const handleInputChange = (field: keyof ApplicationFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (field: 'purchaseToolTypes' | 'toolAspects', value: string) => {
    setFormData(prev => {
      const selectedValues = prev[field] as string[];
      return {
        ...prev,
        [field]: selectedValues.includes(value)
          ? selectedValues.filter(item => item !== value)
          : [...selectedValues, value]
      };
    });
  };

  const isStep1Complete =
    formData.purchaseToolTypes.length > 0 &&
    Boolean(formData.purchasePreference) &&
    Boolean(formData.purchaseQuantity) &&
    formData.toolAspects.length > 0 &&
    Boolean(formData.sampleWillingness);

  const isStep2Complete =
    Boolean(formData.contactPersonName.trim()) &&
    Boolean(formData.companyName.trim()) &&
    Boolean(formData.companyType) &&
    Boolean(formData.applicantRole) &&
    /^[\+]?[0-9\s\-]{8,20}$/.test(formData.contactPhone.trim()) &&
    formData.privacyConsent;

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const purchaseProfile = [
        `常购工具：${formData.purchaseToolTypes.join('、') || '未填写'}`,
        `采购类型：${formData.purchasePreference || '未填写'}`,
        `单次采购量：${formData.purchaseQuantity || '未填写'}`,
        `关注因素：${formData.toolAspects.join('、') || '未填写'}`,
        `样品意向：${formData.sampleWillingness || '未填写'}`
      ].join('；');

      const applicationRecord = {
        _id: crypto.randomUUID(),
        companyName: formData.companyName,
        contactPersonName: formData.contactPersonName,
        contactPhone: formData.contactPhone,
        email: '',
        companyType: formData.companyType,
        applicantRole: formData.applicantRole,
        purchaseToolTypes: formData.purchaseToolTypes.join('、'),
        purchasePreference: formData.purchasePreference,
        purchaseQuantity: formData.purchaseQuantity,
        toolAspects: formData.toolAspects.join('、'),
        sampleWillingness: formData.sampleWillingness,
        purchaseProfile,
        privacyConsent: formData.privacyConsent
      } as unknown as Distributorapplications;

      await BaseCrudService.create<Distributorapplications>('distributorapplications', applicationRecord);

      // Send a Meta/Facebook Lead conversion only after the application
      // has been saved successfully. Tracking errors must never block or
      // invalidate the customer's submitted application.
      try {
        analytics.trackEvent('Lead', {
          category: 'DealerApplication',
          formId: 'locanex-dealer-application',
          label: 'Locanex Dealer Application Submitted',
          origin: 'Locanex Website'
        });
      } catch (trackingError) {
        console.warn('Failed to report Meta Lead conversion:', trackingError);
      }

      setFormData({
        purchaseToolTypes: [],
        purchasePreference: '',
        purchaseQuantity: '',
        toolAspects: [],
        sampleWillingness: '',
        contactPersonName: '',
        companyName: '',
        companyType: '',
        applicantRole: '',
        contactPhone: '',
        privacyConsent: false
      });
      setApplicationStep(1);
      setOpenFormQuestion('');
      alert(siteLanguage === 'th'
        ? 'ส่งใบสมัครเรียบร้อยแล้ว ทีมงานของเราจะติดต่อคุณภายใน 48 ชั่วโมง'
        : '申请已成功提交！我们的团队将在48小时内与您联系。');
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert(siteLanguage === 'th'
        ? 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่ภายหลัง'
        : '提交失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const translate = (text: string): string => {
    if (!languageReady) return text;
    const translationMap = siteLanguage === 'th' ? ZH_TO_TH_TEXT : TH_TO_ZH_TEXT;
    const normalized = text.replace(/\s+/g, ' ').trim();
    return translationMap[normalized] || text;
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-no-repeat bg-container"
        style={{
          backgroundImage: 'url("https://static.wixstatic.com/media/556c5c_12ad3dd671644e08ae2d784cc6f7b5cb~mv2.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'left bottom',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        {/* Responsive background position for mobile */}
        <style>{`
          @media (max-width: 768px) {
            .bg-container {
              background-image: url("https://static.wixstatic.com/media/556c5c_d8734ff9975a41a382e42ae31016af5b~mv2.png") !important;
              background-position: 42% center !important;
            }
          }
        `}</style>
        <div className="absolute inset-0 bg-black/15"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="h-[72px] border-b border-muted-gray/30 bg-black/50 backdrop-blur-md flex items-center px-4 sm:px-6 md:px-12">
          <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
            {/* Left: Locanex */}
            <div className="font-heading text-xl sm:text-2xl font-bold text-primary">Locanex</div>

            {/* Right: Navigation */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Back to Home */}
              <button
                onClick={() => window.location.href = '/'}
                className="font-paragraph text-xs sm:text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                {translate('返回官网')}
              </button>

              {/* Language Switch */}
              <div className="flex items-center border border-primary/55 bg-black/90 p-1">
                <Globe className="mx-1 h-3.5 w-3.5 text-primary" />
                <button
                  onClick={() => setSiteLanguage('zh')}
                  className={`min-h-8 px-2.5 font-paragraph text-[11px] transition-colors ${siteLanguage === 'zh' ? 'bg-primary text-black' : 'text-white/70 hover:text-white'}`}
                >
                  中文
                </button>
                <button
                  onClick={() => setSiteLanguage('th')}
                  className={`min-h-8 px-2.5 font-paragraph text-[11px] transition-colors ${siteLanguage === 'th' ? 'bg-primary text-black' : 'text-white/70 hover:text-white'}`}
                >
                  ไทย
                </button>
              </div>

              {/* LINE Consultation */}
              <a
                href={LINE_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-paragraph text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{translate('LINE咨询')}</span>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="pt-12 pb-24 px-4 sm:px-6 md:px-12">
          <div className="w-full max-w-[1440px] mx-auto">
            {/* Desktop: Two Column Layout */}
            <div className="hidden lg:grid lg:grid-cols-[0.4fr_0.6fr] lg:gap-12 lg:items-start">
              {/* Left Column: Introduction */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-4">
                  <span className="text-primary text-xs font-bold tracking-widest uppercase">THAILAND PARTNER PROGRAM</span>
                </div>

                <h1 className="font-heading text-4xl text-foreground mb-4 leading-tight">
                  {translate('申请成为 Locanex')}<br />
                  <span className="text-primary">{translate('泰国合作伙伴')}</span>
                </h1>

                <p className="font-paragraph text-base text-foreground/80 mb-8 leading-relaxed">
                  {translate('告诉我们您的采购需求与销售渠道，获取产品资料、合作方案及免费样品评估资格。')}
                </p>

                {/* Partnership Support Section */}
                <div className="mb-8">
                  <h3 className="font-heading text-lg text-foreground mb-6">{translate('与 Locanex 合作，你将获得')}</h3>

                  {/* 2x2 Grid + Full Width Item */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      {
                        title: translate('工厂直接供货'),
                        desc: translate('提供具有竞争力的供货方案与长期稳定的产品支持。')
                      },
                      {
                        title: translate('OEM / ODM 合作'),
                        desc: translate('支持品牌Logo、包装及基于当地市场需求的产品开发。')
                      },
                      {
                        title: translate('21V专业产品平台'),
                        desc: translate('覆盖电动工具、电池和充电器，便于组合销售与系列化经营。')
                      },
                      {
                        title: translate('样品与市场测试'),
                        desc: translate('符合条件的合作伙伴可申请样品，先进行产品和市场评估。')
                      }
                    ].map((item, i) => (
                      <div key={i} className="border border-primary/30 bg-black/40 p-3 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                          <h4 className="font-heading text-sm text-foreground">{item.title}</h4>
                        </div>
                        <p className="font-paragraph text-xs text-foreground/70 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}

                    {/* Full Width Item */}
                    <div className="col-span-2 border border-primary/30 bg-black/40 p-3 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <h4 className="font-heading text-sm text-foreground">{translate('泰国市场支持')}</h4>
                      </div>
                      <p className="font-paragraph text-xs text-foreground/70 leading-relaxed">{translate('提供产品资料、合作沟通及后续市场反馈优化支持。')}</p>
                    </div>
                  </div>
                </div>

                {/* Partner Types */}
                <div className="mb-8">
                  <h4 className="font-heading text-sm text-foreground mb-3">{translate('适合申请的合作伙伴')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      translate('电动工具渠道商'),
                      translate('五金／建材门店'),
                      translate('工业用品供应商'),
                      translate('批发及电商渠道')
                    ].map((tag, i) => (
                      <div key={i} className="border border-muted-gray/40 bg-black/30 px-3 py-2 rounded-lg">
                        <p className="font-paragraph text-xs text-foreground/75">{tag}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notice Box */}
                <div className="border border-primary rounded-lg bg-black/40 p-4">
                  <p className="font-paragraph text-xs text-foreground/70 leading-relaxed">
                    {translate('样品数量有限，提交申请不代表自动获得样品。我们将在审核经营信息后与您联系。')}
                  </p>
                </div>
              </motion.div>

              {/* Right Column: Application Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/95 border border-primary/30 rounded-2xl p-9 backdrop-blur-sm"
              >
                <h2 className="font-heading text-2xl text-foreground mb-2">{translate('样品申请单')}</h2>
                <p className="font-paragraph text-xs text-foreground/60 mb-8">{translate('预计填写时间：约2分钟')}</p>

                {/* Step Indicator */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${applicationStep >= 1 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold`}>
                    1
                  </div>
                  <span className="font-paragraph text-xs text-foreground/80">{translate('采购需求')}</span>
                  <div className={`flex-grow h-px ${applicationStep >= 2 ? 'bg-primary' : 'bg-muted-gray/30'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${applicationStep >= 2 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'} font-heading text-sm font-bold`}>
                    2
                  </div>
                  <span className="font-paragraph text-xs text-foreground/80">{translate('公司与联系方式')}</span>
                </div>

                {/* Form Content */}
                <div className="bg-secondary/20 border border-muted-gray/20 p-6 rounded-lg">
                  {applicationStep === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Accordion type="single" collapsible value={openFormQuestion} onValueChange={setOpenFormQuestion} className="space-y-3">
                        {/* Question 1 */}
                        <AccordionItem value="q1" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.purchaseToolTypes.length > 0 ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                01
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('经常采购的电动工具类型')}</span>
                              <span className={`ml-auto text-[11px] ${formData.purchaseToolTypes.length > 0 ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.purchaseToolTypes.length > 0 ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              {purchaseToolOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.purchaseToolTypes.includes(option)}
                                  onClick={() => toggleMultiSelect('purchaseToolTypes', option)}
                                >
                                  {translate(option)}
                                </ChoiceButton>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Question 2 */}
                        <AccordionItem value="q2" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.purchasePreference ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                02
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('主要采购无绳还是有绳工具')}</span>
                              <span className={`ml-auto text-[11px] ${formData.purchasePreference ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.purchasePreference ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="space-y-2">
                              {purchasePreferenceOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.purchasePreference === option}
                                  onClick={() => handleInputChange('purchasePreference', option)}
                                >
                                  {translate(option)}
                                </ChoiceButton>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Question 3 */}
                        <AccordionItem value="q3" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.purchaseQuantity ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                03
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('您单次五金采购量在多少')}</span>
                              <span className={`ml-auto text-[11px] ${formData.purchaseQuantity ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.purchaseQuantity ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="space-y-2">
                              {purchaseQuantityOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.purchaseQuantity === option}
                                  onClick={() => handleInputChange('purchaseQuantity', option)}
                                >
                                  {translate(option)}
                                </ChoiceButton>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Question 4 */}
                        <AccordionItem value="q4" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.toolAspects.length > 0 ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                04
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('您目前最看重工具的哪些方面？')}</span>
                              <span className={`ml-auto text-[11px] ${formData.toolAspects.length > 0 ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.toolAspects.length > 0 ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              {toolAspectsOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.toolAspects.includes(option)}
                                  onClick={() => toggleMultiSelect('toolAspects', option)}
                                >
                                  {translate(option)}
                                </ChoiceButton>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Question 5 */}
                        <AccordionItem value="q5" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.sampleWillingness ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                05
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('是否愿意接收样品试用？')}</span>
                              <span className={`ml-auto text-[11px] ${formData.sampleWillingness ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.sampleWillingness ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="space-y-2">
                              {sampleWillingnessOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.sampleWillingness === option}
                                  onClick={() => handleInputChange('sampleWillingness', option)}
                                >
                                  {translate(option)}
                                </ChoiceButton>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Button
                        className="w-full mt-6 rounded-lg bg-primary py-6 font-heading text-sm text-primary-foreground hover:bg-primary/90"
                        onClick={() => setApplicationStep(2)}
                        disabled={!isStep1Complete}
                      >
                        {translate('下一步：填写公司信息')}
                      </Button>
                    </motion.div>
                  )}

                  {applicationStep === 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Accordion type="single" collapsible value={openFormQuestion} onValueChange={setOpenFormQuestion} className="space-y-3">
                        {/* Contact Person Name */}
                        <AccordionItem value="name" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.contactPersonName.trim() ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                01
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('联系人姓名')}</span>
                              <span className={`ml-auto text-[11px] ${formData.contactPersonName.trim() ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.contactPersonName.trim() ? '✓ ' + translate('已完成') : translate('请填写')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <Input
                              value={formData.contactPersonName}
                              onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                              className="h-12 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary"
                              placeholder={translate('请输入联系人姓名')}
                            />
                          </AccordionContent>
                        </AccordionItem>

                        {/* Company Name */}
                        <AccordionItem value="company" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.companyName.trim() ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                02
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('公司或店铺名称')}</span>
                              <span className={`ml-auto text-[11px] ${formData.companyName.trim() ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.companyName.trim() ? '✓ ' + translate('已完成') : translate('请填写')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <Input
                              value={formData.companyName}
                              onChange={(e) => handleInputChange('companyName', e.target.value)}
                              className="h-12 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary"
                              placeholder={translate('请输入公司或店铺名称')}
                            />
                          </AccordionContent>
                        </AccordionItem>

                        {/* Company Type */}
                        <AccordionItem value="type" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.companyType ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                03
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('公司类型')}</span>
                              <span className={`ml-auto text-[11px] ${formData.companyType ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.companyType ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              {companyTypeOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.companyType === option}
                                  onClick={() => handleInputChange('companyType', option)}
                                >
                                  {translate(option)}
                                </ChoiceButton>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Applicant Role */}
                        <AccordionItem value="role" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.applicantRole ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                04
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('申请人身份/职位')}</span>
                              <span className={`ml-auto text-[11px] ${formData.applicantRole ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.applicantRole ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              {applicantRoleOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.applicantRole === option}
                                  onClick={() => handleInputChange('applicantRole', option)}
                                >
                                  {translate(option)}
                                </ChoiceButton>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Phone */}
                        <AccordionItem value="phone" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${/^[\+]?[0-9\s\-]{8,20}$/.test(formData.contactPhone.trim()) ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                05
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('手机号码')}</span>
                              <span className={`ml-auto text-[11px] ${/^[\+]?[0-9\s\-]{8,20}$/.test(formData.contactPhone.trim()) ? 'text-green-400' : 'text-foreground/45'}`}>
                                {/^[\+]?[0-9\s\-]{8,20}$/.test(formData.contactPhone.trim()) ? '✓ ' + translate('已完成') : translate('请填写')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <Input
                              type="tel"
                              value={formData.contactPhone}
                              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                              className="h-12 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary"
                              placeholder={translate('例如：0937281730 或 +66...')}
                            />
                            <p className="mt-2 font-paragraph text-xs text-foreground/45">{translate('请输入 8–20 位数字，可包含 +、空格或连字符。')}</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Privacy Consent */}
                      <button
                        type="button"
                        onClick={() => handleInputChange('privacyConsent', !formData.privacyConsent)}
                        className="mt-6 flex w-full items-start gap-3 text-left font-paragraph text-xs leading-5 text-foreground/65"
                      >
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border rounded-sm text-[10px] ${formData.privacyConsent ? 'border-primary bg-primary text-black' : 'border-muted-gray/50'}`}>
                          {formData.privacyConsent ? '✓' : ''}
                        </span>
                        <span>{translate('我同意公司根据隐私政策收集和使用我的信息，用于经销商申请评估、联系、样品安排、市场调研和合作沟通。')}</span>
                      </button>

                      {/* Buttons */}
                      <div className="mt-6 flex gap-4">
                        <Button
                          variant="outline"
                          className="w-1/3 rounded-lg border-muted-gray/50 py-6 font-heading text-sm text-foreground hover:bg-secondary"
                          onClick={() => setApplicationStep(1)}
                        >
                          {translate('上一步')}
                        </Button>
                        <Button
                          className="w-2/3 rounded-lg bg-primary py-6 font-heading text-sm text-primary-foreground hover:bg-primary/90"
                          onClick={handleSubmitApplication}
                          disabled={!isStep2Complete || isSubmitting}
                        >
                          {isSubmitting ? translate('提交中...') : translate('提交申请')}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Privacy Notice */}
                <div className="mt-6 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="font-paragraph text-xs text-foreground/60">{translate('您的信息仅用于合作伙伴资格审核、样品评估与合作联系')}</p>
                </div>
              </motion.div>
            </div>

            {/* Mobile: Single Column Layout */}
            <div className="lg:hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Introduction */}
                <div className="mb-8">
                  <div className="mb-4">
                    <span className="text-primary text-xs font-bold tracking-widest uppercase">THAILAND DEALER PROGRAM</span>
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">
                    {translate('申请成为 Locanex')}<br />
                    <span className="text-primary">{translate('泰国合作经销商')}</span>
                  </h1>
                  <p className="font-paragraph text-sm text-foreground/80 mb-6 leading-relaxed">
                    {translate('告诉我们您的采购需求与销售渠道，获取产品资料、经销方案及免费样品评估资格。')}
                  </p>

                  {/* Advantages */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: '📦', text: translate('工厂直接供货') },
                      { icon: '🔧', text: translate('OEM / ODM 合作') },
                      { icon: '✓', text: translate('符合条件可申请样品测试') }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-primary text-lg">{item.icon}</span>
                        <span className="font-paragraph text-xs text-foreground/80">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Notice Box */}
                  <div className="border border-primary rounded-lg bg-black/40 p-3 mb-8">
                    <p className="font-paragraph text-xs text-foreground/70 leading-relaxed">
                      {translate('样品数量有限，申请不代表自动获得样品。我们将在审核经营信息后与您联系。')}
                    </p>
                  </div>
                </div>

                {/* Application Card */}
                <div className="bg-black/95 border border-primary/30 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="font-heading text-xl text-foreground mb-1">{translate('经销商申请')}</h2>
                  <p className="font-paragraph text-xs text-foreground/60 mb-6">{translate('预计填写时间：约2分钟')}</p>

                  {/* Step Indicator */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-heading font-bold ${applicationStep >= 1 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'}`}>
                      1
                    </div>
                    <span className="font-paragraph text-xs text-foreground/80 flex-1">{translate('采购需求')}</span>
                    <div className={`flex-grow h-px ${applicationStep >= 2 ? 'bg-primary' : 'bg-muted-gray/30'}`}></div>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-heading font-bold ${applicationStep >= 2 ? 'bg-primary text-black' : 'bg-secondary text-muted-gray-foreground'}`}>
                      2
                    </div>
                    <span className="font-paragraph text-xs text-foreground/80 flex-1">{translate('公司信息')}</span>
                  </div>

                  {/* Form Content */}
                  <div className="bg-secondary/20 border border-muted-gray/20 p-4 rounded-lg">
                    {applicationStep === 1 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Accordion type="single" collapsible value={openFormQuestion} onValueChange={setOpenFormQuestion} className="space-y-2">
                          {/* Question 1 */}
                          <AccordionItem value="q1" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.purchaseToolTypes.length > 0 ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  01
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('经常采购的电动工具类型')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.purchaseToolTypes.length > 0 ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.purchaseToolTypes.length > 0 ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="grid grid-cols-2 gap-2">
                                {purchaseToolOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.purchaseToolTypes.includes(option)}
                                    onClick={() => toggleMultiSelect('purchaseToolTypes', option)}
                                  >
                                    {translate(option)}
                                  </ChoiceButton>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Question 2 */}
                          <AccordionItem value="q2" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.purchasePreference ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  02
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('主要采购无绳还是有绳工具')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.purchasePreference ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.purchasePreference ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="space-y-2">
                                {purchasePreferenceOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.purchasePreference === option}
                                    onClick={() => handleInputChange('purchasePreference', option)}
                                  >
                                    {translate(option)}
                                  </ChoiceButton>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Question 3 */}
                          <AccordionItem value="q3" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.purchaseQuantity ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  03
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('您单次五金采购量在多少')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.purchaseQuantity ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.purchaseQuantity ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="space-y-2">
                                {purchaseQuantityOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.purchaseQuantity === option}
                                    onClick={() => handleInputChange('purchaseQuantity', option)}
                                  >
                                    {translate(option)}
                                  </ChoiceButton>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Question 4 */}
                          <AccordionItem value="q4" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.toolAspects.length > 0 ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  04
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('您目前最看重工具的哪些方面？')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.toolAspects.length > 0 ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.toolAspects.length > 0 ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="grid grid-cols-2 gap-2">
                                {toolAspectsOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.toolAspects.includes(option)}
                                    onClick={() => toggleMultiSelect('toolAspects', option)}
                                  >
                                    {translate(option)}
                                  </ChoiceButton>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Question 5 */}
                          <AccordionItem value="q5" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.sampleWillingness ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  05
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('是否愿意接收样品试用？')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.sampleWillingness ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.sampleWillingness ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="space-y-2">
                                {sampleWillingnessOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.sampleWillingness === option}
                                    onClick={() => handleInputChange('sampleWillingness', option)}
                                  >
                                    {translate(option)}
                                  </ChoiceButton>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Button
                          className="w-full mt-4 rounded-lg bg-primary py-5 font-heading text-xs text-primary-foreground hover:bg-primary/90"
                          onClick={() => setApplicationStep(2)}
                          disabled={!isStep1Complete}
                        >
                          {translate('下一步：填写公司信息')}
                        </Button>
                      </motion.div>
                    )}

                    {applicationStep === 2 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Accordion type="single" collapsible value={openFormQuestion} onValueChange={setOpenFormQuestion} className="space-y-2">
                          {/* Contact Person Name */}
                          <AccordionItem value="name" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.contactPersonName.trim() ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  01
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('联系人姓名')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.contactPersonName.trim() ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.contactPersonName.trim() ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <Input
                                value={formData.contactPersonName}
                                onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                                className="h-10 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-xs"
                                placeholder={translate('请输入联系人姓名')}
                              />
                            </AccordionContent>
                          </AccordionItem>

                          {/* Company Name */}
                          <AccordionItem value="company" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.companyName.trim() ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  02
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('公司或店铺名称')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.companyName.trim() ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.companyName.trim() ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <Input
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                className="h-10 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-xs"
                                placeholder={translate('请输入公司或店铺名称')}
                              />
                            </AccordionContent>
                          </AccordionItem>

                          {/* Company Type */}
                          <AccordionItem value="type" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.companyType ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  03
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('公司类型')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.companyType ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.companyType ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="grid grid-cols-2 gap-2">
                                {companyTypeOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.companyType === option}
                                    onClick={() => handleInputChange('companyType', option)}
                                  >
                                    {translate(option)}
                                  </ChoiceButton>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Applicant Role */}
                          <AccordionItem value="role" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.applicantRole ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  04
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('申请人身份/职位')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.applicantRole ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.applicantRole ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="grid grid-cols-2 gap-2">
                                {applicantRoleOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.applicantRole === option}
                                    onClick={() => handleInputChange('applicantRole', option)}
                                  >
                                    {translate(option)}
                                  </ChoiceButton>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Phone */}
                          <AccordionItem value="phone" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${/^[\+]?[0-9\s\-]{8,20}$/.test(formData.contactPhone.trim()) ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  05
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('手机号码')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${/^[\+]?[0-9\s\-]{8,20}$/.test(formData.contactPhone.trim()) ? 'text-green-400' : 'text-foreground/45'}`}>
                                {/^[\+]?[0-9\s\-]{8,20}$/.test(formData.contactPhone.trim()) ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <Input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                className="h-10 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-xs"
                                placeholder={translate('例如：0937281730 或 +66...')}
                              />
                              <p className="mt-2 font-paragraph text-xs text-foreground/45">{translate('请输入 8–20 位数字，可包含 +、空格或连字符。')}</p>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {/* Privacy Consent */}
                        <button
                          type="button"
                          onClick={() => handleInputChange('privacyConsent', !formData.privacyConsent)}
                          className="mt-4 flex w-full items-start gap-2 text-left font-paragraph text-xs leading-4 text-foreground/65"
                        >
                          <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border rounded-sm text-[10px] flex-shrink-0 ${formData.privacyConsent ? 'border-primary bg-primary text-black' : 'border-muted-gray/50'}`}>
                            {formData.privacyConsent ? '✓' : ''}
                          </span>
                          <span>{translate('我同意公司根据隐私政策收集和使用我的信息，用于经销商申请评估、联系、样品安排、市场调研和合作沟通。')}</span>
                        </button>

                        {/* Buttons */}
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            className="w-1/3 rounded-lg border-muted-gray/50 py-4 font-heading text-xs text-foreground hover:bg-secondary"
                            onClick={() => setApplicationStep(1)}
                          >
                            {translate('上一步')}
                          </Button>
                          <Button
                            className="w-2/3 rounded-lg bg-primary py-4 font-heading text-xs text-primary-foreground hover:bg-primary/90"
                            onClick={handleSubmitApplication}
                            disabled={!isStep2Complete || isSubmitting}
                          >
                            {isSubmitting ? translate('提交中...') : translate('提交申请')}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Privacy Notice */}
                  <div className="mt-4 flex items-start gap-2">
                    <Lock className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="font-paragraph text-xs text-foreground/60">{translate('您的信息仅用于合作伙伴资格审核、样品评估与合作联系')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// LOCANEX quotation and paid-trial application form — Meta Lead tracking updated 2026-10-14
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Distributorapplications } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { analytics } from '@wix/site';
import { motion } from 'framer-motion';
import { Globe, Lock, MessageCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type SiteLanguage = 'zh' | 'th';
const LANGUAGE_STORAGE_KEY = 'locanex-site-language';
const CONTACT_PHONE_DISPLAY = '096-1277949';
const CONTACT_PHONE_NUMBER = '0961277949';
const LINE_CONTACT_URL = 'https://line.me/ti/p/_rt3tKZdtE';

// This standard Lead is forwarded by Wix to the connected Meta integration.
// Do not also call fbq('track', 'Lead') for the same successful submission.
// In Meta, verify content_name and content_category in the received event,
// then use the unique quote-form marker instead of relying on the page URL.
const QUOTE_LEAD_PARAMETERS = {
  category: 'LocanexQuoteApplication',
  formId: 'locanex-quote-application',
  label: 'Locanex Quote Application Submitted',
  origin: 'Locanex Quote Application'
};

function reportQuoteApplicationLead(): void {
  try {
    // Handle both synchronous SDK errors and asynchronous rejections without
    // waiting for analytics delivery or delaying the customer's success message.
    void Promise.resolve(analytics.trackEvent('Lead', { ...QUOTE_LEAD_PARAMETERS }))
      .catch((trackingError: unknown) => {
        console.warn('Failed to report Meta quote Lead conversion:', trackingError);
      });
  } catch (trackingError) {
    console.warn('Failed to report Meta quote Lead conversion:', trackingError);
  }
}

const ZH_TO_TH_TEXT: Record<string, string> = {
  "21V专业产品平台": "แพลตฟอร์มผลิตภัณฑ์มืออาชีพ 21V",
  "21V电池包": "แบตเตอรี่ 21V",
  "LINE ID或绑定手机号（选填）": "LINE ID หรือเบอร์โทรศัพท์ที่ผูกกับ LINE (ไม่บังคับ)",
  "LINE咨询": "ปรึกษาทาง LINE",
  "LOCANEX 批发采购": "จัดซื้อผลิตภัณฑ์ LOCANEX",
  "ODM产品开发": "พัฒนาผลิตภัณฑ์ ODM",
  "OEM / ODM 合作": "ความร่วมมือ OEM / ODM",
  "上一步": "ย้อนกลับ",
  "下一步：填写公司信息": "ถัดไป: กรอกข้อมูลบริษัท",
  "与 LOCANEX 合作，您将了解": "ร่วมงานกับ LOCANEX เพื่อรับข้อมูล",
  "与 OEM/ODM 合作": "และบริการ OEM/ODM",
  "五金店/建材店": "ร้านฮาร์ดแวร์ / ร้านวัสดุก่อสร้าง",
  "五金／建材门店": "ร้านฮาร์ดแวร์ / ร้านวัสดุก่อสร้าง",
  "交货时间": "ระยะเวลาส่งมอบ",
  "产品型号或补充需求（选填）": "รุ่นสินค้าหรือความต้องการเพิ่มเติม (ไม่บังคับ)",
  "产品配置（选填）": "สเปกหรืออุปกรณ์ในชุด (ไม่บังคับ)",
  "例如：0937281730 或 +66...": "เช่น 0937281730 หรือ +66...",
  "例如：冲击钻型号、用途或其他产品需求": "เช่น รุ่นสว่านกระแทก การใช้งาน หรือสินค้าอื่นที่ต้องการ",
  "例如：您的LINE ID；与手机号码不同也可填写": "เช่น LINE ID ของคุณ หรือเบอร์โทรศัพท์ที่ผูกกับ LINE",
  "先安排小批量付费试单": "ทดลองสั่งซื้อจำนวนน้อยแบบชำระเงินก่อน",
  "先沟通OEM/ODM定制方案": "หารือแผนปรับแต่ง OEM/ODM ก่อน",
  "先获取报价": "ขอใบเสนอราคาก่อน",
  "公司与联系方式": "บริษัทและข้อมูลติดต่อ",
  "公司信息": "ข้อมูลบริษัท",
  "公司或店铺名称": "ชื่อบริษัทหรือร้านค้า",
  "公司类型": "ประเภทธุรกิจ",
  "公司负责人/老板": "เจ้าของกิจการ / ผู้บริหารบริษัท",
  "其他": "อื่น ๆ",
  "冲击扳手": "บล็อกกระแทก",
  "冲击钻/电钻": "สว่านกระแทก / สว่านไฟฟ้า",
  "准备正式采购": "พร้อมจัดซื้อจริง",
  "品牌商": "เจ้าของแบรนด์",
  "品牌定制": "การปรับแต่งแบรนด์",
  "填写您的采购需求与经营信息，获取对应报价及合作方案。": "แจ้งความต้องการจัดซื้อและข้อมูลธุรกิจ เพื่อรับใบเสนอราคาและข้อเสนอความร่วมมือที่เหมาะสม",
  "小批量付费试单": "ทดลองสั่งซื้อจำนวนน้อยแบบชำระเงิน",
  "尚未确定，希望了解方案": "ยังไม่แน่ใจ ต้องการคำแนะนำ",
  "工业用品供应商": "ผู้จำหน่ายอุปกรณ์อุตสาหกรรม",
  "工具＋电池＋充电器套装": "ชุดเครื่องมือพร้อมแบตเตอรี่และเครื่องชาร์จ",
  "工厂直接供货": "จัดส่งตรงจากโรงงาน",
  "已完成": "กรอกแล้ว",
  "已确定数量，按产品填写": "มีจำนวนที่ต้องการแล้ว ระบุแยกตามสินค้า",
  "店铺经理": "ผู้จัดการร้าน",
  "建筑工具供应商": "ผู้จำหน่ายเครื่องมือก่อสร้าง",
  "性能": "ประสิทธิภาพ",
  "您希望先如何开展合作？": "คุณต้องการเริ่มความร่วมมืออย่างไร?",
  "您希望采用哪种合作方式？": "คุณต้องการความร่วมมือในรูปแบบใด?",
  "您的信息仅用于采购需求确认、询价回复与合作沟通。": "ข้อมูลใช้เพื่อยืนยันความต้องการจัดซื้อ ตอบกลับคำขอใบเสนอราคา และติดต่อเรื่องความร่วมมือ",
  "您的职位（选填）": "ตำแหน่งของคุณ (ไม่บังคับ)",
  "您选择产品时最看重哪些方面？（选填）": "คุณให้ความสำคัญกับด้านใดเมื่อเลือกสินค้า? (ไม่บังคับ)",
  "您首次预计采购多少？": "คุณคาดว่าจะจัดซื้อจำนวนเท่าไรในครั้งแรก?",
  "我同意公司根据隐私政策收集和使用我的信息，用于采购需求确认、询价回复与合作沟通。": "ฉันยินยอมให้บริษัทเก็บรวบรวมและใช้ข้อมูลตามนโยบายความเป็นส่วนตัว เพื่อยืนยันความต้องการจัดซื้อ ตอบกลับคำขอใบเสนอราคา และติดต่อเรื่องความร่วมมือ",
  "手机号码": "หมายเลขโทรศัพท์มือถือ",
  "批发、电商及品牌商": "ผู้ค้าส่ง ผู้ขายออนไลน์ และเจ้าของแบรนด์",
  "批发商": "ผู้ค้าส่ง",
  "报价根据产品型号、配置与采购数量确认；试单费用及交付条件由双方沟通。": "ยืนยันราคาตามรุ่น สเปก และจำนวนสั่งซื้อ โดยหารือค่าใช้จ่ายทดลองสั่งซื้อและเงื่อนไขส่งมอบร่วมกัน",
  "拥有区域渠道的公司": "บริษัทที่มีเครือข่ายจำหน่ายในภูมิภาค",
  "按产品填写预计数量（台/件）": "ระบุจำนวนที่คาดว่าจะสั่งซื้อแยกตามสินค้า (ชิ้น)",
  "提交中...": "กำลังส่ง...",
  "提交需求，获取报价": "ส่งข้อมูลเพื่อขอใบเสนอราคา",
  "提供产品资料、合作沟通及后续市场反馈优化支持。": "ให้ข้อมูลผลิตภัณฑ์ การสื่อสารความร่วมมือ และการสนับสนุนการปรับปรุงข้อเสนอแนะตลาดในภายหลัง",
  "支持品牌Logo、包装及基于当地市场需求的产品开发。": "สนับสนุนโลโก้แบรนด์ การบรรจุภัณฑ์ และการพัฒนาผลิตภัณฑ์ตามความต้องการของตลาดท้องถิ่น",
  "支持小批量付费试单": "รองรับการทดลองสั่งซื้อจำนวนน้อยแบบชำระเงิน",
  "数量待确认，需要选品建议": "ยังไม่ทราบจำนวน ต้องการคำแนะนำในการเลือกสินค้า",
  "数量暂未确定也可以提交，我们会进一步沟通选品与采购方案。": "หากยังไม่ทราบจำนวนก็สามารถส่งข้อมูลได้ เราจะหารือการเลือกสินค้าและแผนจัดซื้อเพิ่มเติม",
  "无绳与有绳都采购": "จัดซื้อทั้งแบบไร้สายและมีสาย",
  "无绳工具为主": "เครื่องมือไร้สายเป็นหลัก",
  "无绳或有绳偏好（选填）": "เครื่องมือไร้สายหรือแบบมีสาย (ไม่บังคับ)",
  "最多选择3项，不影响提交。": "เลือกได้สูงสุด 3 ข้อ และไม่จำเป็นต้องเลือกเพื่อส่งข้อมูล",
  "有绳工具为主": "เครื่องมือแบบมีสายเป็นหลัก",
  "本次您希望采购哪些产品？": "คุณสนใจจัดซื้อสินค้าประเภทใดในครั้งนี้?",
  "沟通付费试单安排，了解产品品质，再规划后续采购。": "หารือการทดลองสั่งซื้อแบบชำระเงิน เพื่อประเมินคุณภาพสินค้าก่อนวางแผนจัดซื้อครั้งต่อไป",
  "泰国市场支持": "การสนับสนุนตลาดไทย",
  "电动工具渠道商": "ผู้จัดจำหน่ายช่องทางเครื่องมือไฟฟ้า",
  "电动工具经销商": "ผู้จัดจำหน่ายเครื่องมือไฟฟ้า",
  "电商平台卖家": "ผู้ขายบนแพลตฟอร์มอีคอมเมิร์ซ",
  "电商运营负责人": "ผู้ดูแลอีคอมเมิร์ซ",
  "电圆锯": "เลื่อยวงเดือนไฟฟ้า",
  "电池或配件": "แบตเตอรี่หรืออุปกรณ์เสริม",
  "电池通用性": "การใช้แบตเตอรี่ร่วมกัน",
  "电链锯": "เลื่อยโซ่ไฟฟ้า",
  "电锤/电镐": "สว่านโรตารี่ / เครื่องสกัดไฟฟ้า",
  "直接采购 LOCANEX 产品，按型号、配置与数量沟通供货报价。": "ซื้อผลิตภัณฑ์ LOCANEX โดยตรง และรับราคาตามรุ่น สเปก และจำนวนสั่งซื้อ",
  "直接采购LOCANEX产品": "ซื้อผลิตภัณฑ์ LOCANEX โดยตรง",
  "绿篱机": "เครื่องตัดแต่งกิ่ง",
  "耐用性": "ความทนทาน",
  "联系人姓名": "ชื่อผู้ติดต่อ",
  "自有品牌OEM贴牌": "ผลิต OEM ภายใต้แบรนด์ของตนเอง",
  "获取最新价格与合作方案": "ขอราคาล่าสุดและข้อเสนอความร่วมมือ",
  "裸机": "เครื่องเปล่า",
  "覆盖电动工具、电池和充电器，便于组合销售与系列化经营。": "ครอบคลุมเครื่องมือไฟฟ้า แบตเตอรี่ และเครื่องชาร์จ เพื่อให้ง่ายต่อการขายแบบรวมและการจัดการแบบอนุกรม",
  "角磨机": "เครื่องเจียรไฟฟ้า",
  "请先选择意向产品。": "โปรดเลือกสินค้าที่สนใจก่อน",
  "请填写": "โปรดกรอก",
  "请输入8–20位数字，可包含国家区号、空格或连字符。": "กรอกตัวเลข 8–20 หลัก โดยใส่รหัสประเทศ เว้นวรรค หรือขีดกลางได้",
  "请输入公司或店铺名称": "กรุณากรอกชื่อบริษัทหรือร้านค้า",
  "请输入正整数": "กรอกจำนวนเต็มมากกว่า 0",
  "请输入联系人姓名": "กรุณากรอกชื่อผู้ติดต่อ",
  "请选择": "โปรดเลือก",
  "质保服务": "บริการรับประกัน",
  "返回官网": "กลับไปยังเว็บไซต์",
  "适合咨询的客户": "ลูกค้าที่เหมาะสำหรับสอบถาม",
  "选填": "ไม่บังคับ",
  "采购价格": "ราคาจัดซื้อ",
  "采购负责人": "ผู้จัดการฝ่ายจัดซื้อ",
  "采购需求": "ความต้องการจัดซื้อ",
  "销售负责人": "ผู้จัดการฝ่ายขาย",
  "需要推荐配置": "ต้องการคำแนะนำเรื่องสเปก",
  "预计填写时间：约2分钟": "เวลาที่คาดว่าจะใช้: ประมาณ 2 นาที"
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
  cooperationMode: string;
  productConfiguration: string;
  productModel: string;
  purchaseQuantities: Record<string, string>;
  purchaseQuantity: string;
  toolAspects: string[];
  cooperationStage: string;
  contactPersonName: string;
  companyName: string;
  companyType: string;
  applicantRole: string;
  contactPhone: string;
  lineId: string;
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
const cooperationModeOptions = ["直接采购LOCANEX产品", "自有品牌OEM贴牌", "ODM产品开发", "尚未确定，希望了解方案"];
const productConfigurationOptions = ["裸机", "工具＋电池＋充电器套装", "电池或配件", "需要推荐配置"];
const purchaseQuantityOptions = ["已确定数量，按产品填写", "数量待确认，需要选品建议"];
const toolAspectsOptions = ["采购价格", "性能", "耐用性", "电池通用性", "质保服务", "交货时间", "品牌定制"];
const cooperationStageOptions = ["先获取报价", "先安排小批量付费试单", "准备正式采购", "先沟通OEM/ODM定制方案"];
const companyTypeOptions = ['电动工具经销商', '工业用品供应商', '批发商', '拥有区域渠道的公司', '五金店/建材店', '电商平台卖家', '建筑工具供应商', '品牌商', '其他'];
const applicantRoleOptions = ['公司负责人/老板', '销售负责人', '电商运营负责人', '采购负责人', '店铺经理', '其他'];

const createInitialFormData = (): ApplicationFormData => ({
  purchaseToolTypes: [],
  purchasePreference: '',
  cooperationMode: '',
  productConfiguration: '',
  productModel: '',
  purchaseQuantity: '',
  purchaseQuantities: {},
  toolAspects: [],
  cooperationStage: '',
  contactPersonName: '',
  companyName: '',
  companyType: '',
  applicantRole: '',
  contactPhone: '',
  lineId: '',
  privacyConsent: false
});

const isValidContactPhone = (value: string): boolean => {
  const phone = value.trim();
  if (!/^\+?[0-9\s-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 20;
};

const isValidQuantity = (value: string): boolean =>
  /^\d+$/.test(value.trim()) && Number.isSafeInteger(Number(value)) && Number(value) > 0;

const isPurchaseQuantityComplete = (data: ApplicationFormData): boolean =>
  data.purchaseQuantity === '数量待确认，需要选品建议' ||
  (data.purchaseQuantity === '已确定数量，按产品填写' &&
    data.purchaseToolTypes.length > 0 &&
    data.purchaseToolTypes.every(product => isValidQuantity(data.purchaseQuantities[product] || '')));

const isPurchaseStepComplete = (data: ApplicationFormData): boolean =>
  data.purchaseToolTypes.length > 0 &&
  cooperationModeOptions.includes(data.cooperationMode) &&
  isPurchaseQuantityComplete(data) &&
  cooperationStageOptions.includes(data.cooperationStage);

const isContactStepComplete = (data: ApplicationFormData): boolean =>
  Boolean(data.contactPersonName.trim()) && Boolean(data.companyName.trim()) &&
  companyTypeOptions.includes(data.companyType) && isValidContactPhone(data.contactPhone) &&
  data.privacyConsent;

const formatPurchaseQuantity = (data: ApplicationFormData): string =>
  data.purchaseQuantity === '数量待确认，需要选品建议'
    ? data.purchaseQuantity
    : data.purchaseToolTypes.map(product => `${product}：${data.purchaseQuantities[product].trim()}台/件`).join('、');

const buildPurchaseProfile = (data: ApplicationFormData): string => [
  `意向产品：${data.purchaseToolTypes.join('、')}`,
  `合作方式：${data.cooperationMode}`,
  `型号/补充需求：${data.productModel.trim() || '待沟通确认'}`,
  `产品配置：${data.productConfiguration || '待沟通确认'}`,
  `无绳/有绳偏好：${data.purchasePreference || '待沟通确认'}`,
  `首次采购数量：${formatPurchaseQuantity(data)}`,
  `关注因素：${data.toolAspects.join('、') || '未填写（选填）'}`,
  `合作阶段：${data.cooperationStage}`,
  `LINE联系方式：${data.lineId.trim() || '未填写（可通过手机号联系）'}`
].join('；');

function ChoiceButton({ selected, onClick, children, disabled = false }: { selected: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-11 border px-3 py-2 text-left font-paragraph text-sm transition-colors rounded-lg disabled:cursor-not-allowed disabled:opacity-45 ${
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
  const [siteLanguage, setSiteLanguage] = useState<SiteLanguage>('th');
  const [languageReady, setLanguageReady] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const [openFormQuestion, setOpenFormQuestion] = useState('');
  const [formData, setFormData] = useState<ApplicationFormData>(createInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInFlight = useRef(false);

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
        : 'th';

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
    document.title = siteLanguage === 'th'
      ? 'LOCANEX | ขอราคาล่าสุดและบริการ OEM/ODM'
      : 'LOCANEX | 获取最新价格与 OEM/ODM 合作方案';
  }, [siteLanguage, languageReady]);

  const handleInputChange = (field: keyof ApplicationFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (field: 'purchaseToolTypes' | 'toolAspects', value: string) => {
    setFormData(prev => {
      const selected = prev[field];
      if (field === 'toolAspects' && !selected.includes(value) && selected.length >= 3) return prev;
      const next = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
      if (field === 'purchaseToolTypes' && selected.includes(value)) {
        const quantities = { ...prev.purchaseQuantities };
        delete quantities[value];
        return { ...prev, purchaseToolTypes: next, purchaseQuantities: quantities };
      }
      return { ...prev, [field]: next };
    });
  };

  const handleQuantityChange = (product: string, value: string) => {
    setFormData(prev => ({ ...prev, purchaseQuantities: { ...prev.purchaseQuantities, [product]: value } }));
  };

  const isStep1Complete = isPurchaseStepComplete(formData);
  const isStep2Complete = isContactStepComplete(formData);

  const handleSubmitApplication = async () => {
    if (!isStep1Complete || !isStep2Complete || submissionInFlight.current) return;
    submissionInFlight.current = true;
    setIsSubmitting(true);
    try {
      const purchaseProfile = buildPurchaseProfile(formData);

      const applicationRecord = {
        _id: crypto.randomUUID(),
        companyName: formData.companyName.trim(),
        contactPersonName: formData.contactPersonName.trim(),
        contactPhone: formData.contactPhone.trim(),
        email: '',
        companyType: formData.companyType,
        applicantRole: formData.applicantRole,
        purchaseToolTypes: formData.purchaseToolTypes.join('、'),
        purchasePreference: formData.purchasePreference,
        purchaseQuantity: formatPurchaseQuantity(formData),
        toolAspects: formData.toolAspects.join('、'),
        // Legacy CMS field retained for compatibility; the value now describes the cooperation stage.
        sampleWillingness: formData.cooperationStage,
        purchaseProfile,
        privacyConsent: formData.privacyConsent
      } as unknown as Distributorapplications;

      await BaseCrudService.create<Distributorapplications>('distributorapplications', applicationRecord);

      // Report exactly once from this handler, only after successful CMS save.
      // Opening the form, validation failures and failed saves are not Leads.
      reportQuoteApplicationLead();

      setFormData(createInitialFormData());
      setApplicationStep(1);
      setOpenFormQuestion('');
      alert(siteLanguage === 'th'
        ? 'ส่งความต้องการจัดซื้อเรียบร้อยแล้ว ทีมงานของเราจะติดต่อคุณภายใน 48 ชั่วโมง'
        : '采购需求已成功提交！我们的团队将在48小时内与您联系。');
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert(siteLanguage === 'th'
        ? 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่ภายหลัง'
        : '提交失败，请稍后重试。');
    } finally {
      submissionInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const translate = (text: string): string => {
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

              <a href={`tel:${CONTACT_PHONE_NUMBER}`} className="hidden font-paragraph text-xs text-foreground/80 hover:text-primary sm:inline sm:text-sm">
                {CONTACT_PHONE_DISPLAY}
              </a>

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
                  <span className="text-primary text-xs font-bold tracking-widest uppercase">{'LOCANEX PROCUREMENT & OEM/ODM'}</span>
                </div>

                <h1 className="font-heading text-4xl text-foreground mb-4 leading-tight">
                  {translate('LOCANEX 批发采购')}<br />
                  <span className="text-primary">{translate('与 OEM/ODM 合作')}</span>
                </h1>

                <p className="font-paragraph text-base text-foreground/80 mb-8 leading-relaxed">
                  {translate('填写您的采购需求与经营信息，获取对应报价及合作方案。')}
                </p>

                {/* Partnership Support Section */}
                <div className="mb-8">
                  <h3 className="font-heading text-lg text-foreground mb-6">{translate('与 LOCANEX 合作，您将了解')}</h3>

                  {/* 2x2 Grid + Full Width Item */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      {
                        title: translate('工厂直接供货'),
                        desc: translate('直接采购 LOCANEX 产品，按型号、配置与数量沟通供货报价。')
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
                        title: translate('小批量付费试单'),
                        desc: translate('沟通付费试单安排，了解产品品质，再规划后续采购。')
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
                  <h4 className="font-heading text-sm text-foreground mb-3">{translate('适合咨询的客户')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      translate('电动工具渠道商'),
                      translate('五金／建材门店'),
                      translate('工业用品供应商'),
                      translate('批发、电商及品牌商')
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
                    {translate('报价根据产品型号、配置与采购数量确认；试单费用及交付条件由双方沟通。')}
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
                <h2 className="font-heading text-2xl text-foreground mb-2">{translate('获取最新价格与合作方案')}</h2>
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
                              <span className="font-paragraph text-sm text-foreground">{translate('本次您希望采购哪些产品？')}</span>
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

                            <div className="mt-5 space-y-4 border-t border-muted-gray/20 pt-4">
                              <div>
                                <p className="mb-2 font-paragraph text-xs text-foreground/70">{translate('产品型号或补充需求（选填）')}</p>
                                <Input
                                  value={formData.productModel}
                                  onChange={(e) => handleInputChange('productModel', e.target.value)}
                                  maxLength={300}
                                  aria-label={translate('产品型号或补充需求（选填）')}
                                  placeholder={translate('例如：冲击钻型号、用途或其他产品需求')}
                                  className="h-11 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-sm"
                                />
                              </div>
                              <div>
                                <p className="mb-2 font-paragraph text-xs text-foreground/70">{translate('产品配置（选填）')}</p>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  {productConfigurationOptions.map(option => (
                                    <ChoiceButton key={option} selected={formData.productConfiguration === option}
                                      onClick={() => handleInputChange('productConfiguration', formData.productConfiguration === option ? '' : option)}>
                                      {translate(option)}
                                    </ChoiceButton>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="mb-2 font-paragraph text-xs text-foreground/70">{translate('无绳或有绳偏好（选填）')}</p>
                                <div className="grid grid-cols-1 gap-2">
                                  {purchasePreferenceOptions.map(option => (
                                    <ChoiceButton key={option} selected={formData.purchasePreference === option}
                                      onClick={() => handleInputChange('purchasePreference', formData.purchasePreference === option ? '' : option)}>
                                      {translate(option)}
                                    </ChoiceButton>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Question 2 */}
                        <AccordionItem value="q2" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.cooperationMode ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                02
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('您希望采用哪种合作方式？')}</span>
                              <span className={`ml-auto text-[11px] ${formData.cooperationMode ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.cooperationMode ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="space-y-2">
                              {cooperationModeOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.cooperationMode === option}
                                  onClick={() => handleInputChange('cooperationMode', option)}
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
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${isPurchaseQuantityComplete(formData) ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                03
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('您首次预计采购多少？')}</span>
                              <span className={`ml-auto text-[11px] ${isPurchaseQuantityComplete(formData) ? 'text-green-400' : 'text-foreground/45'}`}>
                                {isPurchaseQuantityComplete(formData) ? '✓ ' + translate('已完成') : translate('请选择')}
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

                              {formData.purchaseQuantity === '已确定数量，按产品填写' && (
                                <div className="mt-4 space-y-3 border-t border-muted-gray/20 pt-4">
                                  <p className="font-paragraph text-xs text-foreground/70">{translate('按产品填写预计数量（台/件）')}</p>
                                  {formData.purchaseToolTypes.length === 0 && (
                                    <p className="font-paragraph text-xs text-primary">{translate('请先选择意向产品。')}</p>
                                  )}
                                  {formData.purchaseToolTypes.map(product => (
                                    <label key={product} className="grid grid-cols-[1fr_110px] items-center gap-3 font-paragraph text-sm text-foreground/80">
                                      <span>{translate(product)}</span>
                                      <Input type="number" min={1} step={1} inputMode="numeric"
                                        value={formData.purchaseQuantities[product] || ''}
                                        onChange={(e) => handleQuantityChange(product, e.target.value)}
                                        aria-label={translate(product) + ' — ' + translate('按产品填写预计数量（台/件）')}
                                        placeholder={translate('请输入正整数')}
                                        className="h-11 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-sm" />
                                    </label>
                                  ))}
                                </div>
                              )}
                              <p className="mt-3 font-paragraph text-xs leading-5 text-foreground/50">{translate('数量暂未确定也可以提交，我们会进一步沟通选品与采购方案。')}</p>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Question 4 */}
                        <AccordionItem value="q4" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.toolAspects.length > 0 ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                04
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('您选择产品时最看重哪些方面？（选填）')}</span>
                              <span className={`ml-auto text-[11px] ${formData.toolAspects.length > 0 ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.toolAspects.length > 0 ? '✓ ' + translate('已完成') : translate('选填')}
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
                                  disabled={formData.toolAspects.length >= 3 && !formData.toolAspects.includes(option)}
                                >
                                  {translate(option)}
                                </ChoiceButton>
                              ))}
                            </div>
                          <p className="mt-3 font-paragraph text-xs text-foreground/50">{translate('最多选择3项，不影响提交。')}</p>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Question 5 */}
                        <AccordionItem value="q5" className="border border-muted-gray/25 bg-background/40 px-4">
                          <AccordionTrigger className="py-4 text-left hover:no-underline [&>svg]:text-primary">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${formData.cooperationStage ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                05
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('您希望先如何开展合作？')}</span>
                              <span className={`ml-auto text-[11px] ${formData.cooperationStage ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.cooperationStage ? '✓ ' + translate('已完成') : translate('请选择')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="space-y-2">
                              {cooperationStageOptions.map(option => (
                                <ChoiceButton
                                  key={option}
                                  selected={formData.cooperationStage === option}
                                  onClick={() => handleInputChange('cooperationStage', option)}
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
                        onClick={() => { if (isStep1Complete) { setApplicationStep(2); setOpenFormQuestion(''); } }}
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
                              aria-label={translate('联系人姓名')}
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
                              aria-label={translate('公司或店铺名称')}
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
                              <span className="font-paragraph text-sm text-foreground">{translate('您的职位（选填）')}</span>
                              <span className={`ml-auto text-[11px] ${formData.applicantRole ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.applicantRole ? '✓ ' + translate('已完成') : translate('选填')}
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
                              <span className={`flex h-7 w-7 items-center justify-center border text-[11px] font-heading ${isValidContactPhone(formData.contactPhone) ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                05
                              </span>
                              <span className="font-paragraph text-sm text-foreground">{translate('手机号码')}</span>
                              <span className={`ml-auto text-[11px] ${isValidContactPhone(formData.contactPhone) ? 'text-green-400' : 'text-foreground/45'}`}>
                                {isValidContactPhone(formData.contactPhone) ? '✓ ' + translate('已完成') : translate('请填写')}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <Input
                              aria-label={translate('手机号码')}
                              type="tel"
                              value={formData.contactPhone}
                              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                              className="h-12 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary"
                              placeholder={translate('例如：0937281730 或 +66...')}
                            />
                            <p className="mt-2 font-paragraph text-xs text-foreground/45">{translate('请输入8–20位数字，可包含国家区号、空格或连字符。')}</p>

                            <div className="mt-4 border-t border-muted-gray/20 pt-4">
                              <label className="block font-paragraph text-xs text-foreground/70">
                                <span className="mb-2 block">{translate('LINE ID或绑定手机号（选填）')}</span>
                                <Input value={formData.lineId}
                                  onChange={(e) => handleInputChange('lineId', e.target.value)}
                                  maxLength={100}
                                  aria-label={translate('LINE ID或绑定手机号（选填）')}
                                  placeholder={translate('例如：您的LINE ID；与手机号码不同也可填写')}
                                  className="h-11 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-sm" />
                              </label>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Privacy Consent */}
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={formData.privacyConsent}
                        onClick={() => handleInputChange('privacyConsent', !formData.privacyConsent)}
                        className="mt-6 flex w-full items-start gap-3 text-left font-paragraph text-xs leading-5 text-foreground/65"
                      >
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border rounded-sm text-[10px] ${formData.privacyConsent ? 'border-primary bg-primary text-black' : 'border-muted-gray/50'}`}>
                          {formData.privacyConsent ? '✓' : ''}
                        </span>
                        <span>{translate('我同意公司根据隐私政策收集和使用我的信息，用于采购需求确认、询价回复与合作沟通。')}</span>
                      </button>

                      {/* Buttons */}
                      <div className="mt-6 flex gap-4">
                        <Button
                          variant="outline"
                          className="w-1/3 rounded-lg border-muted-gray/50 py-6 font-heading text-sm text-foreground hover:bg-secondary"
                          onClick={() => { setApplicationStep(1); setOpenFormQuestion(''); }}
                        >
                          {translate('上一步')}
                        </Button>
                        <Button
                          className="w-2/3 rounded-lg bg-primary py-6 font-heading text-sm text-primary-foreground hover:bg-primary/90"
                          onClick={handleSubmitApplication}
                          disabled={!isStep1Complete || !isStep2Complete || isSubmitting}
                        >
                          {isSubmitting ? translate('提交中...') : translate('提交需求，获取报价')}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Privacy Notice */}
                <div className="mt-6 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="font-paragraph text-xs text-foreground/60">{translate('您的信息仅用于采购需求确认、询价回复与合作沟通。')}</p>
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
                    <span className="text-primary text-xs font-bold tracking-widest uppercase">{'LOCANEX PROCUREMENT & OEM/ODM'}</span>
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-4 leading-tight">
                    {translate('LOCANEX 批发采购')}<br />
                    <span className="text-primary">{translate('与 OEM/ODM 合作')}</span>
                  </h1>
                  <p className="font-paragraph text-sm text-foreground/80 mb-6 leading-relaxed">
                    {translate('填写您的采购需求与经营信息，获取对应报价及合作方案。')}
                  </p>

                  {/* Advantages */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: '📦', text: translate('工厂直接供货') },
                      { icon: '🔧', text: translate('OEM / ODM 合作') },
                      { icon: '✓', text: translate('支持小批量付费试单') }
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
                      {translate('报价根据产品型号、配置与采购数量确认；试单费用及交付条件由双方沟通。')}
                    </p>
                  </div>
                </div>

                {/* Application Card */}
                <div className="bg-black/95 border border-primary/30 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="font-heading text-xl text-foreground mb-1">{translate('获取最新价格与合作方案')}</h2>
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
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('本次您希望采购哪些产品？')}</span>
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

                            <div className="mt-5 space-y-4 border-t border-muted-gray/20 pt-4">
                              <div>
                                <p className="mb-2 font-paragraph text-xs text-foreground/70">{translate('产品型号或补充需求（选填）')}</p>
                                <Input
                                  value={formData.productModel}
                                  onChange={(e) => handleInputChange('productModel', e.target.value)}
                                  maxLength={300}
                                  aria-label={translate('产品型号或补充需求（选填）')}
                                  placeholder={translate('例如：冲击钻型号、用途或其他产品需求')}
                                  className="h-11 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-sm"
                                />
                              </div>
                              <div>
                                <p className="mb-2 font-paragraph text-xs text-foreground/70">{translate('产品配置（选填）')}</p>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  {productConfigurationOptions.map(option => (
                                    <ChoiceButton key={option} selected={formData.productConfiguration === option}
                                      onClick={() => handleInputChange('productConfiguration', formData.productConfiguration === option ? '' : option)}>
                                      {translate(option)}
                                    </ChoiceButton>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="mb-2 font-paragraph text-xs text-foreground/70">{translate('无绳或有绳偏好（选填）')}</p>
                                <div className="grid grid-cols-1 gap-2">
                                  {purchasePreferenceOptions.map(option => (
                                    <ChoiceButton key={option} selected={formData.purchasePreference === option}
                                      onClick={() => handleInputChange('purchasePreference', formData.purchasePreference === option ? '' : option)}>
                                      {translate(option)}
                                    </ChoiceButton>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                          </AccordionItem>

                          {/* Question 2 */}
                          <AccordionItem value="q2" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.cooperationMode ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  02
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('您希望采用哪种合作方式？')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.cooperationMode ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.cooperationMode ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="space-y-2">
                                {cooperationModeOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.cooperationMode === option}
                                    onClick={() => handleInputChange('cooperationMode', option)}
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
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${isPurchaseQuantityComplete(formData) ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  03
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('您首次预计采购多少？')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${isPurchaseQuantityComplete(formData) ? 'text-green-400' : 'text-foreground/45'}`}>
                                {isPurchaseQuantityComplete(formData) ? '✓' : ''}
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

                              {formData.purchaseQuantity === '已确定数量，按产品填写' && (
                                <div className="mt-4 space-y-3 border-t border-muted-gray/20 pt-4">
                                  <p className="font-paragraph text-xs text-foreground/70">{translate('按产品填写预计数量（台/件）')}</p>
                                  {formData.purchaseToolTypes.length === 0 && (
                                    <p className="font-paragraph text-xs text-primary">{translate('请先选择意向产品。')}</p>
                                  )}
                                  {formData.purchaseToolTypes.map(product => (
                                    <label key={product} className="grid grid-cols-[1fr_110px] items-center gap-3 font-paragraph text-sm text-foreground/80">
                                      <span>{translate(product)}</span>
                                      <Input type="number" min={1} step={1} inputMode="numeric"
                                        value={formData.purchaseQuantities[product] || ''}
                                        onChange={(e) => handleQuantityChange(product, e.target.value)}
                                        aria-label={translate(product) + ' — ' + translate('按产品填写预计数量（台/件）')}
                                        placeholder={translate('请输入正整数')}
                                        className="h-11 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-sm" />
                                    </label>
                                  ))}
                                </div>
                              )}
                              <p className="mt-3 font-paragraph text-xs leading-5 text-foreground/50">{translate('数量暂未确定也可以提交，我们会进一步沟通选品与采购方案。')}</p>
                          </AccordionContent>
                          </AccordionItem>

                          {/* Question 4 */}
                          <AccordionItem value="q4" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.toolAspects.length > 0 ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  04
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('您选择产品时最看重哪些方面？（选填）')}</span>
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
                                  disabled={formData.toolAspects.length >= 3 && !formData.toolAspects.includes(option)}
                                  >
                                    {translate(option)}
                                  </ChoiceButton>
                                ))}
                              </div>
                            <p className="mt-3 font-paragraph text-xs text-foreground/50">{translate('最多选择3项，不影响提交。')}</p>
                          </AccordionContent>
                          </AccordionItem>

                          {/* Question 5 */}
                          <AccordionItem value="q5" className="border border-muted-gray/25 bg-background/40 px-3">
                            <AccordionTrigger className="py-3 text-left hover:no-underline [&>svg]:text-primary">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${formData.cooperationStage ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  05
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('您希望先如何开展合作？')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${formData.cooperationStage ? 'text-green-400' : 'text-foreground/45'}`}>
                                {formData.cooperationStage ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <div className="space-y-2">
                                {cooperationStageOptions.map(option => (
                                  <ChoiceButton
                                    key={option}
                                    selected={formData.cooperationStage === option}
                                    onClick={() => handleInputChange('cooperationStage', option)}
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
                          onClick={() => { if (isStep1Complete) { setApplicationStep(2); setOpenFormQuestion(''); } }}
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
                              aria-label={translate('联系人姓名')}
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
                              aria-label={translate('公司或店铺名称')}
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
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('您的职位（选填）')}</span>
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
                                <span className={`flex h-6 w-6 items-center justify-center border text-[10px] font-heading flex-shrink-0 ${isValidContactPhone(formData.contactPhone) ? 'border-primary bg-primary text-black' : 'border-primary/50 text-primary'}`}>
                                  05
                                </span>
                                <span className="font-paragraph text-xs text-foreground text-left">{translate('手机号码')}</span>
                              </div>
                              <span className={`text-[10px] ml-2 flex-shrink-0 ${isValidContactPhone(formData.contactPhone) ? 'text-green-400' : 'text-foreground/45'}`}>
                                {isValidContactPhone(formData.contactPhone) ? '✓' : ''}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 pt-2">
                              <Input
                              aria-label={translate('手机号码')}
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                className="h-10 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-xs"
                                placeholder={translate('例如：0937281730 或 +66...')}
                              />
                              <p className="mt-2 font-paragraph text-xs text-foreground/45">{translate('请输入8–20位数字，可包含国家区号、空格或连字符。')}</p>

                            <div className="mt-4 border-t border-muted-gray/20 pt-4">
                              <label className="block font-paragraph text-xs text-foreground/70">
                                <span className="mb-2 block">{translate('LINE ID或绑定手机号（选填）')}</span>
                                <Input value={formData.lineId}
                                  onChange={(e) => handleInputChange('lineId', e.target.value)}
                                  maxLength={100}
                                  aria-label={translate('LINE ID或绑定手机号（选填）')}
                                  placeholder={translate('例如：您的LINE ID；与手机号码不同也可填写')}
                                  className="h-11 rounded-lg border-muted-gray/30 bg-background text-foreground focus-visible:ring-primary text-sm" />
                              </label>
                            </div>
                          </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {/* Privacy Consent */}
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={formData.privacyConsent}
                          onClick={() => handleInputChange('privacyConsent', !formData.privacyConsent)}
                          className="mt-4 flex w-full items-start gap-2 text-left font-paragraph text-xs leading-4 text-foreground/65"
                        >
                          <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border rounded-sm text-[10px] flex-shrink-0 ${formData.privacyConsent ? 'border-primary bg-primary text-black' : 'border-muted-gray/50'}`}>
                            {formData.privacyConsent ? '✓' : ''}
                          </span>
                          <span>{translate('我同意公司根据隐私政策收集和使用我的信息，用于采购需求确认、询价回复与合作沟通。')}</span>
                        </button>

                        {/* Buttons */}
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            className="w-1/3 rounded-lg border-muted-gray/50 py-4 font-heading text-xs text-foreground hover:bg-secondary"
                            onClick={() => { setApplicationStep(1); setOpenFormQuestion(''); }}
                          >
                            {translate('上一步')}
                          </Button>
                          <Button
                            className="w-2/3 rounded-lg bg-primary py-4 font-heading text-xs text-primary-foreground hover:bg-primary/90"
                            onClick={handleSubmitApplication}
                            disabled={!isStep1Complete || !isStep2Complete || isSubmitting}
                          >
                            {isSubmitting ? translate('提交中...') : translate('提交需求，获取报价')}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Privacy Notice */}
                  <div className="mt-4 flex items-start gap-2">
                    <Lock className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="font-paragraph text-xs text-foreground/60">{translate('您的信息仅用于采购需求确认、询价回复与合作沟通。')}</p>
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

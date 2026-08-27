import { Image } from '@/components/ui/image';
import { items } from "@wix/data";
import { analytics } from "@wix/site";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

const HERO_BACKGROUND_URL =
  "https://static.wixstatic.com/media/556c5c_263f6f6f3b5a41409fa0ce2d622b8d90~mv2.png";
const SURVEY_BACKGROUND_URL = "";
const SUBMISSION_COLLECTION_ID = "Import1";

// Upload the second-screen background to Wix, then paste its media URL into
// SURVEY_BACKGROUND_URL. A prop can still override it when this page is embedded.
// Form submissions are stored in the Import1 CMS collection.
// The collection must allow visitors to create items while restricting read,
// update and delete permissions to site administrators and collaborators.

const PRODUCTS = [
  {
    id: "drill",
    name: "21V无刷冲击钻",
    image:
      "https://static.wixstatic.com/media/556c5c_fe8604ea88f940a980f5136f92e0d0c1~mv2.png",
    priceBasis: "单主机，不含电池及充电器",
    priceTiers: [
      { label: "性价比款", range: "฿700–1,100" },
      { label: "高端款", range: "฿1,200–1,800" },
      { label: "一线品质款", range: "฿1,900–2,800" },
    ],
  },
  {
    id: "wrench",
    name: "21V无刷冲击扳手",
    image:
      "https://static.wixstatic.com/media/556c5c_cc84084f24b1484d9f463b9e3adae5c9~mv2.png",
    priceBasis: "单主机，不含电池及充电器",
    priceTiers: [
      { label: "性价比款", range: "฿1,000–1,500" },
      { label: "高端款", range: "฿1,600–2,300" },
      { label: "一线品质款", range: "฿2,400–3,400" },
    ],
  },
  {
    id: "grinder",
    name: "21V无刷角磨机",
    image:
      "https://static.wixstatic.com/media/556c5c_86355a98ca484d8d90652905e7ce162c~mv2.png",
    priceBasis: "单主机，不含电池及充电器",
    priceTiers: [
      { label: "性价比款", range: "฿900–1,300" },
      { label: "高端款", range: "฿1,400–2,100" },
      { label: "一线品质款", range: "฿2,200–3,200" },
    ],
  },
  {
    id: "chainsaw",
    name: "21V无绳链锯",
    image:
      "https://static.wixstatic.com/media/556c5c_db4cd5d83bf640bd884dadb29a22e139~mv2.png",
    priceBasis: "单主机，不含电池及充电器",
    priceTiers: [
      { label: "性价比款", range: "฿1,000–1,500" },
      { label: "高端款", range: "฿1,600–2,300" },
      { label: "一线品质款", range: "฿2,400–3,500" },
    ],
  },
  {
    id: "circular-saw",
    name: "21V无刷电圆锯",
    image:
      "https://static.wixstatic.com/media/556c5c_a3cac8c521894507a0fa8bcad194f348~mv2.png",
    priceBasis: "单主机，不含电池及充电器",
    priceTiers: [
      { label: "性价比款", range: "฿1,000–1,500" },
      { label: "高端款", range: "฿1,600–2,300" },
      { label: "一线品质款", range: "฿2,400–3,300" },
    ],
  },
  {
    id: "battery",
    name: "21V电池和充电器",
    image:
      "https://static.wixstatic.com/media/556c5c_401ac7c52b1a4168a8f61712a9533431~mv2.png",
    priceBasis: "1套电池和充电器",
    priceTiers: [
      { label: "性价比款", range: "฿700–1,000" },
      { label: "高端款", range: "฿1,100–1,500" },
      { label: "一线品质款", range: "฿1,600–2,200" },
    ],
  },
] as const;

const PROVINCES = [
  "曼谷",
  "甲米府",
  "北碧府",
  "加拉信府",
  "甘烹碧府",
  "孔敬府",
  "尖竹汶府",
  "北柳府",
  "春武里府",
  "猜纳府",
  "猜也奔府",
  "春蓬府",
  "清莱府",
  "清迈府",
  "董里府",
  "达叻府",
  "达府",
  "那空那育府",
  "佛统府",
  "那空拍侬府",
  "呵叻府",
  "洛坤府",
  "那空沙旺府",
  "暖武里府",
  "陶公府",
  "难府",
  "汶干府",
  "武里南府",
  "巴吞他尼府",
  "巴蜀府",
  "巴真府",
  "北大年府",
  "大城府",
  "帕尧府",
  "攀牙府",
  "博他仑府",
  "披集府",
  "彭世洛府",
  "佛丕府",
  "碧差汶府",
  "帕府",
  "普吉府",
  "玛哈沙拉堪府",
  "莫达汉府",
  "夜丰颂府",
  "益梭通府",
  "也拉府",
  "黎逸府",
  "拉廊府",
  "罗勇府",
  "叻丕府",
  "华富里府",
  "南邦府",
  "南奔府",
  "黎府",
  "四色菊府",
  "沙功那空府",
  "宋卡府",
  "沙敦府",
  "北榄府",
  "夜功府",
  "龙仔厝府",
  "沙缴府",
  "北标府",
  "信武里府",
  "素可泰府",
  "素攀武里府",
  "素叻他尼府",
  "素林府",
  "廊开府",
  "廊磨喃蒲府",
  "红统府",
  "安纳乍能府",
  "乌隆府",
  "程逸府",
  "乌泰他尼府",
  "乌汶府",
] as const;

const BUSINESS_TYPES = [
  "五金或电动工具零售门店",
  "五金或电动工具批发商",
  "建材或工业用品供应商",
  "汽车维修或农业工具经销商",
  "电动工具维修及销售门店",
  "Facebook、TikTok、Shopee或Lazada卖家",
  "其他相关企业",
  "我不是经销商或相关企业",
] as const;

const SALES_CHANNELS = [
  "实体门店",
  "区域批发或经销网络",
  "销售团队直接销售",
  "电商及社交平台（Facebook、TikTok、Shopee、Lazada或自有网站）",
  "建筑、工程、工厂或工业客户",
  "汽车维修或农业客户",
  "其他",
] as const;

const PRODUCT_CATEGORIES = [
  "冲击钻",
  "冲击扳手",
  "角磨机",
  "电锤",
  "电圆锯",
  "往复锯",
  "无绳链锯",
  "鼓风机",
  "高压清洗机",
  "砂光机",
  "修边机",
  "电动螺丝刀",
  "电池和充电器",
  "园林工具",
  "目前还没有销售电动工具",
  "其他",
] as const;

const POWER_TOOL_BRANDS = [
  "Makita",
  "DeWalt",
  "Bosch",
  "PUMPKIN",
  "OSUKA",
  "POLO",
  "自有品牌或OEM贴牌",
  "其他品牌（请填写）",
] as const;

const PROBLEMS = [
  "功率/扭矩不足或参数虚标",
  "电池容量、续航或散热表现不佳",
  "产品质量不稳定或批次差异较大",
  "售后配件供应或保修处理困难",
  "产品同质化、低价竞争导致利润不足",
  "包装或泰文说明不适合泰国市场",
  "目前没有明显问题",
  "其他",
] as const;

const MONTHLY_SALES_RANGES = [
  "1–10件",
  "11–30件",
  "31–50件",
  "51–100件",
  "101–300件",
  "300件以上",
  "暂时没有销售电动工具",
] as const;

const FIRST_ORDER_RANGES = [
  "暂时只测试，不确定采购",
  "1–10件",
  "11–30件",
  "31–50件",
  "51–100件",
  "100件以上",
  "希望先进一步沟通",
] as const;

const FEEDBACK_OPTIONS = [
  "愿意提供产品测试反馈",
  "愿意提供照片或简短测试视频",
  "愿意邀请店员或顾客参与测试",
  "可以提供反馈，但不方便提供照片或视频",
  "不愿意提供测试反馈",
] as const;

const THAI_LABELS: Record<string, string> = {
  "21V无刷冲击钻": "สว่านกระแทกไร้แปรงถ่าน 21V",
  "21V无刷冲击扳手": "บล็อกกระแทกไร้แปรงถ่าน 21V",
  "21V无刷角磨机": "เครื่องเจียรไร้แปรงถ่าน 21V",
  "21V无绳链锯": "เลื่อยโซ่ไร้สาย 21V",
  "21V无刷电圆锯": "เลื่อยวงเดือนไร้แปรงถ่าน 21V",
  "21V电池和充电器": "แบตเตอรี่ 21V และเครื่องชาร์จ",
  "单主机，不含电池及充电器": "ตัวเครื่องเปล่า ไม่รวมแบตเตอรี่และเครื่องชาร์จ",
  "1套电池和充电器": "แบตเตอรี่ 1 ก้อน พร้อมเครื่องชาร์จ 1 เครื่อง",
  "性价比款": "รุ่นคุ้มค่า",
  "高端款": "รุ่นพรีเมียม",
  "一线品质款": "คุณภาพระดับแบรนด์ชั้นนำ",

  曼谷: "กรุงเทพมหานคร",
  甲米府: "กระบี่",
  北碧府: "กาญจนบุรี",
  加拉信府: "กาฬสินธุ์",
  甘烹碧府: "กำแพงเพชร",
  孔敬府: "ขอนแก่น",
  尖竹汶府: "จันทบุรี",
  北柳府: "ฉะเชิงเทรา",
  春武里府: "ชลบุรี",
  猜纳府: "ชัยนาท",
  猜也奔府: "ชัยภูมิ",
  春蓬府: "ชุมพร",
  清莱府: "เชียงราย",
  清迈府: "เชียงใหม่",
  董里府: "ตรัง",
  达叻府: "ตราด",
  达府: "ตาก",
  那空那育府: "นครนายก",
  佛统府: "นครปฐม",
  那空拍侬府: "นครพนม",
  呵叻府: "นครราชสีมา",
  洛坤府: "นครศรีธรรมราช",
  那空沙旺府: "นครสวรรค์",
  暖武里府: "นนทบุรี",
  陶公府: "นราธิวาส",
  难府: "น่าน",
  汶干府: "บึงกาฬ",
  武里南府: "บุรีรัมย์",
  巴吞他尼府: "ปทุมธานี",
  巴蜀府: "ประจวบคีรีขันธ์",
  巴真府: "ปราจีนบุรี",
  北大年府: "ปัตตานี",
  大城府: "พระนครศรีอยุธยา",
  帕尧府: "พะเยา",
  攀牙府: "พังงา",
  博他仑府: "พัทลุง",
  披集府: "พิจิตร",
  彭世洛府: "พิษณุโลก",
  佛丕府: "เพชรบุรี",
  碧差汶府: "เพชรบูรณ์",
  帕府: "แพร่",
  普吉府: "ภูเก็ต",
  玛哈沙拉堪府: "มหาสารคาม",
  莫达汉府: "มุกดาหาร",
  夜丰颂府: "แม่ฮ่องสอน",
  益梭通府: "ยโสธร",
  也拉府: "ยะลา",
  黎逸府: "ร้อยเอ็ด",
  拉廊府: "ระนอง",
  罗勇府: "ระยอง",
  叻丕府: "ราชบุรี",
  华富里府: "ลพบุรี",
  南邦府: "ลำปาง",
  南奔府: "ลำพูน",
  黎府: "เลย",
  四色菊府: "ศรีสะเกษ",
  沙功那空府: "สกลนคร",
  宋卡府: "สงขลา",
  沙敦府: "สตูล",
  北榄府: "สมุทรปราการ",
  夜功府: "สมุทรสงคราม",
  龙仔厝府: "สมุทรสาคร",
  沙缴府: "สระแก้ว",
  北标府: "สระบุรี",
  信武里府: "สิงห์บุรี",
  素可泰府: "สุโขทัย",
  素攀武里府: "สุพรรณบุรี",
  素叻他尼府: "สุราษฎร์ธานี",
  素林府: "สุรินทร์",
  廊开府: "หนองคาย",
  廊磨喃蒲府: "หนองบัวลำภู",
  红统府: "อ่างทอง",
  安纳乍能府: "อำนาจเจริญ",
  乌隆府: "อุดรธานี",
  程逸府: "อุตรดิตถ์",
  乌泰他尼府: "อุทัยธานี",
  乌汶府: "อุบลราชธานี",

  "五金或电动工具零售门店": "ร้านค้าปลีกฮาร์ดแวร์หรือเครื่องมือไฟฟ้า",
  "五金或电动工具批发商": "ผู้ค้าส่งฮาร์ดแวร์หรือเครื่องมือไฟฟ้า",
  "建材或工业用品供应商": "ผู้จำหน่ายวัสดุก่อสร้างหรืออุปกรณ์อุตสาหกรรม",
  "汽车维修或农业工具经销商": "ตัวแทนจำหน่ายเครื่องมือสำหรับงานซ่อมรถยนต์หรือการเกษตร",
  "电动工具维修及销售门店": "ร้านซ่อมและจำหน่ายเครื่องมือไฟฟ้า",
  "Facebook、TikTok、Shopee或Lazada卖家": "ผู้ขายผ่าน Facebook, TikTok, Shopee หรือ Lazada",
  "其他相关企业": "ธุรกิจอื่นที่เกี่ยวข้อง",
  "我不是经销商或相关企业": "ฉันไม่ใช่ผู้จำหน่ายหรือธุรกิจที่เกี่ยวข้อง",

  实体门店: "หน้าร้าน",
  "区域批发或经销网络": "เครือข่ายขายส่งหรือตัวแทนจำหน่ายในพื้นที่",
  "销售团队直接销售": "ทีมขายโดยตรง",
  "电商及社交平台（Facebook、TikTok、Shopee、Lazada或自有网站）":
    "อีคอมเมิร์ซและโซเชียลมีเดีย (Facebook, TikTok, Shopee, Lazada หรือเว็บไซต์ของตนเอง)",
  "建筑、工程、工厂或工业客户": "ลูกค้ากลุ่มก่อสร้าง วิศวกรรม โรงงาน หรืออุตสาหกรรม",
  "汽车维修或农业客户": "ลูกค้ากลุ่มซ่อมรถยนต์หรือการเกษตร",
  其他: "อื่นๆ",

  冲击钻: "สว่านกระแทก",
  冲击扳手: "บล็อกกระแทกไร้สาย",
  角磨机: "เครื่องเจียรไฟฟ้า",
  电锤: "สว่านโรตารี่",
  电圆锯: "เลื่อยวงเดือนไฟฟ้า",
  往复锯: "เลื่อยชักไฟฟ้า",
  无绳链锯: "เลื่อยโซ่ไร้สาย",
  鼓风机: "เครื่องเป่าลม",
  高压清洗机: "เครื่องฉีดน้ำแรงดันสูง",
  砂光机: "เครื่องขัดกระดาษทราย",
  修边机: "เครื่องทริมเมอร์",
  电动螺丝刀: "ไขควงไฟฟ้า",
  电池和充电器: "แบตเตอรี่และเครื่องชาร์จ",
  园林工具: "เครื่องมือสวน",
  目前还没有销售电动工具: "ยังไม่ได้จำหน่ายเครื่องมือไฟฟ้า",

  "自有品牌或OEM贴牌": "แบรนด์ของตนเองหรือรับผลิต OEM",
  "其他品牌（请填写）": "แบรนด์อื่น (โปรดระบุ)",

  "功率/扭矩不足或参数虚标": "กำลังหรือแรงบิดไม่เพียงพอ หรือระบุสเปกเกินจริง",
  "电池容量、续航或散热表现不佳": "ความจุแบตเตอรี่ ระยะเวลาการใช้งาน หรือการระบายความร้อนไม่ดี",
  "产品质量不稳定或批次差异较大": "คุณภาพสินค้าไม่สม่ำเสมอหรือแต่ละล็อตแตกต่างกันมาก",
  "售后配件供应或保修处理困难": "อะไหล่หลังการขายไม่เพียงพอหรือการเคลมประกันยุ่งยาก",
  "产品同质化、低价竞争导致利润不足": "สินค้าคล้ายกันมากและการแข่งขันด้านราคาทำให้กำไรต่ำ",
  "包装或泰文说明不适合泰国市场": "บรรจุภัณฑ์หรือคู่มือภาษาไทยไม่เหมาะกับตลาดไทย",
  "目前没有明显问题": "ยังไม่พบปัญหาที่ชัดเจน",

  "1–10件": "1–10 ชิ้น",
  "11–30件": "11–30 ชิ้น",
  "31–50件": "31–50 ชิ้น",
  "51–100件": "51–100 ชิ้น",
  "101–300件": "101–300 ชิ้น",
  "300件以上": "มากกว่า 300 ชิ้น",
  "暂时没有销售电动工具": "ยังไม่ได้จำหน่ายเครื่องมือไฟฟ้าในขณะนี้",
  "暂时只测试，不确定采购": "ขอทดลองสินค้าก่อน ยังไม่แน่ใจเรื่องการสั่งซื้อ",
  "100件以上": "มากกว่า 100 ชิ้น",
  "希望先进一步沟通": "ต้องการพูดคุยรายละเอียดเพิ่มเติมก่อน",

  "愿意提供产品测试反馈": "ยินดีให้ความคิดเห็นหลังทดลองสินค้า",
  "愿意提供照片或简短测试视频": "ยินดีส่งภาพถ่ายหรือวิดีโอทดสอบสั้นๆ",
  "愿意邀请店员或顾客参与测试": "ยินดีเชิญพนักงานหรือลูกค้าร่วมทดลองสินค้า",
  "可以提供反馈，但不方便提供照片或视频": "ให้ความคิดเห็นได้ แต่ไม่สะดวกส่งภาพถ่ายหรือวิดีโอ",
  "不愿意提供测试反馈": "ไม่สะดวกให้ความคิดเห็นหลังทดลองสินค้า",
};

const thaiLabel = (value: string) => THAI_LABELS[value] ?? value;

const joinAnswers = (values: string[]) => values.join(" | ");

const getCampaignTracking = () => {
  if (typeof window === "undefined") {
    return {
      sourceUrl: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmContent: "",
      fbclid: "",
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  return {
    sourceUrl: window.location.href,
    utmSource: searchParams.get("utm_source") ?? "",
    utmMedium: searchParams.get("utm_medium") ?? "",
    utmCampaign: searchParams.get("utm_campaign") ?? "",
    utmContent: searchParams.get("utm_content") ?? "",
    fbclid: searchParams.get("fbclid") ?? "",
  };
};

type FormData = {
  businessType: string[];
  province: string;
  district: string;
  salesChannels: string[];
  otherSalesChannel: string;
  currentProducts: string[];
  otherCurrentProduct: string;
  currentBrands: string[];
  otherBrand: string;
  problems: string[];
  otherProblem: string;
  monthlySalesRange: string;
  desiredSample: string;
  otherDesiredSample: string;
  desiredSamplePriceTier: string;
  otherBusinessType: string;
  firstOrderQuantity: string;
  feedbackWillingness: string;
  companyName: string;
  contactName: string;
  phone: string;
  lineId: string;
  onlineLink: string;
  additionalNeeds: string;
  consentAccuracy: boolean;
  consentEligibility: boolean;
  consentContact: boolean;
};

type MultiSelectField =
  | "businessType"
  | "salesChannels"
  | "currentProducts"
  | "currentBrands"
  | "problems";

type SubmissionHandler = (data: FormData) => Promise<void> | void;

type PageProps = {
  onSubmitApplication?: SubmissionHandler;
  surveyBackgroundUrl?: string;
};

const INITIAL_FORM_DATA: FormData = {
  businessType: [],
  province: "",
  district: "",
  salesChannels: [],
  otherSalesChannel: "",
  currentProducts: [],
  otherCurrentProduct: "",
  currentBrands: [],
  otherBrand: "",
  problems: [],
  otherProblem: "",
  monthlySalesRange: "",
  desiredSample: "",
  otherDesiredSample: "",
  desiredSamplePriceTier: "",
  otherBusinessType: "",
  firstOrderQuantity: "",
  feedbackWillingness: "",
  companyName: "",
  contactName: "",
  phone: "",
  lineId: "",
  onlineLink: "",
  additionalNeeds: "",
  consentAccuracy: false,
  consentEligibility: false,
  consentContact: false,
};

const ERROR_TO_MOBILE_QUESTION: Record<string, string> = {
  currentProducts: "q1",
  otherCurrentProduct: "q1",
  desiredSample: "q2",
  otherDesiredSample: "q2",
  desiredSamplePriceTier: "q2",
  otherBrand: "q3",
  problems: "q4",
  otherProblem: "q4",
  monthlySalesRange: "q5",
  businessType: "q6",
  otherBusinessType: "q6",
  province: "q7",
  salesChannels: "q8",
  otherSalesChannel: "q8",
  firstOrderQuantity: "q9",
  feedbackWillingness: "q10",
  companyName: "contact",
  contactName: "contact",
  phone: "contact",
  lineId: "contact",
  consentAccuracy: "contact",
  consentEligibility: "contact",
};

export default function LocanexLandingPage({
  onSubmitApplication,
  surveyBackgroundUrl = "",
}: PageProps) {
  const surveyRef = useRef<HTMLElement | null>(null);

  const scrollToSurvey = () => {
    surveyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resolvedSurveyBackgroundUrl = surveyBackgroundUrl || SURVEY_BACKGROUND_URL;
  const surveyBackground = resolvedSurveyBackgroundUrl
    ? `linear-gradient(rgba(5,5,5,.78), rgba(5,5,5,.88)), url("${resolvedSurveyBackgroundUrl}")`
    : "radial-gradient(circle at 50% 20%, rgba(255,152,0,.07), transparent 34%), linear-gradient(180deg, #111 0%, #070707 100%)";

  return (
    <div lang="th" className="min-h-screen overflow-x-hidden bg-[#080808] text-white selection:bg-orange-500/30">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-10 lg:px-16">
          <div className="text-2xl font-black tracking-wide text-[#FF9800]">Locanex</div>
          <div className="flex items-center gap-3">
            <a
              href="https://line.me/ti/p/~0937281730"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-[#FF9800] sm:flex"
            >
              <MessageCircle className="h-4 w-4 text-[#00B900]" />
              ปรึกษาผ่าน LINE
            </a>
            <button
              type="button"
              onClick={scrollToSurvey}
              className="rounded-md bg-[#FF9800] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#F57C00] md:px-6"
            >
              สมัครรับสินค้าทดลอง
            </button>
          </div>
        </div>
      </header>

      <main>
        <section
          className="relative flex min-h-[720px] items-center overflow-hidden pt-20"
          style={{
            backgroundImage: `url("${HERO_BACKGROUND_URL}")`,
            backgroundPosition: "70% center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,5,5,.97) 0%, rgba(5,5,5,.90) 32%, rgba(5,5,5,.58) 54%, rgba(5,5,5,.12) 76%, rgba(5,5,5,0) 100%)",
            }}
          />
          <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-20 md:px-12 lg:px-20">
            <div className="max-w-[610px]">
              <div className="mb-7 inline-flex rounded border border-white/25 bg-black/20 px-4 py-2 text-xs text-gray-300 md:text-sm">
                สำหรับร้านฮาร์ดแวร์ ตัวแทนจำหน่ายเครื่องมือไฟฟ้า ผู้ค้าส่ง และธุรกิจที่เกี่ยวข้องในประเทศไทยเท่านั้น
              </div>
              <h1 className="mb-6 text-5xl font-black leading-[1.08] md:text-6xl lg:text-7xl">
                เปิดรับตัวแทนจำหน่าย
                <br />
                ในตลาดเครื่องมือไฟฟ้าไทย
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-gray-300 md:text-xl">
                กรอกแบบสำรวจความต้องการสินค้าแบบสั้นๆ เมื่อผ่านการตรวจสอบคุณสมบัติผู้จำหน่ายแล้ว สามารถสมัครรับชุดเครื่องมือไฟฟ้าสำหรับทดลองได้ฟรี 1 ชุด
              </p>
              <div className="mb-10 flex flex-col gap-4 text-sm text-gray-300 md:flex-row md:gap-7 md:text-base">
                <BenefitItem text="เครื่องมือ + แบตเตอรี่ + เครื่องชาร์จ" />
                <BenefitItem text="Locanex รับผิดชอบค่าจัดส่ง" />
                <BenefitItem text="ไม่มีข้อผูกมัดในการสั่งซื้อ" />
              </div>
              <button
                type="button"
                onClick={scrollToSurvey}
                className="group flex w-full items-center justify-center gap-2 rounded-md bg-[#FF9800] px-8 py-4 text-base font-bold text-black transition hover:bg-[#F57C00] md:w-auto md:text-lg"
              >
                กรอกแบบสำรวจและสมัครรับสินค้าทดลองฟรี
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-4 flex items-center gap-2 text-xs text-gray-400 md:text-sm">
                <Check className="h-4 w-4 shrink-0 text-[#FF9800]" />
                ใช้เวลาประมาณ 3–5 นาที เราจะติดต่อกลับทาง LINE หรือโทรศัพท์ภายใน 3 วันหลังส่งแบบฟอร์ม
              </p>
            </div>
          </div>
        </section>

        <section
          ref={surveyRef}
          id="survey"
          className="scroll-mt-20 border-t border-white/10 bg-cover bg-center bg-no-repeat py-16 md:py-24"
          style={{ backgroundImage: surveyBackground }}
        >
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <SurveyIntro />
            <SurveyForm onSubmitApplication={onSubmitApplication} />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 md:flex-row">
          <div>
            <div className="text-2xl font-black text-[#FF9800]">Locanex</div>
            <p className="mt-1 text-sm text-gray-400">โครงการทดลองเครื่องมือไฟฟ้าสำหรับผู้จำหน่ายในประเทศไทย</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm">
            <a className="flex items-center gap-2 hover:text-[#FF9800]" href="https://line.me/ti/p/~0937281730">
              <MessageCircle className="h-5 w-5 text-[#00B900]" /> LINE: 0937281730
            </a>
            <a className="flex items-center gap-2 hover:text-[#FF9800]" href="tel:0937281730">
              <Phone className="h-5 w-5 text-[#FF9800]" /> โทร: 0937281730
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={scrollToSurvey}
          className="w-full rounded-md bg-[#FF9800] py-4 font-bold text-black"
        >
          สมัครรับสินค้าทดลองฟรี
        </button>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="h-5 w-5 shrink-0 text-[#FF9800]" />
      <span>{text}</span>
    </div>
  );
}

function SurveyIntro() {
  const items = [
    { icon: Zap, text: "ผู้สมัครที่ผ่านการพิจารณามีสิทธิ์รับสินค้าทดลอง" },
    { icon: Wrench, text: "เครื่องมือ + แบตเตอรี่ + เครื่องชาร์จ" },
    { icon: Truck, text: "Locanex รับผิดชอบค่าสินค้าทดลองและค่าจัดส่ง" },
    { icon: ShieldCheck, text: "ติดต่อกลับภายใน 3 วันหลังส่งแบบฟอร์ม" },
  ];

  return (
    <div className="mb-8 border-b border-white/10 pb-8 md:mb-10 md:pb-10">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#FF9800]">สมัครเป็นผู้จำหน่าย</p>
          <h2 className="text-3xl font-black md:text-5xl">กรอกข้อมูลเพื่อสมัครรับสิทธิ์สินค้าทดลองฟรี</h2>
          <p className="mt-4 leading-relaxed text-gray-300">
            โปรดกรอกข้อมูลตามการดำเนินธุรกิจจริง Locanex จะพิจารณาสิทธิ์รับสินค้าทดลองฟรีจากความน่าเชื่อถือของธุรกิจ ช่องทางการขาย ความต้องการสินค้า และความสามารถในการให้ผลตอบรับ
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
          <a className="flex items-center gap-2 hover:text-[#FF9800]" href="https://line.me/ti/p/~0937281730">
            <MessageCircle className="h-4 w-4 text-[#00B900]" /> LINE: 0937281730
          </a>
          <a className="flex items-center gap-2 hover:text-[#FF9800]" href="tel:0937281730">
            <Phone className="h-4 w-4 text-[#FF9800]" /> โทร: 0937281730
          </a>
        </div>
      </div>
      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex min-h-14 items-center gap-3 rounded-lg border border-white/10 bg-black/45 px-4 py-3">
            <Icon className="h-5 w-5 shrink-0 text-[#FF9800]" />
            <span className="text-sm font-medium text-gray-200">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SurveyForm({ onSubmitApplication }: { onSubmitApplication?: SubmissionHandler }) {
  const [step, setStep] = useState(1);
  const [openMobileQuestion, setOpenMobileQuestion] = useState("q1");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formTopRef = useRef<HTMLFormElement | null>(null);

  const selectedProduct = useMemo(
    () => PRODUCTS.find((product) => product.name === formData.desiredSample),
    [formData.desiredSample],
  );

  const isSampleRequested =
    Boolean(formData.desiredSample) && formData.desiredSample !== "暂时不申请样品，只参与调研";

  const updateField = <K extends keyof FormData,>(field: K, value: FormData[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: "" }));
    }
  };

  const selectDesiredSample = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      desiredSample: value,
      otherDesiredSample: value === "其他产品" ? previous.otherDesiredSample : "",
      desiredSamplePriceTier: "",
    }));
    setErrors((previous) => ({
      ...previous,
      desiredSample: "",
      otherDesiredSample: value === "其他产品" ? previous.otherDesiredSample : "",
      desiredSamplePriceTier: "",
    }));
  };

  const toggleMultiSelect = (field: MultiSelectField, value: string, max?: number) => {
    const current = formData[field];
    const isSelected = current.includes(value);

    if (isSelected) {
      if (field === "currentProducts" && value === "其他") updateField("otherCurrentProduct", "");
      if (field === "currentBrands" && value === "其他品牌（请填写）") updateField("otherBrand", "");
      if (field === "problems" && value === "其他") updateField("otherProblem", "");
      if (field === "businessType" && value === "其他相关企业") updateField("otherBusinessType", "");
      if (field === "salesChannels" && value === "其他") updateField("otherSalesChannel", "");
    }

    if (field === "businessType") {
      const nonDealer = "我不是经销商或相关企业";
      if (value === nonDealer) {
        updateField("otherBusinessType", "");
        updateField("businessType", isSelected ? [] : [nonDealer]);
        return;
      }
      const withoutNonDealer = current.filter((item) => item !== nonDealer);
      updateField(
        "businessType",
        isSelected ? withoutNonDealer.filter((item) => item !== value) : [...withoutNonDealer, value],
      );
      return;
    }

    const exclusiveValue =
      field === "currentProducts"
        ? "目前还没有销售电动工具"
        : field === "problems"
          ? "目前没有明显问题"
          : "";

    if (exclusiveValue) {
      if (value === exclusiveValue) {
        if (field === "currentProducts") updateField("otherCurrentProduct", "");
        if (field === "problems") updateField("otherProblem", "");
        updateField(field, isSelected ? [] : [exclusiveValue]);
        return;
      }
      const withoutExclusiveValue = current.filter((item) => item !== exclusiveValue);
      updateField(
        field,
        isSelected
          ? withoutExclusiveValue.filter((item) => item !== value)
          : [...withoutExclusiveValue, value],
      );
      return;
    }

    if (!isSelected && max && current.length >= max) {
      setErrors((previous) => ({ ...previous, [field]: `เลือกได้สูงสุด ${max} ข้อ` }));
      return;
    }

    updateField(field, isSelected ? current.filter((item) => item !== value) : [...current, value]);
  };

  const validateStep = (currentStep: number) => {
    const nextErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (formData.currentProducts.length === 0) nextErrors.currentProducts = "โปรดเลือกสินค้าที่จำหน่ายอยู่ในปัจจุบัน";
      if (formData.currentProducts.includes("其他") && !formData.otherCurrentProduct.trim()) {
        nextErrors.otherCurrentProduct = "โปรดระบุเครื่องมือไฟฟ้าอื่นที่จำหน่ายอยู่";
      }
      if (!formData.desiredSample) nextErrors.desiredSample = "โปรดเลือกสินค้าที่ต้องการทดลอง";
      if (formData.desiredSample === "其他产品" && !formData.otherDesiredSample.trim()) {
        nextErrors.otherDesiredSample = "โปรดระบุสินค้าอื่นที่ต้องการทดลอง";
      }
      if (selectedProduct && !formData.desiredSamplePriceTier) {
        nextErrors.desiredSamplePriceTier = "โปรดเลือกระดับสินค้าและราคาจัดซื้อที่ยอมรับได้";
      }
      if (formData.currentBrands.includes("其他品牌（请填写）") && !formData.otherBrand.trim()) {
        nextErrors.otherBrand = "โปรดระบุชื่อแบรนด์อื่น";
      }
      if (formData.problems.length === 0) nextErrors.problems = "โปรดเลือกปัญหาที่ควรปรับปรุง";
      if (formData.problems.includes("其他") && !formData.otherProblem.trim()) {
        nextErrors.otherProblem = "โปรดระบุปัญหาอื่นที่ควรปรับปรุง";
      }
      if (!formData.monthlySalesRange) nextErrors.monthlySalesRange = "โปรดเลือกช่วงยอดขายต่อเดือน";
    }

    if (currentStep === 2) {
      if (formData.businessType.length === 0) nextErrors.businessType = "โปรดเลือกประเภทธุรกิจ";
      if (formData.businessType.includes("我不是经销商或相关企业")) {
        nextErrors.businessType = "โครงการสินค้าทดลองฟรีนี้สำหรับผู้จำหน่ายและธุรกิจที่เกี่ยวข้องจริงเท่านั้น";
      }
      if (formData.businessType.includes("其他相关企业") && !formData.otherBusinessType.trim()) {
        nextErrors.otherBusinessType = "โปรดระบุประเภทธุรกิจอื่น";
      }
      if (!formData.province) nextErrors.province = "โปรดเลือกจังหวัด";
      if (formData.salesChannels.length === 0) nextErrors.salesChannels = "โปรดเลือกช่องทางการขายอย่างน้อย 1 ช่องทาง";
      if (formData.salesChannels.includes("其他") && !formData.otherSalesChannel.trim()) {
        nextErrors.otherSalesChannel = "โปรดระบุช่องทางการขายอื่น";
      }
    }

    if (currentStep === 3) {
      if (isSampleRequested) {
        if (!formData.firstOrderQuantity) nextErrors.firstOrderQuantity = "โปรดเลือกจำนวนที่อาจสั่งซื้อครั้งแรก";
        if (!formData.feedbackWillingness) nextErrors.feedbackWillingness = "โปรดเลือกรูปแบบการให้ผลตอบรับ";
        if (formData.feedbackWillingness === "不愿意提供测试反馈") {
          nextErrors.feedbackWillingness = "ผู้สมัครรับสินค้าทดลองฟรีต้องยินดีให้ผลตอบรับจากการทดลองจริง";
        }
      }
      if (!formData.companyName.trim()) nextErrors.companyName = "โปรดระบุชื่อบริษัทหรือร้านค้า";
      if (!formData.contactName.trim()) nextErrors.contactName = "โปรดระบุชื่อผู้ติดต่อ";
      if (!formData.phone.trim()) nextErrors.phone = "โปรดระบุหมายเลขโทรศัพท์";
      else if (!/^[0-9+\-\s]{8,20}$/.test(formData.phone.trim())) nextErrors.phone = "โปรดระบุหมายเลขโทรศัพท์ที่ถูกต้อง";
      if (!formData.lineId.trim()) nextErrors.lineId = "โปรดระบุ LINE ID";
      if (!formData.consentAccuracy) nextErrors.consentAccuracy = "โปรดยืนยันว่าข้อมูลเป็นจริงและถูกต้อง";
      if (!formData.consentEligibility) nextErrors.consentEligibility = "โปรดยืนยันว่าเข้าใจเงื่อนไขการพิจารณาสินค้าทดลองแล้ว";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstErrorQuestion = Object.keys(nextErrors)
        .map((field) => ERROR_TO_MOBILE_QUESTION[field])
        .find(Boolean);
      if (firstErrorQuestion) setOpenMobileQuestion(firstErrorQuestion);
      window.setTimeout(() => {
        document.querySelector<HTMLElement>("[data-field-error='true']")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 80);
      return false;
    }
    return true;
  };

  const changeStep = (nextStep: number) => {
    setErrors({});
    setOpenMobileQuestion(
      nextStep === 1 ? "q1" : nextStep === 2 ? "q6" : isSampleRequested ? "q9" : "contact",
    );
    setStep(nextStep);
    window.requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleNext = () => {
    if (validateStep(step)) changeStep(step + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep(3) || isSubmitting) return;

    setIsSubmitting(true);
    setErrors((previous) => ({ ...previous, submit: "" }));
    try {
      if (onSubmitApplication) {
        await onSubmitApplication(formData);
      } else {
        const tracking = getCampaignTracking();
        await items.insert(SUBMISSION_COLLECTION_ID, {
          title: formData.companyName.trim() || formData.contactName.trim(),
          companyName: formData.companyName.trim(),
          contactName: formData.contactName.trim(),
          phone: formData.phone.trim(),
          lineId: formData.lineId.trim(),
          province: thaiLabel(formData.province),
          district: formData.district.trim(),
          businessType: joinAnswers(formData.businessType.map(thaiLabel)),
          otherBusinessType: formData.otherBusinessType.trim(),
          salesChannels: joinAnswers(formData.salesChannels.map(thaiLabel)),
          otherSalesChannel: formData.otherSalesChannel.trim(),
          currentProducts: joinAnswers(formData.currentProducts.map(thaiLabel)),
          otherCurrentProduct: formData.otherCurrentProduct.trim(),
          currentBrands: joinAnswers(formData.currentBrands.map(thaiLabel)),
          otherBrand: formData.otherBrand.trim(),
          problems: joinAnswers(formData.problems.map(thaiLabel)),
          otherProblem: formData.otherProblem.trim(),
          monthlySalesRange: thaiLabel(formData.monthlySalesRange),
          desiredSample: thaiLabel(formData.desiredSample),
          otherDesiredSample: formData.otherDesiredSample.trim(),
          desiredSamplePriceTier: formData.desiredSamplePriceTier,
          firstOrderQuantity: thaiLabel(formData.firstOrderQuantity),
          feedbackWillingness: thaiLabel(formData.feedbackWillingness),
          onlineLink: formData.onlineLink.trim(),
          additionalNeeds: formData.additionalNeeds.trim(),
          consentAccuracy: formData.consentAccuracy,
          consentEligibility: formData.consentEligibility,
          consentContact: formData.consentContact,
          ...tracking,
          submissionStatus: "New",
          submittedAt: new Date(),
        });
      }

      try {
        analytics.trackEvent("Lead", {
          origin: "Dealer Survey",
          formId: "dealer-survey",
          label: "Thailand Power Tool Dealer Survey",
          category: "B2B Power Tools Dealer",
        });
      } catch (analyticsError) {
        console.error("Lead analytics event failed", analyticsError);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Dealer survey submission failed", error);
      setErrors({
        submit:
          "ส่งข้อมูลไม่สำเร็จ ข้อมูลที่กรอกไว้ยังคงอยู่ โปรดลองอีกครั้งภายหลังหรือติดต่อเราทาง LINE",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/80 px-6 py-16 text-center shadow-2xl backdrop-blur md:px-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#00B900]/15">
          <Check className="h-10 w-10 text-[#00B900]" />
        </div>
        <h3 className="text-3xl font-black">ส่งใบสมัครเรียบร้อยแล้ว</h3>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-300">
          Locanex ได้รับข้อมูลผู้จำหน่าย ความต้องการสินค้า และคำขอสินค้าทดลองของคุณแล้ว เราจะติดต่อกลับทาง LINE หรือโทรศัพท์ภายใน 3 วัน
        </p>
        <a
          href="https://line.me/ti/p/~0937281730"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#00B900] px-8 py-4 font-bold transition hover:bg-[#009F00]"
        >
          <MessageCircle className="h-5 w-5" />
          ติดต่อ Locanex ผ่าน LINE
        </a>
      </div>
    );
  }

  return (
    <form
      ref={formTopRef}
      onSubmit={handleSubmit}
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-black/80 p-5 shadow-2xl backdrop-blur-md md:p-9 lg:p-11"
      noValidate
    >
      <div className="mb-9">
        <div className="mb-3 flex items-center justify-between gap-4 text-sm">
          <span className="font-bold text-[#FF9800]">ขั้นตอนที่ {step} จาก 3</span>
          <span className="text-gray-400">
            {step === 1 ? "ความต้องการสินค้า" : step === 2 ? "ข้อมูลผู้จำหน่าย" : "แผนการสั่งซื้อและข้อมูลติดต่อ"}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#FF9800] transition-[width] duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <p className="mb-5 flex items-center gap-2 text-xs text-gray-400 md:hidden">
        <ChevronDown className="h-4 w-4 text-[#FF9800]" />
        แตะหัวข้อเพื่อเปิดกรอก โดยจะแสดงครั้งละหนึ่งข้อ
      </p>

      {step === 1 && (
        <div>
          <StepHeading number="01" title="ความต้องการสินค้า" />
          <MobileAccordionQuestion
            id="q1"
            title="ปัจจุบันคุณจำหน่ายเครื่องมือไฟฟ้าประเภทใด?"
            open={openMobileQuestion === "q1"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "q1" ? "" : "q1"))}
            answered={
              formData.currentProducts.length > 0 &&
              (!formData.currentProducts.includes("其他") || Boolean(formData.otherCurrentProduct.trim()))
            }
            error={Boolean(errors.currentProducts || errors.otherCurrentProduct)}
          >
          <FormGroup label="1. ปัจจุบันคุณจำหน่ายเครื่องมือไฟฟ้าประเภทใด?" error={errors.currentProducts} mobileAccordion>
            <ChoiceGrid>
              {PRODUCT_CATEGORIES.map((option) => (
                <CheckboxCard
                  key={option}
                  label={thaiLabel(option)}
                  checked={formData.currentProducts.includes(option)}
                  onChange={() => toggleMultiSelect("currentProducts", option)}
                />
              ))}
            </ChoiceGrid>
          </FormGroup>

          {formData.currentProducts.includes("其他") && (
            <TextInput
              label="โปรดระบุเครื่องมือไฟฟ้าอื่นที่คุณจำหน่าย"
              required
              value={formData.otherCurrentProduct}
              error={errors.otherCurrentProduct}
              onChange={(value) => updateField("otherCurrentProduct", value)}
            />
          )}
          </MobileAccordionQuestion>

          <MobileAccordionQuestion
            id="q2"
            title="คุณต้องการทดลองสินค้ารุ่นใดมากที่สุด?"
            open={openMobileQuestion === "q2"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "q2" ? "" : "q2"))}
            answered={
              Boolean(formData.desiredSample) &&
              (formData.desiredSample !== "其他产品" || Boolean(formData.otherDesiredSample.trim())) &&
              (!selectedProduct || Boolean(formData.desiredSamplePriceTier))
            }
            error={Boolean(errors.desiredSample || errors.otherDesiredSample || errors.desiredSamplePriceTier)}
          >
          <FormGroup label="2. คุณต้องการทดลองสินค้ารุ่นใดมากที่สุด?" error={errors.desiredSample} mobileAccordion>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product) => (
                <ProductRadioCard
                  key={product.id}
                  product={product}
                  checked={formData.desiredSample === product.name}
                  onChange={() => selectDesiredSample(product.name)}
                />
              ))}
              <RadioCard
                name="desired-sample"
                label="สินค้าอื่น"
                checked={formData.desiredSample === "其他产品"}
                onChange={() => selectDesiredSample("其他产品")}
              />
              <RadioCard
                name="desired-sample"
                label="ยังไม่ขอรับสินค้าทดลอง ขอร่วมตอบแบบสำรวจเท่านั้น"
                checked={formData.desiredSample === "暂时不申请样品，只参与调研"}
                onChange={() => selectDesiredSample("暂时不申请样品，只参与调研")}
              />
            </div>
          </FormGroup>

          {formData.desiredSample === "其他产品" && (
            <TextInput
              label="โปรดระบุสินค้าอื่นที่คุณต้องการทดลอง"
              required
              value={formData.otherDesiredSample}
              error={errors.otherDesiredSample}
              onChange={(value) => updateField("otherDesiredSample", value)}
            />
          )}

          {selectedProduct && (
            <div className="mb-8 rounded-xl border border-[#FF9800]/35 bg-orange-500/5 p-5 md:p-6">
              <FormGroup
                label={`${thaiLabel(selectedProduct.name)}: คุณยอมรับระดับสินค้าและราคาจัดซื้อแบบใด?`}
                error={errors.desiredSamplePriceTier}
              >
                <p className="mb-4 text-sm text-gray-400">
                  หน่วยราคา: บาท; รูปแบบราคา: {thaiLabel(selectedProduct.priceBasis)}
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {selectedProduct.priceTiers.map((tier) => {
                    const value = `${tier.label}｜${tier.range}｜${selectedProduct.priceBasis}`;
                    return (
                      <RadioCard
                        key={tier.label}
                        name="desired-sample-price-tier"
                        label={`${thaiLabel(tier.label)}: ${tier.range}`}
                        checked={formData.desiredSamplePriceTier === value}
                        onChange={() => updateField("desiredSamplePriceTier", value)}
                      />
                    );
                  })}
                </div>
              </FormGroup>
            </div>
          )}
          </MobileAccordionQuestion>

          <MobileAccordionQuestion
            id="q3"
            title="ปัจจุบันคุณจำหน่ายเครื่องมือไฟฟ้าแบรนด์ใดเป็นหลัก?"
            open={openMobileQuestion === "q3"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "q3" ? "" : "q3"))}
            answered={
              formData.currentBrands.length > 0 &&
              (!formData.currentBrands.includes("其他品牌（请填写）") || Boolean(formData.otherBrand.trim()))
            }
            optional
            error={Boolean(errors.otherBrand)}
          >
          <FormGroup label="3. ปัจจุบันคุณจำหน่ายเครื่องมือไฟฟ้าแบรนด์ใดเป็นหลัก? (เลือกได้หลายข้อ, ไม่บังคับ)" mobileAccordion>
            <ChoiceGrid>
              {POWER_TOOL_BRANDS.map((option) => (
                <CheckboxCard
                  key={option}
                  label={thaiLabel(option)}
                  checked={formData.currentBrands.includes(option)}
                  onChange={() => toggleMultiSelect("currentBrands", option)}
                />
              ))}
            </ChoiceGrid>
          </FormGroup>

          {formData.currentBrands.includes("其他品牌（请填写）") && (
            <TextInput
              label="โปรดระบุชื่อแบรนด์อื่น"
              required
              value={formData.otherBrand}
              error={errors.otherBrand}
              onChange={(value) => updateField("otherBrand", value)}
            />
          )}
          </MobileAccordionQuestion>

          <MobileAccordionQuestion
            id="q4"
            title="ปัญหาใดของสินค้าที่ควรปรับปรุงมากที่สุด?"
            open={openMobileQuestion === "q4"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "q4" ? "" : "q4"))}
            answered={
              formData.problems.length > 0 &&
              (!formData.problems.includes("其他") || Boolean(formData.otherProblem.trim()))
            }
            error={Boolean(errors.problems || errors.otherProblem)}
          >
          <FormGroup label="4. ปัญหาใดของสินค้าในตลาดปัจจุบันที่ควรได้รับการปรับปรุงมากที่สุด? (สูงสุด 3 ข้อ)" error={errors.problems} mobileAccordion>
            <ChoiceGrid>
              {PROBLEMS.map((option) => (
                <CheckboxCard
                  key={option}
                  label={thaiLabel(option)}
                  checked={formData.problems.includes(option)}
                  onChange={() => toggleMultiSelect("problems", option, 3)}
                />
              ))}
            </ChoiceGrid>
          </FormGroup>

          {formData.problems.includes("其他") && (
            <TextInput
              label="โปรดระบุปัญหาอื่นที่ควรปรับปรุง"
              required
              value={formData.otherProblem}
              error={errors.otherProblem}
              onChange={(value) => updateField("otherProblem", value)}
            />
          )}
          </MobileAccordionQuestion>

          <MobileAccordionQuestion
            id="q5"
            title="คุณจำหน่ายเครื่องมือไฟฟ้าประมาณกี่ชิ้นต่อเดือน?"
            open={openMobileQuestion === "q5"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "q5" ? "" : "q5"))}
            answered={Boolean(formData.monthlySalesRange)}
            error={Boolean(errors.monthlySalesRange)}
          >
          <FormGroup label="5. ร้านของคุณจำหน่ายเครื่องมือไฟฟ้าประมาณกี่ชิ้นต่อเดือน?" error={errors.monthlySalesRange} mobileAccordion>
            <ChoiceGrid>
              {MONTHLY_SALES_RANGES.map((option) => (
                <RadioCard
                  key={option}
                  name="monthly-sales"
                  label={thaiLabel(option)}
                  checked={formData.monthlySalesRange === option}
                  onChange={() => updateField("monthlySalesRange", option)}
                />
              ))}
            </ChoiceGrid>
          </FormGroup>
          </MobileAccordionQuestion>
        </div>
      )}

      {step === 2 && (
        <div>
          <StepHeading number="02" title="ข้อมูลผู้จำหน่าย" />
          <MobileAccordionQuestion
            id="q6"
            title="ปัจจุบันคุณดำเนินธุรกิจประเภทใด?"
            open={openMobileQuestion === "q6"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "q6" ? "" : "q6"))}
            answered={
              formData.businessType.length > 0 &&
              (!formData.businessType.includes("其他相关企业") || Boolean(formData.otherBusinessType.trim()))
            }
            error={Boolean(errors.businessType || errors.otherBusinessType)}
          >
          <FormGroup label="6. ปัจจุบันคุณดำเนินธุรกิจประเภทใด? (เลือกได้หลายข้อ)" error={errors.businessType} mobileAccordion>
            <ChoiceGrid>
              {BUSINESS_TYPES.map((option) => (
                <CheckboxCard
                  key={option}
                  label={thaiLabel(option)}
                  checked={formData.businessType.includes(option)}
                  onChange={() => toggleMultiSelect("businessType", option)}
                />
              ))}
            </ChoiceGrid>
          </FormGroup>

          {formData.businessType.includes("其他相关企业") && (
            <TextInput
              label="โปรดระบุประเภทธุรกิจอื่น"
              required
              value={formData.otherBusinessType}
              error={errors.otherBusinessType}
              onChange={(value) => updateField("otherBusinessType", value)}
            />
          )}
          </MobileAccordionQuestion>

          <MobileAccordionQuestion
            id="q7"
            title="จังหวัดและเขต/อำเภอที่ตั้งของคุณ"
            open={openMobileQuestion === "q7"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "q7" ? "" : "q7"))}
            answered={Boolean(formData.province)}
            error={Boolean(errors.province)}
          >
          <div className="grid gap-5 md:grid-cols-2">
            <SelectField
              label="7. จังหวัด"
              value={formData.province}
              onChange={(value) => updateField("province", value)}
              options={PROVINCES}
              error={errors.province}
              mobileAccordion
            />
            <TextInput
              label="เขต/อำเภอ (ไม่บังคับ)"
              value={formData.district}
              onChange={(value) => updateField("district", value)}
            />
          </div>
          </MobileAccordionQuestion>

          <MobileAccordionQuestion
            id="q8"
            title="คุณจำหน่ายสินค้าผ่านช่องทางใดเป็นหลัก?"
            open={openMobileQuestion === "q8"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "q8" ? "" : "q8"))}
            answered={
              formData.salesChannels.length > 0 &&
              (!formData.salesChannels.includes("其他") || Boolean(formData.otherSalesChannel.trim()))
            }
            error={Boolean(errors.salesChannels || errors.otherSalesChannel)}
          >
          <FormGroup label="8. คุณจำหน่ายสินค้าผ่านช่องทางใดเป็นหลัก?" error={errors.salesChannels} mobileAccordion>
            <ChoiceGrid>
              {SALES_CHANNELS.map((option) => (
                <CheckboxCard
                  key={option}
                  label={thaiLabel(option)}
                  checked={formData.salesChannels.includes(option)}
                  onChange={() => toggleMultiSelect("salesChannels", option)}
                />
              ))}
            </ChoiceGrid>
          </FormGroup>

          {formData.salesChannels.includes("其他") && (
            <TextInput
              label="โปรดระบุช่องทางการขายอื่น"
              required
              value={formData.otherSalesChannel}
              error={errors.otherSalesChannel}
              onChange={(value) => updateField("otherSalesChannel", value)}
            />
          )}
          </MobileAccordionQuestion>
        </div>
      )}

      {step === 3 && (
        <div>
          <StepHeading number="03" title="แผนการสั่งซื้อและข้อมูลติดต่อ" />

          {isSampleRequested && (
            <>
              <MobileAccordionQuestion
                id="q9"
                title="หากผลการทดลองเป็นไปตามคาด คุณอาจสั่งซื้อครั้งแรกกี่ชิ้น?"
                open={openMobileQuestion === "q9"}
                onToggle={() => setOpenMobileQuestion((current) => (current === "q9" ? "" : "q9"))}
                answered={Boolean(formData.firstOrderQuantity)}
                error={Boolean(errors.firstOrderQuantity)}
              >
              <FormGroup label="9. หากผลการทดลองเป็นไปตามคาด คุณอาจสั่งซื้อครั้งแรกกี่ชิ้น?" error={errors.firstOrderQuantity} mobileAccordion>
                <ChoiceGrid>
                  {FIRST_ORDER_RANGES.map((option) => (
                    <RadioCard
                      key={option}
                      name="first-order"
                      label={thaiLabel(option)}
                      checked={formData.firstOrderQuantity === option}
                      onChange={() => updateField("firstOrderQuantity", option)}
                    />
                  ))}
                </ChoiceGrid>
              </FormGroup>
              </MobileAccordionQuestion>

              <MobileAccordionQuestion
                id="q10"
                title="หลังได้รับสินค้าทดลอง คุณยินดีให้ผลตอบรับจากการใช้งานจริงหรือไม่?"
                open={openMobileQuestion === "q10"}
                onToggle={() => setOpenMobileQuestion((current) => (current === "q10" ? "" : "q10"))}
                answered={Boolean(formData.feedbackWillingness)}
                error={Boolean(errors.feedbackWillingness)}
              >
              <FormGroup label="10. หลังได้รับสินค้าทดลอง คุณยินดีให้ผลตอบรับจากการใช้งานจริงหรือไม่?" error={errors.feedbackWillingness} mobileAccordion>
                <div className="grid gap-3">
                  {FEEDBACK_OPTIONS.map((option) => (
                    <RadioCard
                      key={option}
                      name="feedback"
                      label={thaiLabel(option)}
                      checked={formData.feedbackWillingness === option}
                      onChange={() => updateField("feedbackWillingness", option)}
                    />
                  ))}
                </div>
              </FormGroup>
              </MobileAccordionQuestion>
            </>
          )}

          <MobileAccordionQuestion
            id="contact"
            title="ข้อมูลติดต่อและการยืนยันใบสมัคร"
            open={openMobileQuestion === "contact"}
            onToggle={() => setOpenMobileQuestion((current) => (current === "contact" ? "" : "contact"))}
            answered={
              Boolean(formData.companyName.trim()) &&
              Boolean(formData.contactName.trim()) &&
              Boolean(formData.phone.trim()) &&
              Boolean(formData.lineId.trim()) &&
              formData.consentAccuracy &&
              formData.consentEligibility
            }
            error={Boolean(
              errors.companyName ||
                errors.contactName ||
                errors.phone ||
                errors.lineId ||
                errors.consentAccuracy ||
                errors.consentEligibility,
            )}
          >
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput
              label="ชื่อบริษัทหรือร้านค้า"
              required
              value={formData.companyName}
              error={errors.companyName}
              onChange={(value) => updateField("companyName", value)}
            />
            <TextInput
              label="ชื่อผู้ติดต่อ"
              required
              value={formData.contactName}
              error={errors.contactName}
              onChange={(value) => updateField("contactName", value)}
            />
            <TextInput
              label="หมายเลขโทรศัพท์"
              required
              type="tel"
              value={formData.phone}
              error={errors.phone}
              onChange={(value) => updateField("phone", value)}
            />
            <TextInput
              label="LINE ID"
              required
              value={formData.lineId}
              error={errors.lineId}
              onChange={(value) => updateField("lineId", value)}
            />
            <TextInput
              label="ลิงก์เพจ Facebook เว็บไซต์ หรือร้านค้าออนไลน์ (ไม่บังคับ)"
              type="url"
              value={formData.onlineLink}
              onChange={(value) => updateField("onlineLink", value)}
            />
            <TextInput
              label="ความต้องการสินค้าเพิ่มเติมหรือรายละเอียดอื่น (ไม่บังคับ)"
              value={formData.additionalNeeds}
              onChange={(value) => updateField("additionalNeeds", value)}
            />
          </div>

          <div className="mt-8 space-y-3 rounded-xl border border-white/10 bg-white/5 p-5">
            <CheckboxCard
              label="ฉันยืนยันว่าเป็นผู้ประกอบการด้านฮาร์ดแวร์ เครื่องมือไฟฟ้า หรือสินค้าที่เกี่ยวข้อง และข้อมูลที่กรอกเป็นจริงและถูกต้อง"
              checked={formData.consentAccuracy}
              onChange={() => updateField("consentAccuracy", !formData.consentAccuracy)}
              error={errors.consentAccuracy}
            />
            <CheckboxCard
              label="ฉันเข้าใจว่าการส่งใบสมัครไม่ได้หมายความว่าจะได้รับสินค้าทดลองฟรีโดยอัตโนมัติ Locanex ต้องตรวจสอบข้อมูลธุรกิจ ความต้องการสินค้า และความสามารถในการให้ผลตอบรับ"
              checked={formData.consentEligibility}
              onChange={() => updateField("consentEligibility", !formData.consentEligibility)}
              error={errors.consentEligibility}
            />
            <CheckboxCard
              label="ฉันยินยอมให้ Locanex ติดต่อทาง LINE หรือโทรศัพท์เกี่ยวกับการทดลองสินค้าและความร่วมมือในอนาคต (ไม่บังคับ)"
              checked={formData.consentContact}
              onChange={() => updateField("consentContact", !formData.consentContact)}
            />
          </div>
          </MobileAccordionQuestion>
        </div>
      )}

      {errors.submit && <p className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{errors.submit}</p>}

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => changeStep(step - 1)}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3 font-medium text-gray-300 transition hover:border-white/40 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" /> ย้อนกลับ
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-[#FF9800] px-8 py-3 font-bold text-black transition hover:bg-[#F57C00] sm:min-w-48"
          >
            ถัดไป <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[52px] rounded-md bg-[#FF9800] px-8 py-3 font-bold text-black transition hover:bg-[#F57C00] disabled:cursor-wait disabled:opacity-60 sm:min-w-64"
          >
            {isSubmitting ? "กำลังส่งข้อมูล…" : "ส่งข้อมูลเพื่อสมัครรับสินค้าทดลองฟรี"}
          </button>
        )}
      </div>
    </form>
  );
}

function StepHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-5">
      <span className="text-3xl font-black text-[#FF9800]">{number}</span>
      <h3 className="text-2xl font-black md:text-3xl">{title}</h3>
    </div>
  );
}

function MobileAccordionQuestion({
  id,
  title,
  open,
  onToggle,
  answered,
  optional,
  error,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  answered?: boolean;
  optional?: boolean;
  error?: boolean;
  children: ReactNode;
}) {
  const contentId = `mobile-question-${id}`;
  return (
    <section
      data-mobile-question={id}
      className={`mb-3 overflow-hidden rounded-xl border bg-black/45 md:mb-0 md:contents ${
        error ? "border-red-500/60" : open ? "border-[#FF9800]/55" : "border-white/15"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={onToggle}
        className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left md:hidden"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
            error ? "bg-red-500/15 text-red-300" : "bg-[#FF9800]/15 text-[#FF9800]"
          }`}
        >
          {id === "contact" ? <Phone className="h-4 w-4" /> : id.replace("q", "")}
        </span>
        <span className="min-w-0 flex-1 font-bold leading-snug text-white">{title}</span>
        {error ? (
          <span className="shrink-0 text-xs font-bold text-red-300">โปรดกรอก</span>
        ) : answered ? (
          <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF9800]">
            <Check className="h-3.5 w-3.5" /> กรอกแล้ว
          </span>
        ) : optional ? (
          <span className="shrink-0 text-xs text-gray-500">ไม่บังคับ</span>
        ) : null}
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={contentId}
        className={`${open ? "block" : "hidden"} px-4 pb-4 pt-1 md:block md:p-0 [&>*:last-child]:mb-0`}
      >
        {children}
      </div>
    </section>
  );
}

function ChoiceGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>;
}

function FormGroup({
  label,
  children,
  error,
  mobileAccordion,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  mobileAccordion?: boolean;
}) {
  return (
    <fieldset
      className={mobileAccordion ? "mb-0 md:mb-8" : "mb-8"}
      data-field-error={error ? "true" : undefined}
    >
      <legend
        className={
          mobileAccordion
            ? "sr-only font-bold text-white md:not-sr-only md:mb-4 md:block"
            : "mb-4 block font-bold text-white"
        }
      >
        {label}
      </legend>
      {children}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </fieldset>
  );
}

function CheckboxCard({
  label,
  checked,
  onChange,
  error,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  error?: string;
}) {
  return (
    <div data-field-error={error ? "true" : undefined}>
      <label
        className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition ${
          checked
            ? "border-[#FF9800] bg-orange-500/10 text-white"
            : "border-white/15 bg-[#151515] text-gray-300 hover:border-[#FF9800]"
        }`}
      >
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
            checked ? "border-[#FF9800] bg-[#FF9800] text-black" : "border-gray-500"
          }`}
        >
          {checked && <Check className="h-3.5 w-3.5" />}
        </span>
        <span className="text-sm leading-relaxed md:text-base">{label}</span>
      </label>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function RadioCard({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition ${
        checked
          ? "border-[#FF9800] bg-orange-500/10 text-white"
          : "border-white/15 bg-[#151515] text-gray-300 hover:border-[#FF9800]"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          checked ? "border-[#FF9800]" : "border-gray-500"
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-[#FF9800]" />}
      </span>
      <span className="text-sm leading-relaxed md:text-base">{label}</span>
    </label>
  );
}

function ProductRadioCard({
  product,
  checked,
  onChange,
}: {
  product: (typeof PRODUCTS)[number];
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`relative cursor-pointer overflow-hidden rounded-lg border p-3 transition ${
        checked ? "border-[#FF9800] bg-orange-500/10" : "border-white/15 bg-[#151515] hover:border-[#FF9800]"
      }`}
    >
      <input type="radio" name="desired-sample" checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border ${
          checked ? "border-[#FF9800] bg-[#FF9800] text-black" : "border-white/40 bg-black/40"
        }`}
      >
        {checked && <Check className="h-4 w-4" />}
      </span>
      <Image src={product.image} alt={thaiLabel(product.name)} className="mx-auto h-32 w-full object-contain" loading="lazy" />
      <span className="mt-2 block text-center text-sm font-bold">{thaiLabel(product.name)}</span>
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  mobileAccordion,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string;
  mobileAccordion?: boolean;
}) {
  return (
    <div className="mb-8" data-field-error={error ? "true" : undefined}>
      <label
        className={
          mobileAccordion
            ? "sr-only font-bold md:not-sr-only md:mb-2 md:block"
            : "mb-2 block font-bold"
        }
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={`min-h-12 w-full rounded-md bg-[#151515] px-4 text-white outline-none transition focus:ring-2 focus:ring-[#FF9800] ${
          error ? "border border-red-500" : "border border-white/20"
        }`}
      >
        <option value="">โปรดเลือก</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {thaiLabel(option)}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  suffix,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "tel" | "url" | "number";
  placeholder?: string;
  suffix?: string;
  required?: boolean;
  error?: string;
}) {
  const id = `field-${label.replace(/\s+/g, "-")}`;
  return (
    <div className="mb-8" data-field-error={error ? "true" : undefined}>
      <label htmlFor={id} className="mb-2 block font-bold">
        {label} {required && <span className="text-[#FF9800]">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`min-h-12 w-full rounded-md bg-[#151515] px-4 text-white outline-none transition placeholder:text-gray-600 focus:ring-2 focus:ring-[#FF9800] ${
            suffix ? "pr-16" : ""
          } ${error ? "border border-red-500" : "border border-white/20"}`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{suffix}</span>}
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export type { FormData as LocanexDealerApplication };

import { Image } from '@/components/ui/image';
import { Coreproducts, Distributorapplications } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { ArrowRight, BatteryCharging, CheckCircle2, Factory, Menu, PackageCheck, ShieldCheck, ShoppingBag, Store, Wrench, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

// LOCANEX B2B homepage V2.0 – Thai is the default language.
// Integrates with existing Wix Vibe coreproducts and distributorapplications collections.
// Keep the old file as a backup. Confirm CMS fields and security settings in Wix before publishing.
const LINE_URL = 'https://line.me/ti/p/G_saKyMNTQ';
const HERO_DESKTOP = 'https://static.wixstatic.com/media/556c5c_03f932509c344150a4ec208291edf3d0~mv2.png';
const HERO_MOBILE = 'https://static.wixstatic.com/media/556c5c_af548caae38c4dc7bdeef8e9e74a4efc~mv2.png';
const BATTERY_IMAGE = 'https://static.wixstatic.com/media/556c5c_54b8f299430a4095bbc35c1e25c5f3ba~mv2.png';
const STORAGE_KEY = 'locanex-site-language';
type Lang = 'th' | 'zh';
type InquiryType = 'wholesale' | 'oem' | 'odm' | 'dealer';
type QuoteForm = { inquiryType: InquiryType; companyName: string; companyType: string; province: string; products: string[]; quantity: string; customization: string; contactName: string; phone: string; lineId: string; shopUrl: string; notes: string; privacyConsent: boolean };
const initial: QuoteForm = { inquiryType: 'wholesale', companyName: '', companyType: '', province: '', products: [], quantity: '', customization: '', contactName: '', phone: '', lineId: '', shopUrl: '', notes: '', privacyConsent: false };
const langs = {
 th: {
  navProducts:'สินค้า',navWhy:'จุดเด่น',navOem:'OEM / ODM',navPartners:'สำหรับธุรกิจ',navQuote:'ขอราคาส่ง',navContact:'ติดต่อเรา',
  eyebrow:'LOCANEX · PROFESSIONAL POWER TOOLS',headline:'เครื่องมือไฟฟ้าสำหรับมืออาชีพและธุรกิจของคุณ',intro:'จำหน่ายเครื่องมือไฟฟ้าสำหรับร้านค้า ผู้ค้าส่ง และธุรกิจ พร้อมบริการ OEM/ODM สำหรับผู้ที่ต้องการสร้างแบรนด์ของตนเอง',browse:'ดูสินค้าทั้งหมด',quote:'ขอใบเสนอราคาส่ง',
  point1:'ราคาส่งตามจำนวนสั่งซื้อ',point2:'รองรับการสั่งซื้อทดลองแบบชำระเงิน',point3:'บริการ OEM/ODM',
  productsTitle:'ผลิตภัณฑ์เครื่องมือไฟฟ้า LOCANEX',productsIntro:'เลือกชมเครื่องมือไฟฟ้าสำหรับงานช่าง งานก่อสร้าง และงานซ่อมบำรุง',detail:'สอบถามราคาส่ง',catalogNote:'รุ่นสินค้าและรายละเอียดจริงอ้างอิงจากข้อมูลผลิตภัณฑ์ โปรดติดต่อเพื่อยืนยันการจัดชุดและสต็อก',
  whyTitle:'ทำไมต้องเลือก LOCANEX?',whyIntro:'ผลิตภัณฑ์และแนวทางจัดซื้อสำหรับร้านค้า ผู้จัดจำหน่าย และธุรกิจ',
  b1:'แพลตฟอร์มแบตเตอรี่เดียวกัน',bd1:'เครื่องมือไร้สายรุ่นที่รองรับสามารถใช้แบตเตอรี่ร่วมกันได้',b2:'รับประกัน 1 ปี',bd2:'สินค้า LOCANEX รับประกัน 1 ปี ตามเงื่อนไขที่กำหนด',b3:'กลุ่มสินค้าหลากหลาย',bd3:'เลือกเครื่องมือและอุปกรณ์เสริมได้ตามความต้องการ',b4:'ราคาส่งตามจำนวน',bd4:'เสนอราคาตามรุ่นสินค้า ชุดอุปกรณ์ และจำนวนที่สั่งซื้อ',b5:'รองรับคำสั่งซื้อทดลอง',bd5:'เริ่มจากการสั่งซื้อจำนวนน้อยแบบชำระเงิน',b6:'บริการ OEM / ODM',bd6:'ปรึกษาด้านแบรนด์ บรรจุภัณฑ์ และการปรับแต่งสินค้า',
  oemTitle:'บริการ OEM / ODM เครื่องมือไฟฟ้า',oemIntro:'สำหรับธุรกิจที่ต้องการจำหน่ายเครื่องมือไฟฟ้าภายใต้แบรนด์ของตนเอง เราพร้อมพูดคุยเกี่ยวกับการติดแบรนด์ การปรับแต่ง และการพัฒนาสินค้าตามความเป็นไปได้ของโครงการ',
  oem1:'ติดแบรนด์และโลโก้',oem2:'บรรจุภัณฑ์และคู่มือ',oem3:'ชุดสินค้าและอุปกรณ์',oem4:'ปรึกษาการพัฒนาผลิตภัณฑ์',oemCta:'สอบถามบริการ OEM/ODM',
  partnerTitle:'ร่วมงานกับ LOCANEX ได้อย่างไร?',partnerIntro:'สำหรับร้านค้าปลีก ผู้ค้าส่ง ผู้ขายออนไลน์ และเจ้าของแบรนด์',partner1:'ร้านเครื่องมือและฮาร์ดแวร์',partner2:'ผู้ค้าส่งและผู้จัดจำหน่าย',partner3:'ผู้ขายสินค้าออนไลน์',partner4:'เจ้าของแบรนด์และธุรกิจ OEM/ODM',
  stepsTitle:'ขั้นตอนการสั่งซื้อ',step1:'เลือกสินค้าและแจ้งความต้องการ',step2:'ยืนยันรุ่นและจำนวน',step3:'รับใบเสนอราคา',step4:'ยืนยันคำสั่งซื้อ',
  formTitle:'สอบถามราคาส่งและบริการ OEM/ODM',formIntro:'แจ้งข้อมูลธุรกิจ สินค้าที่สนใจ และจำนวนที่ต้องการ ทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียดและจัดทำใบเสนอราคา',
  inquiryType:'ประเภทความต้องการ',wholesale:'ซื้อสินค้าในราคาส่ง',oem:'ผลิตสินค้าแบรนด์ตัวเอง (OEM)',odm:'พัฒนาสินค้า (ODM)',dealer:'ความร่วมมือเป็นผู้จัดจำหน่าย',
  company:'ชื่อบริษัท / ร้านค้า',companyType:'ประเภทธุรกิจ',province:'จังหวัด / พื้นที่',interested:'สินค้าที่สนใจ',quantity:'จำนวนที่คาดว่าจะสั่งซื้อ',custom:'รายละเอียดการปรับแต่ง / แบรนด์',contact:'ชื่อผู้ติดต่อ',phone:'เบอร์โทรศัพท์',line:'LINE ID (ไม่บังคับ)',shop:'เว็บไซต์ / Facebook (ไม่บังคับ)',notes:'รายละเอียดเพิ่มเติม (ไม่บังคับ)',consent:'ฉันได้อ่านนโยบายความเป็นส่วนตัวและยินยอมให้ใช้ข้อมูลเพื่อดำเนินการตามคำขอและติดต่อกลับ',submit:'ส่งคำขอใบเสนอราคา',submitting:'กำลังส่ง...',success:'ส่งข้อมูลเรียบร้อยแล้ว ทีมงาน LOCANEX จะติดต่อกลับเพื่อยืนยันรายละเอียด',error:'ไม่สามารถส่งข้อมูลได้ โปรดลองอีกครั้งหรือติดต่อทาง LINE',required:'กรุณากรอกข้อมูลที่จำเป็น',select:'โปรดเลือก',
  cRetail:'ร้านฮาร์ดแวร์ / เครื่องมือไฟฟ้า',cWhole:'ผู้ค้าส่ง / ผู้จัดจำหน่าย',cOnline:'ผู้ขายออนไลน์',cBrand:'เจ้าของแบรนด์',cOther:'ธุรกิจอื่น',qty1:'1–10 ชิ้น',qty2:'11–30 ชิ้น',qty3:'31–50 ชิ้น',qty4:'51–100 ชิ้น',qty5:'มากกว่า 100 ชิ้น',qty6:'ต้องการสอบถามราคาก่อน',
  footer:'เครื่องมือไฟฟ้าสำหรับธุรกิจ พร้อมบริการขายส่งและ OEM/ODM',warranty:'เงื่อนไขการรับประกันและความเข้ากันได้ของแบตเตอรี่ขึ้นอยู่กับรุ่นสินค้า',privacy:'นโยบายความเป็นส่วนตัว',
 },
 zh: {
  navProducts:'产品系列',navWhy:'产品优势',navOem:'OEM / ODM',navPartners:'合作客户',navQuote:'批发询价',navContact:'联系我们',
  eyebrow:'LOCANEX · 专业电动工具',headline:'为专业用户及企业提供电动工具',intro:'为五金店、批发商和企业提供电动工具，同时为自有品牌客户提供 OEM/ODM 定制合作。',browse:'查看全部产品',quote:'获取批发报价',
  point1:'按采购数量提供批发价',point2:'支持小批量付费试单',point3:'提供 OEM/ODM 服务',
  productsTitle:'LOCANEX 电动工具产品系列',productsIntro:'面向施工、安装、维修和企业采购的电动工具',detail:'询问批发价格',catalogNote:'产品型号和参数以实际产品资料为准；套装配置和库存需进一步确认。',
  whyTitle:'为什么选择 LOCANEX？',whyIntro:'为门店、经销商及企业采购提供合适的产品和合作方案',
  b1:'统一无线电池平台',bd1:'兼容型号的无线电动工具可以共用电池',b2:'全系列产品一年质保',bd2:'LOCANEX 产品享有一年质保，具体以保修条款为准',b3:'丰富产品系列',bd3:'按采购需求选择工具及配套产品',b4:'阶梯批发价格',bd4:'根据型号、套装和采购数量报价',b5:'小批量付费试单',bd5:'可以从少量付费采购开始测试市场',b6:'OEM / ODM 服务',bd6:'品牌、包装与产品定制需求咨询',
  oemTitle:'电动工具 OEM / ODM 服务',oemIntro:'面向希望经营自有品牌的客户，可沟通贴牌、包装、配置和产品开发需求，具体能力和起订量按项目确认。',oem1:'Logo 与品牌标识',oem2:'包装与说明书',oem3:'产品套装与配件',oem4:'产品开发方案咨询',oemCta:'咨询 OEM/ODM',
  partnerTitle:'适合哪些合作客户？',partnerIntro:'面向五金零售、批发分销、电商卖家及自有品牌客户',partner1:'五金与电动工具门店',partner2:'批发商和分销商',partner3:'线上电商卖家',partner4:'自有品牌和 OEM/ODM 客户',
  stepsTitle:'采购合作流程',step1:'选择产品并提交需求',step2:'确认型号与采购数量',step3:'获取正式报价',step4:'确认采购订单',
  formTitle:'批发报价与 OEM/ODM 咨询',formIntro:'填写经营信息、意向产品及采购量，业务团队将联系你进一步确认并报价。',
  inquiryType:'业务需求类型',wholesale:'现有产品批发采购',oem:'自有品牌 OEM 贴牌',odm:'ODM 产品开发',dealer:'LOCANEX 经销合作',
  company:'公司或店铺名称',companyType:'业务类型',province:'所在府或地区',interested:'感兴趣的产品',quantity:'预计首次采购量',custom:'品牌或定制需求',contact:'联系人',phone:'联系电话',line:'LINE ID（选填）',shop:'网站 / Facebook（选填）',notes:'其他需求（选填）',consent:'我已阅读隐私政策，并同意根据本次询价需求处理我的资料和与我联系',submit:'提交报价申请',submitting:'正在提交...',success:'提交成功，LOCANEX 团队将联系你确认产品及报价细节。',error:'提交失败，请稍后重试或通过 LINE 联系我们。',required:'请填写必填信息',select:'请选择',
  cRetail:'五金 / 电动工具零售门店',cWhole:'批发商 / 分销商',cOnline:'电商卖家',cBrand:'自有品牌企业',cOther:'其他企业',qty1:'1–10 件',qty2:'11–30 件',qty3:'31–50 件',qty4:'51–100 件',qty5:'100 件以上',qty6:'先了解报价',
  footer:'专业电动工具批发供应与 OEM/ODM 合作',warranty:'质保范围及电池兼容性请以具体型号与条款为准',privacy:'隐私政策',
 }
};
const categories = [
 { id:'drill', th:'สว่านกระแทกไร้แปรงถ่าน',zh:'无刷冲击钻', keywords:['钻','drill','สว่าน'] },
 { id:'wrench',th:'บล็อกกระแทกไร้แปรงถ่าน',zh:'无刷冲击扳手',keywords:['扳手','wrench','บล็อก'] },
 { id:'grinder',th:'เครื่องเจียรไร้สาย',zh:'无刷角磨机',keywords:['角磨','grinder','เจียร'] },
 { id:'chainsaw',th:'เลื่อยโซ่ไร้สาย',zh:'无绳链锯',keywords:['链锯','chainsaw','โซ่'] },
 { id:'circular',th:'เลื่อยวงเดือนไร้สาย',zh:'无刷电圆锯',keywords:['圆锯','circular','วงเดือน'] },
 { id:'battery',th:'แบตเตอรี่และเครื่องชาร์จ',zh:'电池和充电器',keywords:['电池','battery','แบตเตอรี่'] }
];
const thaiProvinces = ['กรุงเทพมหานคร','เชียงใหม่','เชียงราย','ชลบุรี','ระยอง','สมุทรปราการ','นนทบุรี','ปทุมธานี','นครราชสีมา','ขอนแก่น','อุดรธานี','อุบลราชธานี','ภูเก็ต','สงขลา','สุราษฎร์ธานี','นครปฐม','อื่นๆ'];
const cnProvinces = ['曼谷','清迈','清莱','春武里','罗勇','北榄','暖武里','巴吞他尼','呵叻','孔敬','乌隆','乌汶','普吉','宋卡','素叻他尼','佛统','其他'];
const card='border border-white/10 bg-[#1b1d20] hover:border-[#ff9800]/60 transition-colors';
const field='w-full rounded-md border border-white/20 bg-[#15171a] px-3 py-3 text-white outline-none focus:border-[#ff9800]';
function getProductImage(record: Coreproducts): string | undefined {
 const p = record as unknown as Record<string, unknown>;
 // Wix Vibe Coreproducts image fields vary by generated schema.
 for (const name of ['productImage','image','imageUrl','imageURL','photo','mainImage','thumbnail']) {
  const v=p[name]; if (typeof v==='string' && v.startsWith('http')) return v;
  if (v && typeof v==='object' && typeof (v as any).url==='string') return (v as any).url;
 }
 return undefined;
}
function getProductName(record: Coreproducts): string {
 const p=record as unknown as Record<string,unknown>;
 for (const key of ['name','productName','title','model']) if (typeof p[key]==='string' && p[key]) return String(p[key]);
 return '';
}
export default function HomePage() {
 const [lang,setLang]=useState<Lang>('th');
 const t=langs[lang];
 const [menuOpen,setMenuOpen]=useState(false);
 const [records,setRecords]=useState<Coreproducts[]>([]);
 const [form,setForm]=useState<QuoteForm>(initial);
 const [sending,setSending]=useState(false);
 const [message,setMessage]=useState<'success'|'error'|''>('');
 useEffect(()=>{
  try { const saved=window.localStorage.getItem(STORAGE_KEY); if (saved==='zh'||saved==='th') setLang(saved); } catch {}
  BaseCrudService.getAll<Coreproducts>('coreproducts').then(r=>setRecords(r.items)).catch(e=>console.error('Product collection fetch failed',e));
 },[]);
 useEffect(()=>{document.documentElement.lang=lang;document.title=lang==='th'?'LOCANEX | เครื่องมือไฟฟ้าขายส่งและ OEM/ODM':'LOCANEX | 电动工具批发与 OEM/ODM';try{window.localStorage.setItem(STORAGE_KEY,lang)}catch{}},[lang]);
 const productMatches=useMemo(()=>categories.map(cat=>({ ...cat, record:records.find(r=> { const n=getProductName(r).toLowerCase();return cat.keywords.some(k=>n.includes(k.toLowerCase())); }) })),[records]);
 const change=<K extends keyof QuoteForm>(key:K,value:QuoteForm[K])=>setForm(p=>({...p,[key]:value}));
 const scrollTo=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});setMenuOpen(false)};
 const quoteFor=(product?:string,kind?:InquiryType)=>{setForm(p=>({...p,products:product?[product]:p.products,inquiryType:kind||p.inquiryType}));scrollTo('inquiry')};
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();setMessage('');
  if (!form.companyName.trim()||!form.companyType||!form.province||form.products.length===0||!form.quantity||!form.contactName.trim()||!/^\+?[\d\s-]{8,20}$/.test(form.phone.trim())||!form.privacyConsent){setMessage('error');return}
  setSending(true);
  const tracking=typeof window!=='undefined'?new URLSearchParams(window.location.search):new URLSearchParams();
  const purchaseProfile=[`Business request: ${form.inquiryType}`,`Desired products: ${form.products.join(' | ')}`,`Estimated first order: ${form.quantity}`,`Province: ${form.province}`,`LINE: ${form.lineId}`,`Store link: ${form.shopUrl}`,`Custom requirements: ${form.customization}`,`Notes: ${form.notes}`,`Page: ${typeof window!=='undefined'?window.location.href:''}`,`UTM: ${['utm_source','utm_medium','utm_campaign','utm_content','fbclid'].map(k=>`${k}=${tracking.get(k)||''}`).join('; ')}`].join('\n');
  // Compatibility-first: retain all fields used by the previous homepage form.
  // New fields are preserved within purchaseProfile until schema keys are confirmed.
  const payload={
   _id:crypto.randomUUID(),companyName:form.companyName.trim(),contactPersonName:form.contactName.trim(),contactPhone:form.phone.trim(),email:'',
   companyType:form.companyType,applicantRole:'Business inquiry',purchaseToolTypes:form.products.join('、'),
   purchasePreference:form.inquiryType,cordlessVoltagePlatforms:'',cordedPowerRange:'',purchaseProfile,privacyConsent:form.privacyConsent
  } as unknown as Distributorapplications;
  try {await BaseCrudService.create<Distributorapplications>('distributorapplications',payload);setMessage('success');setForm(initial)}
  catch(err){console.error('Wholesale inquiry failed',err);setMessage('error')}
  finally{setSending(false)}
 };
 const advantages=[
  [BatteryCharging,t.b1,t.bd1],[ShieldCheck,t.b2,t.bd2],[Wrench,t.b3,t.bd3],[PackageCheck,t.b4,t.bd4],[ShoppingBag,t.b5,t.bd5],[Factory,t.b6,t.bd6]
 ] as const;
 return <div className="min-h-screen bg-[#0b0c0e] text-white font-sans selection:bg-[#ff9800] selection:text-black">
  <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0c0e]/95 backdrop-blur">
   <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
    <a href="#home" onClick={e=>{e.preventDefault();scrollTo('home')}} className="text-2xl font-black tracking-wide text-[#ff9800]">LOCANEX</a>
    <nav className="hidden items-center gap-6 text-sm lg:flex">
     {([['products',t.navProducts],['why',t.navWhy],['oem-odm',t.navOem],['partners',t.navPartners],['contact',t.navContact]] as const).map(([id,label])=><button key={id} onClick={()=>scrollTo(id)} className="hover:text-[#ff9800]">{label}</button>)}
    </nav>
    <div className="flex items-center gap-2">
     <button onClick={()=>setLang(lang==='th'?'zh':'th')} className="rounded border border-white/30 px-3 py-2 text-xs" aria-label="Switch language">{lang==='th'?'中文':'ไทย'}</button>
     <button onClick={()=>quoteFor()} className="hidden rounded bg-[#ff9800] px-4 py-2 font-bold text-black sm:block">{t.navQuote}</button>
     <button onClick={()=>setMenuOpen(!menuOpen)} className="lg:hidden" aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
    </div>
   </div>
   {menuOpen&&<nav className="flex flex-col gap-1 border-t border-white/10 bg-[#101215] p-4 lg:hidden">{([['products',t.navProducts],['why',t.navWhy],['oem-odm',t.navOem],['partners',t.navPartners],['inquiry',t.navQuote],['contact',t.navContact]] as const).map(([id,label])=><button key={id} className="p-3 text-left" onClick={()=>scrollTo(id)}>{label}</button>)}</nav>}
  </header>
  <main>
   <section id="home" className="relative flex min-h-[690px] items-center scroll-mt-20 overflow-hidden bg-black py-24">
    <Image src={HERO_DESKTOP} alt="LOCANEX power tools" width={1920} className="absolute inset-0 hidden h-full w-full object-cover md:block"/>
    <Image src={HERO_MOBILE} alt="LOCANEX power tools" width={1080} className="absolute inset-0 h-full w-full object-cover object-bottom md:hidden"/>
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30 max-md:bg-gradient-to-b max-md:from-black/95 max-md:via-black/75 max-md:to-black/20"/>
    <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8"><div className="max-w-2xl">
     <div className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[#ff9800]">{t.eyebrow}</div>
     <h1 className="mb-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{t.headline}</h1>
     <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-200 sm:text-lg">{t.intro}</p>
     <div className="mb-8 flex flex-wrap gap-3"><button onClick={()=>scrollTo('products')} className="flex items-center gap-2 bg-[#ff9800] px-6 py-4 font-bold text-black">{t.browse}<ArrowRight size={18}/></button><button onClick={()=>quoteFor()} className="border border-white/50 bg-black/30 px-6 py-4 font-semibold">{t.quote}</button></div>
     <div className="grid max-w-xl gap-3 text-sm text-gray-200 sm:grid-cols-3">{[t.point1,t.point2,t.point3].map(x=><div key={x} className="flex items-start gap-2"><CheckCircle2 size={18} className="shrink-0 text-[#ff9800]"/>{x}</div>)}</div>
    </div></div>
   </section>
   <section id="products" className="scroll-mt-24 bg-[#f0f0ef] py-16 text-[#171717] md:py-24">
    <div className="mx-auto max-w-7xl px-4 md:px-8"><div className="mb-10 text-center"><h2 className="text-3xl font-black md:text-4xl">{t.productsTitle}</h2><p className="mt-3 text-gray-600">{t.productsIntro}</p></div>
     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{productMatches.map(c=>{const img=c.record?getProductImage(c.record):undefined;return <article key={c.id} className="overflow-hidden rounded-md bg-white shadow-sm">
       <div className="flex aspect-[4/3] items-center justify-center bg-[#e8e8e8]">{img?<Image src={img} alt={getProductName(c.record!)} width={600} className="h-full w-full object-contain"/>:c.id==='battery'?<Image src={BATTERY_IMAGE} alt="MT2081 battery" width={600} className="h-full w-full object-contain"/>:<div className="px-6 text-center text-sm text-gray-500">{lang==='th'?'กรุณาตรวจสอบภาพสินค้าจาก CMS':'请从 CMS 确认对应产品图片'}</div>}</div>
       <div className="p-5"><h3 className="mb-1 text-lg font-bold">{lang==='th'?c.th:c.zh}</h3><p className="mb-4 text-xs text-gray-500">{c.record?getProductName(c.record):'LOCANEX'}</p><button onClick={()=>quoteFor(c.zh)} className="flex w-full items-center justify-center gap-2 bg-[#ff9800] px-4 py-3 font-bold text-black">{t.detail}<ArrowRight size={16}/></button></div></article>})}</div>
     <p className="mt-5 text-center text-xs text-gray-500">{t.catalogNote}</p>
    </div>
   </section>
   <section id="why" className="scroll-mt-24 py-16 md:py-24"><div className="mx-auto max-w-7xl px-4 md:px-8"><h2 className="text-center text-3xl font-black md:text-4xl">{t.whyTitle}</h2><p className="mx-auto mb-12 mt-4 max-w-2xl text-center text-gray-400">{t.whyIntro}</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{advantages.map(([Icon,title,desc])=><div key={title} className={`${card} p-6`}><Icon size={34} className="mb-5 text-[#ff9800]"/><h3 className="mb-2 text-lg font-bold">{title}</h3><p className="text-sm leading-relaxed text-gray-400">{desc}</p></div>)}</div><p className="mt-5 text-center text-xs text-gray-500">{t.warranty}</p>
   </div></section>
   <section id="oem-odm" className="scroll-mt-24 border-y border-white/10 bg-[#181a1d] py-16 md:py-24"><div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8"><div><p className="mb-3 text-sm font-bold tracking-widest text-[#ff9800]">OEM / ODM SOLUTIONS</p><h2 className="mb-5 text-3xl font-black md:text-4xl">{t.oemTitle}</h2><p className="mb-7 leading-relaxed text-gray-300">{t.oemIntro}</p><div className="mb-8 grid grid-cols-2 gap-3">{[t.oem1,t.oem2,t.oem3,t.oem4].map(x=><div className="flex items-start gap-2 text-sm" key={x}><CheckCircle2 size={18} className="shrink-0 text-[#ff9800]"/>{x}</div>)}</div><button onClick={()=>quoteFor(undefined,'oem')} className="flex items-center gap-2 bg-[#ff9800] px-6 py-4 font-bold text-black">{t.oemCta}<ArrowRight size={18}/></button></div><div className="rounded border border-[#ff9800]/30 bg-[#242629] p-8"><Factory size={72} className="mb-8 text-[#ff9800]"/><div className="text-4xl font-black">OEM / ODM</div><div className="mt-4 border-t border-white/20 pt-4 text-gray-300">LOCANEX · CUSTOM POWER TOOL SOLUTIONS</div><p className="mt-5 text-sm text-gray-400">{t.oemIntro}</p></div></div></section>
   <section id="partners" className="scroll-mt-24 py-16 md:py-24"><div className="mx-auto max-w-7xl px-4 md:px-8"><h2 className="text-center text-3xl font-black md:text-4xl">{t.partnerTitle}</h2><p className="mb-10 mt-3 text-center text-gray-400">{t.partnerIntro}</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[t.partner1,t.partner2,t.partner3,t.partner4].map((x,i)=><div key={x} className={`${card} p-6`}><Store size={30} className="mb-4 text-[#ff9800]"/><h3 className="font-bold">{x}</h3></div>)}</div>
    <h3 className="mb-8 mt-16 text-center text-2xl font-bold">{t.stepsTitle}</h3><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[t.step1,t.step2,t.step3,t.step4].map((x,i)=><div key={x} className="border-l-2 border-[#ff9800] bg-white/5 p-5"><span className="mb-3 block text-2xl font-black text-[#ff9800]">0{i+1}</span>{x}</div>)}</div>
   </div></section>
   <section id="inquiry" className="scroll-mt-24 border-t border-white/10 bg-[#111315] py-16 md:py-24"><div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[.75fr_1.25fr] md:px-8"><div><p className="mb-3 text-xs font-bold tracking-widest text-[#ff9800]">WHOLESALE & CUSTOM INQUIRY</p><h2 className="mb-5 text-3xl font-black leading-tight md:text-4xl">{t.formTitle}</h2><p className="leading-relaxed text-gray-400">{t.formIntro}</p><a href={LINE_URL} className="mt-8 inline-flex border border-[#ff9800] px-5 py-3 text-[#ff9800]">LINE: Contact LOCANEX</a></div>
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-white/15 bg-[#1a1d20] p-5 sm:grid-cols-2 sm:p-7">
     <label className="sm:col-span-2"><span className="mb-2 block text-sm">{t.inquiryType} *</span><select className={field} value={form.inquiryType} onChange={e=>change('inquiryType',e.target.value as InquiryType)}><option value="wholesale">{t.wholesale}</option><option value="oem">{t.oem}</option><option value="odm">{t.odm}</option><option value="dealer">{t.dealer}</option></select></label>
     <label><span className="mb-2 block text-sm">{t.company} *</span><input required className={field} value={form.companyName} onChange={e=>change('companyName',e.target.value)}/></label>
     <label><span className="mb-2 block text-sm">{t.companyType} *</span><select required className={field} value={form.companyType} onChange={e=>change('companyType',e.target.value)}><option value="">{t.select}</option>{[t.cRetail,t.cWhole,t.cOnline,t.cBrand,t.cOther].map((v,i)=><option key={i} value={['retailer','wholesaler','online_seller','brand_owner','other'][i]}>{v}</option>)}</select></label>
     <label><span className="mb-2 block text-sm">{t.province} *</span><select required className={field} value={form.province} onChange={e=>change('province',e.target.value)}><option value="">{t.select}</option>{thaiProvinces.map((p,i)=><option key={p} value={p}>{lang==='th'?p:cnProvinces[i]}</option>)}</select></label>
     <label><span className="mb-2 block text-sm">{t.quantity} *</span><select required className={field} value={form.quantity} onChange={e=>change('quantity',e.target.value)}><option value="">{t.select}</option>{[t.qty1,t.qty2,t.qty3,t.qty4,t.qty5,t.qty6].map((v,i)=><option value={['1-10','11-30','31-50','51-100','100+','request_quote'][i]} key={i}>{v}</option>)}</select></label>
     <fieldset className="sm:col-span-2"><legend className="mb-2 text-sm">{t.interested} *</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{categories.map(c=><label key={c.id} className="flex gap-2 rounded border border-white/15 p-3 text-xs sm:text-sm"><input type="checkbox" className="accent-[#ff9800]" checked={form.products.includes(c.zh)} onChange={e=>change('products',e.target.checked?[...form.products,c.zh]:form.products.filter(x=>x!==c.zh))}/>{lang==='th'?c.th:c.zh}</label>)}</div></fieldset>
     {(form.inquiryType==='oem'||form.inquiryType==='odm')&&<label className="sm:col-span-2"><span className="mb-2 block text-sm">{t.custom}</span><textarea rows={3} className={field} value={form.customization} onChange={e=>change('customization',e.target.value)} /></label>}
     <label><span className="mb-2 block text-sm">{t.contact} *</span><input required className={field} value={form.contactName} onChange={e=>change('contactName',e.target.value)}/></label>
     <label><span className="mb-2 block text-sm">{t.phone} *</span><input type="tel" required className={field} value={form.phone} onChange={e=>change('phone',e.target.value)} placeholder="08x-xxx-xxxx"/></label>
     <label><span className="mb-2 block text-sm">{t.line}</span><input className={field} value={form.lineId} onChange={e=>change('lineId',e.target.value)}/></label>
     <label><span className="mb-2 block text-sm">{t.shop}</span><input className={field} value={form.shopUrl} onChange={e=>change('shopUrl',e.target.value)}/></label>
     <label className="sm:col-span-2"><span className="mb-2 block text-sm">{t.notes}</span><textarea rows={3} className={field} value={form.notes} onChange={e=>change('notes',e.target.value)} /></label>
     <label className="flex items-start gap-3 text-xs text-gray-300 sm:col-span-2"><input type="checkbox" required className="mt-1 accent-[#ff9800]" checked={form.privacyConsent} onChange={e=>change('privacyConsent',e.target.checked)}/><span>{t.consent} <a href="/privacy-policy" className="underline text-[#ff9800]" target="_blank" rel="noreferrer">{t.privacy}</a></span></label>
     {message&&<div role="status" className={`sm:col-span-2 text-sm ${message==='success'?'text-green-400':'text-red-400'}`}>{message==='success'?t.success:t.error}</div>}
     <button disabled={sending} className="bg-[#ff9800] px-6 py-4 font-bold text-black disabled:opacity-50 sm:col-span-2">{sending?t.submitting:t.submit} →</button>
    </form>
   </div></section>
  </main>
  <footer id="contact" className="scroll-mt-24 border-t border-white/10 bg-black py-12"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 sm:flex-row md:px-8"><div><div className="text-2xl font-black text-[#ff9800]">LOCANEX</div><p className="mt-2 text-sm text-gray-400">{t.footer}</p></div><div><h3 className="mb-3 font-bold">{t.navContact}</h3><a href={LINE_URL} className="block text-sm text-gray-300 hover:text-[#ff9800]">LINE: Contact LOCANEX</a><a href="tel:0926219611" className="mt-2 block text-sm text-gray-300">0926219611</a></div></div><div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-5 text-xs text-gray-500 md:px-8">© {new Date().getFullYear()} LOCANEX</div></footer>
  <button onClick={()=>quoteFor()} className="fixed bottom-0 left-0 z-40 w-full bg-[#ff9800] px-4 py-4 font-bold text-black shadow-2xl sm:hidden">{t.navQuote} →</button>
 </div>;
}

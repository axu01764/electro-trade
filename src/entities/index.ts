/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: coreproducts
 * Interface for Coreproducts
 */
export interface Coreproducts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  productName?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productImage?: string;
  /** @wixFieldType text */
  productDescription?: string;
  /** @wixFieldType text */
  productModel?: string;
  /** @wixFieldType text */
  keyFeatures?: string;
}


/**
 * Collection ID: distributorapplications
 * Interface for Distributorapplications
 */
export interface Distributorapplications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  companyName?: string;
  /** @wixFieldType text */
  contactPersonName?: string;
  /** @wixFieldType text */
  contactPhone?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  companyType?: string;
  /** @wixFieldType text */
  toolAspects?: string;
  /** @wixFieldType text */
  sampleWillingness?: string;
  /** @wixFieldType text */
  purchaseProfile?: string;
  /** @wixFieldType boolean */
  privacyConsent?: boolean;
  /** @wixFieldType text */
  applicantRole?: string;
  /** @wixFieldType text */
  purchasePreference?: string;
  /** @wixFieldType text */
  purchaseToolTypes?: string;
  /** @wixFieldType text */
  purchaseQuantity?: string;
}


/**
 * Collection ID: faq
 * Interface for Faq
 */
export interface Faq {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  question?: string;
  /** @wixFieldType text */
  answer?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  keywords?: string;
  /** @wixFieldType datetime */
  lastUpdated?: Date | string;
}


/**
 * Collection ID: Import1
 * Interface for _1
 */
export interface _1 {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  companyName?: string;
  /** @wixFieldType text */
  contactName?: string;
  /** @wixFieldType text */
  phone?: string;
  /** @wixFieldType text */
  lineId?: string;
  /** @wixFieldType text */
  currentProducts?: string;
  /** @wixFieldType text */
  otherCurrentProduct?: string;
  /** @wixFieldType text */
  desiredSample?: string;
  /** @wixFieldType text */
  otherDesiredSample?: string;
  /** @wixFieldType text */
  desiredSamplePriceTier?: string;
  /** @wixFieldType text */
  currentBrands?: string;
  /** @wixFieldType text */
  otherBrand?: string;
  /** @wixFieldType text */
  problems?: string;
  /** @wixFieldType text */
  otherProblem?: string;
  /** @wixFieldType text */
  monthlySalesRange?: string;
  /** @wixFieldType text */
  businessType?: string;
  /** @wixFieldType text */
  otherBusinessType?: string;
  /** @wixFieldType text */
  province?: string;
  /** @wixFieldType text */
  district?: string;
  /** @wixFieldType text */
  salesChannels?: string;
  /** @wixFieldType text */
  otherSalesChannel?: string;
  /** @wixFieldType text */
  firstOrderQuantity?: string;
  /** @wixFieldType text */
  feedbackWillingness?: string;
  /** @wixFieldType url */
  onlineLink?: string;
  /** @wixFieldType text */
  additionalNeeds?: string;
  /** @wixFieldType boolean */
  consentAccuracy?: boolean;
  /** @wixFieldType boolean */
  consentEligibility?: boolean;
  /** @wixFieldType boolean */
  consentContact?: boolean;
  /** @wixFieldType url */
  sourceUrl?: string;
  /** @wixFieldType text */
  utmSource?: string;
  /** @wixFieldType text */
  utmMedium?: string;
  /** @wixFieldType text */
  utmCampaign?: string;
  /** @wixFieldType text */
  utmContent?: string;
  /** @wixFieldType text */
  fbclid?: string;
  /** @wixFieldType text */
  submissionStatus?: string;
  /** @wixFieldType datetime */
  submittedAt?: Date | string;
  /** @wixFieldType datetime */
  updatedDate?: Date | string;
}

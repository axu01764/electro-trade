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

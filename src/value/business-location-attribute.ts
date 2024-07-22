import { Attributes, Attribute } from './attribute';
import { DataSource } from './data-source';

/**
 * 拠点情報のもととなる属性値
 */
type BaseAttributeValue<T extends Attribute, U> = {
  /** SOC: 組織(法人・個人事業主)を一意に特定するID */
  sansan_organization_code: string;
  /** SLC: 拠点を一意に特定するID */
  sansan_location_code: string;
  /** データソース: データの取得元を表す */
  data_source: DataSource;
  /** データの収集日時 */
  crawled_at: Date;
  /** 拠点情報のもととなる属性名 */
  attribute: T;
  /** 属性に対応する値 */
  value: U;
};

export type BaseName = string;
export type BaseNameAttributeValue = BaseAttributeValue<
  typeof Attributes.BASE_NAME,
  BaseName
>;

export type ZipCode = string;
export type ZipCodeAttributeValue = BaseAttributeValue<
  typeof Attributes.ZIP_CODE,
  ZipCode
>;

export type Address = string;
export type AddressAttributeValue = BaseAttributeValue<
  typeof Attributes.ADDRESS,
  Address
>;

export type PhoneNumber = string;
export type PhoneNumberAttributeValue = BaseAttributeValue<
  typeof Attributes.PHONE_NUMBER,
  PhoneNumber
>;

export type PrefectureCode = string;
export type PrefectureCodeAttributeValue = BaseAttributeValue<
  typeof Attributes.PREFECTURE_CODE,
  PrefectureCode
>;

export type BusinessLocationAttribute =
  | BaseNameAttributeValue
  | ZipCodeAttributeValue
  | AddressAttributeValue
  | PhoneNumberAttributeValue
  | PrefectureCodeAttributeValue;

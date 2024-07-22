/**
 * 拠点情報の属性名
 */
export const Attributes = {
  /** 拠点名 */
  BASE_NAME: 'base_name',
  /** 郵便番号 */
  ZIP_CODE: 'zip_code',
  /** 住所 */
  ADDRESS: 'address',
  /** 電話番号 */
  PHONE_NUMBER: 'phone_number',
  /** 都道府県コード */
  PREFECTURE_CODE: 'prefecture_code',
} as const;

export type Attribute = (typeof Attributes)[keyof typeof Attributes];

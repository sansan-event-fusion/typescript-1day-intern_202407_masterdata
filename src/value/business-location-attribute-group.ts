import { BusinessLocationAttribute } from './business-location-attribute';

/**
 * SOCグループ化したEAV
 */
export type BusinessLocationAttributesGroupBySOC = {
  /** SOC: 組織(法人・個人事業主)を一意に特定するID */
  sansan_organization_code: string;
  /** 拠点情報の元となる属性値の配列 */
  attributes: BusinessLocationAttribute[];
};

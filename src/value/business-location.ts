import { z } from 'zod';
import { SLC, SOC } from './sansan-code';
import { Attributes } from './attribute';

export type BusinessLocation = z.infer<typeof BusinessLocation>;

/**
 * 拠点情報
 */
export const BusinessLocation = z.object({
  /** SOC: 組織(法人・個人事業主)を一意に特定するID */
  sansan_organization_code: SOC,
  /** SLC: 拠点を一意に特定するID */
  sansan_location_code: SLC,
  /** 拠点名 */
  [Attributes.BASE_NAME]: z.string().min(1),
  /** 住所 */
  [Attributes.ADDRESS]: z.string().min(1),
  /** 電話番号 */
  [Attributes.PHONE_NUMBER]: z.string().nullable().default(null),
  /** 郵便番号 */
  [Attributes.ZIP_CODE]: z.string().nullable().default(null),
  /** 拠点情報の更新日時: 最新の収集日 */
  updated_at: z.date(),
});

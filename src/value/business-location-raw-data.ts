import { DataSource } from './data-source';

/**
 * csv ファイルから読み込んだ生データ
 */
export type BusinessLocationRawData = {
  /** SOC: 組織(法人・個人事業主)を一意に特定するID */
  sansan_organization_code: string;
  /** SLC: 拠点を一意に特定するID */
  sansan_location_code: string;
  /** 法人番号 */
  corporate_number: string;
  /** データソース: データの取得元を表す */
  data_source: DataSource;
  /** 組織(法人・個人事業主)名 */
  company_name: string;
  /** 拠点名 */
  base_name: string;
  /** 郵便番号 */
  zip_code: string;
  /** 住所 */
  address: string;
  /** 電話番号 */
  phone_number: string;
  /** 収集日時 */
  crawled_at: Date;
};

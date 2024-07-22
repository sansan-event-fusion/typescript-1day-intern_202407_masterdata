import { DataSources } from 'src/value/data-source';

import { BusinessLocationRawData } from 'src/value/business-location-raw-data';

export const dummySOC = '1234567890123';
const dummySLC = '1234567890456';

export const dummyRawData: BusinessLocationRawData = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  corporate_number: '1234567890123',
  data_source: DataSources.ZC_IRYO,
  company_name: 'Sansan株式会社',
  base_name: 'Sansan株式会社',
  zip_code: '1234567',
  address: '東京都港区',
  phone_number: '03-1234-5678',
  crawled_at: new Date(),
};

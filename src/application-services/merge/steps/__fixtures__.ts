import { DataSources } from 'src/value/data-source';
import { Attributes } from 'src/value/attribute';
import { BusinessLocationAttribute } from 'src/value/business-location-attribute';

export const dummySOC = '1234567890123';
export const dummySLC = '1234567890456';
const now = new Date();

export const baseAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  data_source: DataSources.ZC_IRYO,
  crawled_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
  attribute: Attributes.BASE_NAME,
  value: '本店',
};

export const oldAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  data_source: DataSources.ZC_IRYO,
  crawled_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
  attribute: Attributes.BASE_NAME,
  value: '総合病院',
};

export const otherDataSourceAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  data_source: DataSources.ZC_KAIGO,
  crawled_at: now,
  attribute: Attributes.BASE_NAME,
  value: '主たる事務所',
};

export const baseData: BusinessLocationAttribute[] = [
  baseAttribute,
  oldAttribute,
  otherDataSourceAttribute,
];

export const modificationAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  data_source: DataSources.MODIFICATION,
  crawled_at: new Date(),
  attribute: Attributes.BASE_NAME,
  value: '本社',
};

export const modificationOldAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  data_source: DataSources.MODIFICATION,
  crawled_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
  attribute: Attributes.BASE_NAME,
  value: '本社事務所',
};

export const manualCollectionAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  data_source: DataSources.MANUAL_COLLECTION,
  crawled_at: new Date(),
  attribute: Attributes.BASE_NAME,
  value: '東京本社',
};

export const manualCollectionOtherAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  data_source: DataSources.MANUAL_COLLECTION,
  crawled_at: new Date(),
  attribute: Attributes.ZIP_CODE,
  value: '123-4567',
};

export const otherAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: dummySLC,
  data_source: DataSources.ZC_IRYO,
  crawled_at: now,
  attribute: Attributes.ZIP_CODE,
  value: '890-1234',
};

export const otherSLCAttribute = {
  sansan_organization_code: dummySOC,
  sansan_location_code: '1234567890789',
  data_source: DataSources.ZC_IRYO,
  crawled_at: now,
  attribute: Attributes.BASE_NAME,
  value: '主たる営業所',
};

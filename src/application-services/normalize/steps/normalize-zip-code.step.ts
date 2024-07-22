import { NormalizeWorkflowStep } from 'src/types/normalize-workflow-step';
import { Attributes } from 'src/value/attribute';
import { ZipCodeAttributeValue } from 'src/value/business-location-attribute';

export const NormalizeZipCodeStep: NormalizeWorkflowStep = (data) => {
  if (!data.in.zip_code) return data;

  const normalizedZipCode = normalizeZipCode(data.in.zip_code);

  const zipCodeAttribute: ZipCodeAttributeValue = {
    sansan_organization_code: data.in.sansan_organization_code,
    sansan_location_code: data.in.sansan_location_code,
    data_source: data.in.data_source,
    crawled_at: data.in.crawled_at,
    attribute: Attributes.ZIP_CODE,
    value: normalizedZipCode,
  };
  const result = {
    ...data,
    out: [...data.out, zipCodeAttribute],
  };
  return result;
};

const normalizeZipCode = (zipCode: string) => {
  // ここに処理を書いてください
  return zipCode;
};

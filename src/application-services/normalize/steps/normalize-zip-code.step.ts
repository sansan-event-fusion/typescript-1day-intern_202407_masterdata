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

  // 数字の区切り文字を半角ハイフンに統一
  zipCode = zipCode.replace(/\u30fc/g, '-');

  // 全角文字を半角文字に
  zipCode = zipCode.normalize('NFKC');
  // zipCode = zipCode.replace(/[０-９]/g, (s) => {
  //   return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  // });

  // 空白文字の削除
  zipCode = zipCode.replace(/\s/g, '');

  // フォーマットの統一
  if (zipCode.match(/^\d{7}$/) || zipCode.match(/^\d{5}$/)) {
    zipCode = zipCode.slice(0, 3) + '-' + zipCode.slice(3);
  }

  return zipCode;
};

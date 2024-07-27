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
  let normalizeZipCode = zipCode.replace('ー', '-');
  const nums = [];

  normalizeZipCode = normalizeZipCode.replace(/[０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
  // 正解
  // normalizeZipCode = normalizeZipCode.normalize('NFKC');

  normalizeZipCode = normalizeZipCode.replace(/\s/g, '');
  // 数字を抽出し、フォーマット
  const match = normalizeZipCode.match(/^(\d{3})(\d{2})(\d{2})?$/);
  if (!match) return normalizeZipCode;
  return match[1] + '-' + match[2] + (match[3] || '');

  // let normalizeZipCode2 = normalizeZipCode.match(/^(d{3})(\d{2})(\d{2})?$/g);

  // let normalizeZipCode2 = normalizeZipCode.match(/\d{5}|\d{7}/g);
  // if (normalizeZipCode2.length ==5){
  //   let normalizeZipCodeBefore = normalizeZipCode.substr(0,3)
  //   let normalizeZipCodeAfter = normalizeZipCode.substr(4,5)
  //   normalizeZipCode = normalizeZipCodeBefore+"-"+normalizeZipCodeAfter
  // } else if (normalizeZipCode2.length ==7){
  //   let normalizeZipCodeBefore = normalizeZipCode.substr(0,3)
  //   let normalizeZipCodeAfter = normalizeZipCode.substr(4,7)
  //   normalizeZipCode = normalizeZipCodeBefore+"-"+normalizeZipCodeAfter
  // }

  // console.log('い', normalizeZipCode);
  return normalizeZipCode;
};

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
  if (!zipCode) return zipCode;

  //半角ハイフンへの変換
  let normalizedZipCode = zipCode.replace(/\u30FC/g, '-');
  // 半角化(Unicode正規化)
  normalizedZipCode = normalizedZipCode.normalize('NFKC');

  // 空白文字の削除
  normalizedZipCode = normalizedZipCode.replace(/\s+/g, '-');

  //ハイフンがない場合に3文字目にハイフンを挿入
  if (!normalizedZipCode.includes('-')) {
    normalizedZipCode = normalizedZipCode.slice(0, 3) + '-' + zipCode.slice(3);
  }

  //5 or 7桁の数字以外ならそのまま返す
  //TODO: マッチ条件の最適化
  if (!normalizedZipCode.match(/^(\d{3})-(\d{2})(\d{2})?$/)) return zipCode;

  return normalizedZipCode;
};

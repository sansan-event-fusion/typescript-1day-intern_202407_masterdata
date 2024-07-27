import { NormalizeWorkflowStep } from 'src/types/normalize-workflow-step';
import { Attributes } from 'src/value/attribute';
import { PhoneNumberAttributeValue } from 'src/value/business-location-attribute';
import { CONTROL_CHARACTER_REGEXP } from './constant';

export const NormalizePhoneNumberStep: NormalizeWorkflowStep = (data) => {
  if (!data.in.phone_number) return data;

  const normalizedPhoneNumber = normalizePhoneNumber(data.in.phone_number);

  const phoneNumberAttribute: PhoneNumberAttributeValue = {
    sansan_organization_code: data.in.sansan_organization_code,
    sansan_location_code: data.in.sansan_location_code,
    data_source: data.in.data_source,
    crawled_at: data.in.crawled_at,
    attribute: Attributes.PHONE_NUMBER,
    value: normalizedPhoneNumber,
  };
  const result = {
    ...data,
    out: [...data.out, phoneNumberAttribute],
  };
  return result;
};

const normalizePhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return phoneNumber;

  //半角ハイフンへの変換
  let normalizedPhoneNumber = phoneNumber.replace(/\u30FC/g, '-');
  // 半角化(Unicode正規化)
  normalizedPhoneNumber = normalizedPhoneNumber.normalize('NFKC');

  //空白のトリム
  normalizedPhoneNumber = normalizedPhoneNumber.trim();

  //制御文字の削除
  normalizedPhoneNumber = normalizedPhoneNumber.replace(
    CONTROL_CHARACTER_REGEXP,
    '',
  );
  //BOMの削除
  normalizedPhoneNumber = normalizedPhoneNumber.replace(/^\uFEFF/, '');

  //空白,タブ文字、改行文字、のハイフンへの置換
  normalizedPhoneNumber = normalizedPhoneNumber.replace(/\s+/g, '-');

  //ケース8: 先頭と末尾のかっこを削除
  normalizedPhoneNumber = normalizedPhoneNumber.replace(
    /^(\(|（)(.*)(\)|）)$/,
    '$2',
  );

  return normalizedPhoneNumber;
};

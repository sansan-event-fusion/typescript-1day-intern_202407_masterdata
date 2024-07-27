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
  // ここに処理を書いてください

  // トリム処理
  phoneNumber = phoneNumber.trim();

  // 康煕部首文字・ CJK 部首補助文字を置換
  phoneNumber = phoneNumber.replace(CONTROL_CHARACTER_REGEXP, '');

  // POINT: BOM を取り除く
  phoneNumber = phoneNumber.replace(/^\uFEFF/, '');

  // 数字の区切り文字を半角ハイフンに統一
  phoneNumber = phoneNumber.replace(/\u30fc/g, '-');

  // 全角文字を半角文字に
  phoneNumber = phoneNumber.normalize('NFKC');

  // 空白文字をハイフン
  phoneNumber = phoneNumber.replace(/\s/g, '-');

  // 括弧を削除してハイフンで区切
  phoneNumber = phoneNumber.replace(/[()（）]/g, '-');

  return phoneNumber;
};

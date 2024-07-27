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
  // let normalizePhoneNumber = phoneNumber.normalize('NFKC');

  // // MEMO 正規表現は重いから全部置換するようにreplaceAllの方がいいかも
  // normalizePhoneNumber = normalizePhoneNumber.replace(/ー/g, '-');

  // normalizePhoneNumber = normalizePhoneNumber.replace(
  //   CONTROL_CHARACTER_REGEXP,
  //   '',
  // );

  // normalizePhoneNumber = normalizePhoneNumber.trim();
  // normalizePhoneNumber = normalizePhoneNumber.replace(/\s/g, '-');

  // normalizePhoneNumber = normalizePhoneNumber.replace(/()/g, '');

  // return normalizePhoneNumber;




  // 既出
  let normalizedPhoneNumber = phoneNumber.normalize('NFKC');

  // 既出
  normalizedPhoneNumber = normalizedPhoneNumber.replace(/\u30FC/g, '-');

  // POINT: タブ文字、改行文字、復帰文字以外の制御文字を取り除く
  normalizedPhoneNumber = normalizedPhoneNumber.replace(
    CONTROL_CHARACTER_REGEXP,
    '',
  );

  // POINT: BOM を取り除く
  normalizedPhoneNumber = normalizedPhoneNumber.replace(/^\uFEFF/, '');

  // POINT: 先頭末尾の空白のみを取り除く
  normalizedPhoneNumber = normalizedPhoneNumber.trim();

  return normalizedPhoneNumber;
};

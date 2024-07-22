import { normalize } from '@geolonia/normalize-japanese-addresses';
import { NormalizeWorkflowStep } from 'src/types/normalize-workflow-step';
import { Attributes } from 'src/value/attribute';
import { AddressAttributeValue } from 'src/value/business-location-attribute';
import { CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP } from './constant';

const IROHA_ADDRESS = [
  '金沢市高柳町',
  '金沢市二口町',
  '金沢市金市町',
  '金沢市大浦町',
  '金沢市東力町',
  '金沢市神谷内町',
  '金沢市専光寺町',
  '金沢市金石本町',
  '能美市寺井町',
  '金沢市保古町',
  '金沢市浅野本町',
];
const IROHA_REGEX = new RegExp(
  `(?<=${IROHA_ADDRESS.join('|')})二(?=[0-9〇一二三四五六七八九十百千])`,
);

// WANT: 同期処理にしたい
export const NormalizeAddressStep: NormalizeWorkflowStep = async (data) => {
  try {
    if (!data.in.address) return data;

    const normalizedAddress = await normalizeAddress(data.in.address);

    const addressAttribute: AddressAttributeValue = {
      sansan_organization_code: data.in.sansan_organization_code,
      sansan_location_code: data.in.sansan_location_code,
      data_source: data.in.data_source,
      crawled_at: data.in.crawled_at,
      attribute: Attributes.ADDRESS,
      value: normalizedAddress,
    };
    const result = {
      ...data,
      out: [...data.out, addressAttribute],
    };
    return result;
  } catch (err) {
    console.error(
      `住所正規化エラー, err: ${err}, address: ${data.in.address}, stack: ${err.stack}`,
    );
    return data;
  }
};

const normalizeAddress = async (address: string) => {
  // ここに処理を書いてください

  // 住所正規化ライブラリ
  // const geoloniaNormalizedObj = await normalize(result);
  // result =
  //   geoloniaNormalizedObj.pref +
  //   geoloniaNormalizedObj.city +
  //   geoloniaNormalizedObj.town +
  //   geoloniaNormalizedObj.addr;
  return address;
};

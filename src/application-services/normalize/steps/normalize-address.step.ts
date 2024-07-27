import { normalize } from '@geolonia/normalize-japanese-addresses';
import { NormalizeWorkflowStep } from 'src/types/normalize-workflow-step';
import { Attributes } from 'src/value/attribute';
import { AddressAttributeValue } from 'src/value/business-location-attribute';
import {
  CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP,
  CONTROL_CHARACTER_REGEXP,
} from './constant';

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
  // const geoloniaNormalizedObj: NormalizeResult = await normalize(address);
  // let result =
  //   `geoloniaNormalizedObj.pref +
  //   geoloniaNormalizedObj.city +
  //   geoloniaNormalizedObj.town +
  //   geoloniaNormalizedObj.addr`;

  // CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP.forEach((arr) => {
  //   // console.log('====================');
  //   // console.log(arr);
  //   // console.log('====================');

  //   if (typeof arr[1] !== 'string') return;

  //   geoloniaNormalizedObj.pref = geoloniaNormalizedObj.pref.replace(
  //     arr[0],
  //     arr[1],
  //   );
  // });

  // let result = `${geoloniaNormalizedObj.pref}${geoloniaNormalizedObj.city}${geoloniaNormalizedObj.town}${geoloniaNormalizedObj.addr}`;

  // return normalizeAddress;

  let result = address;
  // 既出: 制御文字を除去
  result = result.replace(CONTROL_CHARACTER_REGEXP, '');

  // 既出: 康煕部首文字、および、CJK 部首補助文字を、CJK 統合漢字に 1 対 1 で置換
  result = CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP.reduce(
    (accumulator: string, [fromRegexp, to]: [RegExp, string]) => {
      return accumulator.replace(fromRegexp, to);
    },
    result,
  );

  // 既出: 半角カナ=>全角カナ、全角英数=>半角英数に変換
  result = result.normalize('NFKC');

  // 正規化メイン処理
  const geoloniaNormalizedObj = await normalize(result);
  result =
    geoloniaNormalizedObj.pref +
    geoloniaNormalizedObj.city +
    geoloniaNormalizedObj.town +
    geoloniaNormalizedObj.addr; // geolonia 正規化が失敗しても addr に住所は入っている

  return result;
};

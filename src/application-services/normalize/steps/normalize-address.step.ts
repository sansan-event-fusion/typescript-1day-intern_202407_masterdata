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
  let result = address;
  const geoloniaNormalizedObj = await normalize(result);
  result =
    geoloniaNormalizedObj.pref +
    geoloniaNormalizedObj.city +
    geoloniaNormalizedObj.town +
    geoloniaNormalizedObj.addr;

  result = CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP.reduce(
    (accumulator: string, [fromRegexp, to]: [RegExp, string]) => {
      return accumulator.replace(fromRegexp, to);
    },
    result,
  );

  var kanaMap = {
    ｶﾞ: 'ガ',
    ｷﾞ: 'ギ',
    ｸﾞ: 'グ',
    ｹﾞ: 'ゲ',
    ｺﾞ: 'ゴ',
    ｻﾞ: 'ザ',
    ｼﾞ: 'ジ',
    ｽﾞ: 'ズ',
    ｾﾞ: 'ゼ',
    ｿﾞ: 'ゾ',
    ﾀﾞ: 'ダ',
    ﾁﾞ: 'ヂ',
    ﾂﾞ: 'ヅ',
    ﾃﾞ: 'デ',
    ﾄﾞ: 'ド',
    ﾊﾞ: 'バ',
    ﾋﾞ: 'ビ',
    ﾌﾞ: 'ブ',
    ﾍﾞ: 'ベ',
    ﾎﾞ: 'ボ',
    ﾊﾟ: 'パ',
    ﾋﾟ: 'ピ',
    ﾌﾟ: 'プ',
    ﾍﾟ: 'ペ',
    ﾎﾟ: 'ポ',
    ｳﾞ: 'ヴ',
    ﾜﾞ: 'ヷ',
    ｦﾞ: 'ヺ',
    ｱ: 'ア',
    ｲ: 'イ',
    ｳ: 'ウ',
    ｴ: 'エ',
    ｵ: 'オ',
    ｶ: 'カ',
    ｷ: 'キ',
    ｸ: 'ク',
    ｹ: 'ケ',
    ｺ: 'コ',
    ｻ: 'サ',
    ｼ: 'シ',
    ｽ: 'ス',
    ｾ: 'セ',
    ｿ: 'ソ',
    ﾀ: 'タ',
    ﾁ: 'チ',
    ﾂ: 'ツ',
    ﾃ: 'テ',
    ﾄ: 'ト',
    ﾅ: 'ナ',
    ﾆ: 'ニ',
    ﾇ: 'ヌ',
    ﾈ: 'ネ',
    ﾉ: 'ノ',
    ﾊ: 'ハ',
    ﾋ: 'ヒ',
    ﾌ: 'フ',
    ﾍ: 'ヘ',
    ﾎ: 'ホ',
    ﾏ: 'マ',
    ﾐ: 'ミ',
    ﾑ: 'ム',
    ﾒ: 'メ',
    ﾓ: 'モ',
    ﾔ: 'ヤ',
    ﾕ: 'ユ',
    ﾖ: 'ヨ',
    ﾗ: 'ラ',
    ﾘ: 'リ',
    ﾙ: 'ル',
    ﾚ: 'レ',
    ﾛ: 'ロ',
    ﾜ: 'ワ',
    ｦ: 'ヲ',
    ﾝ: 'ン',
    ｧ: 'ァ',
    ｨ: 'ィ',
    ｩ: 'ゥ',
    ｪ: 'ェ',
    ｫ: 'ォ',
    ｯ: 'ッ',
    ｬ: 'ャ',
    ｭ: 'ュ',
    ｮ: 'ョ',
    '｡': '。',
    '､': '、',
    ｰ: 'ー',
    '｢': '「',
    '｣': '」',
    '･': '・',
  };

  let reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
  result = result
    .replace(reg, function (match) {
      return kanaMap[match];
    })
    .replace(/ﾞ/g, '゛')
    .replace(/ﾟ/g, '゜');

  result = result.replace(CONTROL_CHARACTER_REGEXP, '');
  return result
};

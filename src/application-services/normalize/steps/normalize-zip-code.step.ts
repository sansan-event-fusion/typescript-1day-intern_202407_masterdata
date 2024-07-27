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
//   let normalizeZipCode = zipCode.replace('ー', '-');

//   // number
//   // const kans = '〇一二三四五六七八九';

//   // normalizeZipCode = normalizeZipCode.match(/^\d{3}-?\d{4}$/);

//   // if ()
//   normalizeZipCode = normalizeZipCode.normalize('NFKC');

//   // \t、\n、\r、\f
//   // normalizeZipCode.trim();

//   normalizeZipCode = zipCode.replace(/\s/g, '');

//   // const pattern1 = /^\d{3}-?\d{4}$/g;
//   // const pattern2 = /^\d{3}-?\d{2}$/g;

//   const pattern1 = /(\d{3})-(\d{4})/g;

//   const pattern1 = /^\d{3})-(\d{4})/g;


//   if()
// normalizeZipCode = normalizeZipCode.replace(pattern1, "($1)-($2)");

//   if ()

//   if (!!normalizeZipCode.match(pattern1) || !!normalizeZipCode.match(pattern2)) {
//     // ハイフン挿入
//     const len = normalizeZipCode.length;
//     if (len === 7) {


//     } else if (len === 5) {

//     }
//   }


//   const str = "123-456-7890";
// const pattern = /(\d{3})-(\d{3})-(\d{4})/;
// const newStr = str.replace(pattern, "($1) $2-$3");
// console.log(newStr); // "(123) 456-7890"

//   // normalizeZipCode = zipCode.replace(/\d{3}/g, '');

//   return normalizeZipCode;

  // 全角ハイフンを半角ハイフンに変換する
  let normalizedZipCode = zipCode.replace(/\u30FC/g, '-');

  // Unicode正規化
  normalizedZipCode = normalizedZipCode.normalize('NFKC');

  // 空白文字を全て削除する
  normalizedZipCode = normalizedZipCode.replace(/\s/g, '');

  // 数字を抽出し、フォーマット
  const match = normalizedZipCode.match(/^(\d{3})(\d{2})(\d{2})?$/);
  if (!match) return normalizedZipCode;
  return match[1] + '-' + match[2] + (match[3] || '');
};

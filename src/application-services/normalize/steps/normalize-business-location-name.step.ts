import { NormalizeWorkflowStep } from 'src/types/normalize-workflow-step';
import { Attributes } from 'src/value/attribute';
import { BaseNameAttributeValue } from 'src/value/business-location-attribute';
import { CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP } from './constant';

export const NormalizeBusinessLocationNameStep: NormalizeWorkflowStep = (
  data,
) => {
  if (!data.in.base_name) return data;

  const normalizedBusinessLocationName = normalizeBusinessLocationName(
    data.in.base_name,
  );
  const baseNameAttribute: BaseNameAttributeValue = {
    sansan_organization_code: data.in.sansan_organization_code,
    sansan_location_code: data.in.sansan_location_code,
    data_source: data.in.data_source,
    crawled_at: data.in.crawled_at,
    attribute: Attributes.BASE_NAME,
    value: normalizedBusinessLocationName,
  };
  const result = {
    ...data,
    out: [...data.out, baseNameAttribute],
  };
  return result;
};

const normalizeBusinessLocationName = (businessLocationName: string) => {
  // ここに処理を書いてください
  // let normalizeBusinessLocationName = businessLocationName;

  // CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP.forEach((arr) => {
  //   // console.log('====================');
  //   // console.log(arr);
  //   // console.log('====================');

  //   if (typeof arr[1] === 'string') {
  //     normalizeBusinessLocationName = normalizeBusinessLocationName.replace(
  //       arr[0],
  //       arr[1],
  //     );
  //   }
  // });

    // POINT: 置換対象文字が置換される
    let normalizeBusinessLocationName = CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP.reduce(
      (accumulator: string, [fromRegexp, to]: [RegExp, string]) => {
        return accumulator.replace(fromRegexp, to);
      },
      businessLocationName,
    );

  return normalizeBusinessLocationName;
};

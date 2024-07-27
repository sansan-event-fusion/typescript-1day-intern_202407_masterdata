import { NormalizeWorkflowStep } from 'src/types/normalize-workflow-step';
import { Attributes } from 'src/value/attribute';
import { BaseNameAttributeValue } from 'src/value/business-location-attribute';
import {
  CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP,
  CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_LIST,
} from './constant';

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
  if (!businessLocationName) return businessLocationName;

  // 置換処理
  CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_LIST.map((lst) => {
    const from = lst[1];
    const to = lst[3];
    const reg = new RegExp(from, 'g');
    businessLocationName = businessLocationName.replace(reg, to);
  });

  //前スペース, 後ろスペース付きの本社がある場合

  return businessLocationName;
};

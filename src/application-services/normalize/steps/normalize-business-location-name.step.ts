import { NormalizeWorkflowStep } from 'src/types/normalize-workflow-step';
import { Attributes } from 'src/value/attribute';
import { BaseNameAttributeValue } from 'src/value/business-location-attribute';
import { CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP } from './constant';
import { from } from 'rxjs';

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

  // 康煕部首文字・ CJK 部首補助文字を置換
  for (const [from, to] of CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP) {
    businessLocationName = businessLocationName.replace(from, to);
  }

  // 拠点名に法人名が含まれていた場合、法人名を除去
  if (businessLocationName.includes(' ')) {
    businessLocationName = businessLocationName.split(' ')[1];
  }

  

  return businessLocationName;
};

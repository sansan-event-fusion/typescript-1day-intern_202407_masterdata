import * as _ from 'lodash';
import { MergeWorkflowStep } from 'src/types/merge-workflow-step';
import { BusinessLocation } from 'src/value/business-location';
import { BusinessLocationAttribute } from 'src/value/business-location-attribute';

/**
 * 絞り込んだEAVをもとに、拠点情報を構築する
 */
export const BuildBusinessLocationStep: MergeWorkflowStep = (data) => {
  const attributeGroupBySLC = _.groupBy(
    data.in.attributes,
    (attribute) => attribute.sansan_location_code,
  );

  // POINT: lodashなら、オブジェクトに対してもmapが使える
  const businessLocations = _.map(
    attributeGroupBySLC,
    (attributes, sansan_location_code) => {
      return buildBusinessLocation(
        data.in.sansan_organization_code,
        sansan_location_code,
        attributes,
      );
    },
  );

  return {
    in: data.in,
    out: businessLocations,
  };
};

const buildBusinessLocation = (
  sansan_organization_code: string,
  sansan_location_code: string,
  attributes: BusinessLocationAttribute[],
): BusinessLocation => {
  const base: BusinessLocation = {
    sansan_organization_code,
    sansan_location_code,
  };

  const businessLocation = attributes.reduce((result, attribute) => {
    if (result.hasOwnProperty(attribute.attribute)) {
      throw new Error(`Duplicated attribute: ${attribute.attribute}`);
    }
    return {
      ...result,
      [`${attribute.attribute}`]: attribute.value,
    };
  }, base);

  // 最新の収集日を更新日とする
  businessLocation.updated_at = _.maxBy(
    attributes,
    (attribute) => attribute.crawled_at,
  )?.crawled_at;

  return BusinessLocation.parse(businessLocation);
};

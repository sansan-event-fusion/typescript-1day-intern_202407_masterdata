import { BusinessLocationAttribute } from 'src/value/business-location-attribute';
import {
  baseData,
  dummySOC,
  manualCollectionAttribute,
  manualCollectionOtherAttribute,
  modificationAttribute,
  otherAttribute,
  otherSLCAttribute,
} from './__fixtures__';
import { SelectManualCollectionStep } from './select-manual-collection.step';

describe('SelectManualCollectionStep', () => {
  it('人力収集がない場合、何もしないで受け取ったMergeWorkFlowDataをそのまま返す', () => {
    const result = SelectManualCollectionStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: baseData,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: baseData,
      },
      out: undefined,
    });
  });

  it('人力収集がない場合に、修正データがあっても、何もしないで受け取ったMergeWorkFlowDataをそのまま返す', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      modificationAttribute,
    ];
    const result = SelectManualCollectionStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
  });

  it('人力収集が一件のみの場合、人力収集データのみが残る', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      manualCollectionAttribute,
    ];
    const result = SelectManualCollectionStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [manualCollectionAttribute],
      },
      out: undefined,
    });
  });

  it('人力収集が複数の場合、人力収集データのみが残る', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      manualCollectionAttribute,
      manualCollectionOtherAttribute,
    ];
    const result = SelectManualCollectionStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [manualCollectionAttribute, manualCollectionOtherAttribute],
      },
      out: undefined,
    });
  });

  it('人力収集の他に修正データがある場合、人力収集と修正データが残る', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      modificationAttribute,
      manualCollectionAttribute,
    ];
    const result = SelectManualCollectionStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [modificationAttribute, manualCollectionAttribute],
      },
      out: undefined,
    });
  });

  it('人力収集データがある場合、他のSLCのデータも除去する', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      manualCollectionAttribute,
      otherAttribute,
      otherSLCAttribute,
    ];

    const result = SelectManualCollectionStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [manualCollectionAttribute],
      },
      out: undefined,
    });
  });
});

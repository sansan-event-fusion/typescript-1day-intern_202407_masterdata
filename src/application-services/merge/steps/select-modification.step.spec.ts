import { BusinessLocationAttribute } from 'src/value/business-location-attribute';
import {
  baseData,
  dummySOC,
  manualCollectionAttribute,
  modificationAttribute,
  modificationOldAttribute,
  otherAttribute,
  otherSLCAttribute,
} from './__fixtures__';
import { SelectModificationStep } from './select-modification.step';

describe('SelectModificationStep', () => {
  it('SLC+項目単位で修正がない場合、何もしないで受け取ったMergeWorkFlowDataをそのまま返す', () => {
    const result = SelectModificationStep({
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

  it('SLC+項目単位で修正が1件のみ場合、その修正データのみ返す', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      modificationAttribute,
    ];
    const result = SelectModificationStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [modificationAttribute],
      },
      out: undefined,
    });
  });

  it('SLC+項目単位で修正が複数件の場合、すべての修正データを返す', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      modificationAttribute,
      modificationOldAttribute,
    ];
    const result = SelectModificationStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [modificationAttribute, modificationOldAttribute],
      },
      out: undefined,
    });
  });

  it('SLC+項目単位で人力収集データがあったとしても、修正がある場合、修正データのみ返す', () => {
    const data: BusinessLocationAttribute[] = [
      modificationAttribute,
      manualCollectionAttribute,
    ];
    const result = SelectModificationStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [modificationAttribute],
      },
      out: undefined,
    });
  });

  // POINT: 順番が影響するテスト
  it('修正データを優先する場合であっても、修正データのない他のSLCのデータや修正データのない他の項目のデータは、attributeから削除しない', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      modificationAttribute,
      otherAttribute,
      otherSLCAttribute,
    ];
    const result = SelectModificationStep({
      in: {
        sansan_organization_code: dummySOC,
        attributes: data,
      },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [modificationAttribute, otherAttribute, otherSLCAttribute],
      },
      out: undefined,
    });
  });
});

import { BusinessLocationAttribute } from 'src/value/business-location-attribute';
import {
  baseAttribute,
  baseData,
  dummySOC,
  modificationAttribute,
  modificationOldAttribute,
  otherAttribute,
  otherSLCAttribute,
} from './__fixtures__';
import { SelectLatestStep } from './select-latest.step';

describe('SelectLatestStep', () => {
  it('データソースに関わらず、各項目ごとに最新のデータを選択する', () => {
    const result = SelectLatestStep({
      in: { sansan_organization_code: dummySOC, attributes: baseData },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [baseAttribute],
      },
      out: undefined,
    });
  });

  it('修正データが複数ある場合でもあっても、修正データの中で最新のデータを選択する', () => {
    const data: BusinessLocationAttribute[] = [
      modificationAttribute,
      modificationOldAttribute,
    ];
    const result = SelectLatestStep({
      in: { sansan_organization_code: dummySOC, attributes: data },
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

  it('各SLCの各項目単位で、最新のデータを採用し、他のSLCや項目には影響がないこと', () => {
    const data: BusinessLocationAttribute[] = [
      ...baseData,
      otherAttribute,
      otherSLCAttribute,
    ];
    const result = SelectLatestStep({
      in: { sansan_organization_code: dummySOC, attributes: data },
      out: undefined,
    });
    expect(result).toEqual({
      in: {
        sansan_organization_code: dummySOC,
        attributes: [baseAttribute, otherAttribute, otherSLCAttribute],
      },
      out: undefined,
    });
  });

  it.skip('同時刻のデータが来た際に、一意にデータを特定できる', () => {
    // MEMO: コンマ一秒まで同時にデータが取り込まれる可能性はほぼ0のため、一旦考えない
  });
});

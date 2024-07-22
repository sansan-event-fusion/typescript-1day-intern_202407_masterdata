import { Attributes } from 'src/value/attribute';
import { dummyRawData } from 'src/application-services/normalize/steps/fixtures';
import { BusinessLocationAttribute } from 'src/value/business-location-attribute';
import { AddPrefectureCodeStep } from './add-prefecture-code.step';

const baseAttribute = {
  sansan_organization_code: dummyRawData.sansan_organization_code,
  sansan_location_code: dummyRawData.sansan_location_code,
  data_source: dummyRawData.data_source,
  crawled_at: dummyRawData.crawled_at,
};

describe.skip('AddPrefectureCodeStep', () => {
  describe('正常系', () => {
    it.each([
      [
        '元データに都道府県がある場合に、都道府県コードを採番する',
        '京都府京都市中京区坂井町４５６',
        '26',
      ],
      [
        '元データに都道府県がない場合も、住所正規化できる場合は、都道府県コードを採番する',
        '神山町神領東青井夫３６',
        '36',
      ],
    ])('%s', async (_, inputAddress, expectCode) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: inputAddress,
        },
        out: [],
      };

      const expected: BusinessLocationAttribute[] = [
        {
          ...baseAttribute,
          attribute: Attributes.PREFECTURE_CODE,
          value: expectCode,
        },
      ];

      const result = await AddPrefectureCodeStep(inputData);

      expect(result.out).toEqual(expected);
    });
  });

  describe('異常系', () => {
    it.each([['過去北海道に住んでいました'], ['過去に住んでいました']])(
      '不正な住所の場合は都道府県コードを採番しない',
      async (inputAddress) => {
        const inputData = {
          in: {
            ...dummyRawData,
            address: inputAddress,
          },
          out: [],
        };

        const result = await AddPrefectureCodeStep(inputData);

        expect(result).toEqual(inputData);
      },
    );
  });
});

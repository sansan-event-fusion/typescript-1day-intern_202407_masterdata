import { Attributes } from 'src/value/attribute';
import { dummyRawData } from 'src/application-services/normalize/steps/fixtures';
import { BusinessLocationAttribute } from 'src/value/business-location-attribute';
import { ComplementZipCodeStep } from './complement-zip-code.step';

const baseAttribute = {
  sansan_organization_code: dummyRawData.sansan_organization_code,
  sansan_location_code: dummyRawData.sansan_location_code,
  data_source: dummyRawData.data_source,
  crawled_at: dummyRawData.crawled_at,
};

describe.skip('ComplementZipCodeStep', () => {
  describe('住所郵便番号の補完', () => {
    it('郵便区番号が3桁の場合、補完できる', async () => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: '世田谷区若林 三丁目16番4号',
        },
        out: [],
      };

      const expected: BusinessLocationAttribute[] = [
        {
          ...baseAttribute,
          attribute: Attributes.ZIP_CODE,
          value: '154-0023',
        },
      ];

      const result = await ComplementZipCodeStep(inputData);

      expect(result.out).toEqual(expected);
    });

    it('郵便区番号が5桁の場合、補完できる', async () => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: '川越市大字小室 22-1',
        },
        out: [],
      };

      const expected: BusinessLocationAttribute[] = [
        {
          ...baseAttribute,
          attribute: Attributes.ZIP_CODE,
          value: '350-1106',
        },
      ];

      const result = await ComplementZipCodeStep(inputData);

      expect(result.out).toEqual(expected);
    });
  });

  describe('個別郵便番号の補完', () => {
    it('大口事業所番号を補完できる', async () => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: '千葉市美浜区　中瀬１－３幕張テクノガーデン４Ｆ',
        },
        out: [],
      };

      const expected: BusinessLocationAttribute[] = [
        {
          ...baseAttribute,
          attribute: Attributes.ZIP_CODE,
          value: '261-8561',
        },
      ];

      const result = await ComplementZipCodeStep(inputData);

      expect(result.out).toEqual(expected);
    });

    it('超高層ビル番号を補完できる', async () => {
      const inputData = {
        in: {
          ...dummyRawData,
          address:
            '渋谷区桜丘町 渋谷サクラステージ ＳＨＩＢＵＹＡサイド ＳＨＩＢＵＹＡタワー 28階',
        },
        out: [],
      };

      const expected: BusinessLocationAttribute[] = [
        {
          ...baseAttribute,
          attribute: Attributes.ZIP_CODE,
          value: '150-6228',
        },
      ];

      const result = await ComplementZipCodeStep(inputData);

      expect(result.out).toEqual(expected);
    });
  });
});

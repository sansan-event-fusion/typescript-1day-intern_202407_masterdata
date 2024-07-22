import { MergeWorkFlowData } from 'src/types/merge-workflow-step';
import { BuildBusinessLocationStep } from './build-business-location.step';
import { dummySLC, dummySOC } from './__fixtures__';
import { Attribute, Attributes } from 'src/value/attribute';
import { DataSources } from 'src/value/data-source';
import { BusinessLocationAttributesGroupBySOC } from 'src/value/business-location-attribute-group';
import { ZodError } from 'zod';

const now = new Date();

const buildDummyBusinessLocationAttributes = (
  slc: string,
  attributeSeeds: {
    attribute_name: Attribute;
    value: string;
  }[],
): BusinessLocationAttributesGroupBySOC => {
  return {
    sansan_organization_code: dummySOC,
    attributes: attributeSeeds.map((attribute) => ({
      sansan_organization_code: dummySOC,
      sansan_location_code: slc,
      data_source: DataSources.ZC_IRYO,
      attribute: attribute.attribute_name,
      value: attribute.value,
      crawled_at: now,
    })),
  };
};

describe('BuildBusinessLocationStep', () => {
  describe('SLCが一つしかない場合', () => {
    it('1. 正常系: 電話番号・郵便番号があるとき、拠点情報が構築できること', () => {
      const data: MergeWorkFlowData = {
        in: buildDummyBusinessLocationAttributes(dummySLC, [
          {
            attribute_name: Attributes.BASE_NAME,
            value: '本社',
          },
          {
            attribute_name: Attributes.ADDRESS,
            value: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
          },
          {
            attribute_name: Attributes.ZIP_CODE,
            value: '150-0001',
          },
          {
            attribute_name: Attributes.PHONE_NUMBER,
            value: '03-1234-5678',
          },
        ]),
        out: [],
      };
      const result = BuildBusinessLocationStep(data);
      const expected: MergeWorkFlowData = {
        ...data,
        out: [
          {
            sansan_organization_code: dummySOC,
            sansan_location_code: dummySLC,
            base_name: '本社',
            address: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
            zip_code: '150-0001',
            phone_number: '03-1234-5678',
            updated_at: now,
          },
        ],
      };
      expect(result).toEqual(expected);
    });

    it('2. 正常系: 電話番号・郵便番号がないとき、拠点情報が構築できること', () => {
      const data: MergeWorkFlowData = {
        in: buildDummyBusinessLocationAttributes(dummySLC, [
          {
            attribute_name: Attributes.BASE_NAME,
            value: '本社',
          },
          {
            attribute_name: Attributes.ADDRESS,
            value: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
          },
        ]),
        out: [],
      };
      const result = BuildBusinessLocationStep(data);
      const expected: MergeWorkFlowData = {
        ...data,
        out: [
          {
            sansan_organization_code: dummySOC,
            sansan_location_code: dummySLC,
            base_name: '本社',
            address: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
            zip_code: null,
            phone_number: null,
            updated_at: now,
          },
        ],
      };
      expect(result).toEqual(expected);
    });

    it('3. 正常系: 収集日時が異なるデータがあるとき、更新日時は最新の収集日時になること', () => {
      const latestCrawledAt = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      const businessLocationAttributes = buildDummyBusinessLocationAttributes(
        dummySLC,
        [
          {
            attribute_name: Attributes.BASE_NAME,
            value: '本社',
          },
          {
            attribute_name: Attributes.ADDRESS,
            value: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
          },
        ],
      );
      const data: MergeWorkFlowData = {
        in: {
          ...businessLocationAttributes,
          attributes: [
            ...businessLocationAttributes.attributes,
            {
              ...businessLocationAttributes.attributes[0],
              attribute: Attributes.ZIP_CODE,
              value: '150-0001',
              crawled_at: latestCrawledAt,
            },
          ],
        },
        out: [],
      };
      const result = BuildBusinessLocationStep(data);
      const expected: MergeWorkFlowData = {
        ...data,
        out: [
          {
            sansan_organization_code: dummySOC,
            sansan_location_code: dummySLC,
            base_name: '本社',
            address: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
            zip_code: '150-0001',
            phone_number: null,
            updated_at: latestCrawledAt,
          },
        ],
      };
      expect(result).toEqual(expected);
    });

    it('4. 異常系: 拠点名がない場合、拠点情報が構築されないこと', () => {
      const data: MergeWorkFlowData = {
        in: buildDummyBusinessLocationAttributes(dummySLC, [
          {
            attribute_name: Attributes.ADDRESS,
            value: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
          },
        ]),
        out: [],
      };
      expect(() => BuildBusinessLocationStep(data)).toThrowError(
        new ZodError([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['base_name'],
            message: 'Required',
          },
        ]),
      );
    });

    it('5. 異常系: 住所がない場合、拠点情報が構築されないこと', () => {
      const data: MergeWorkFlowData = {
        in: buildDummyBusinessLocationAttributes(dummySLC, [
          {
            attribute_name: Attributes.BASE_NAME,
            value: '本社',
          },
        ]),
        out: [],
      };
      expect(() => BuildBusinessLocationStep(data)).toThrowError(
        new ZodError([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['address'],
            message: 'Required',
          },
        ]),
      );
    });

    it('6. 異常系: 同じ項目が複数ある場合、拠点情報が構築されないこと', () => {
      const data: MergeWorkFlowData = {
        in: buildDummyBusinessLocationAttributes(dummySLC, [
          {
            attribute_name: Attributes.BASE_NAME,
            value: '本社',
          },
          {
            attribute_name: Attributes.BASE_NAME,
            value: '主たる営業所',
          },
          {
            attribute_name: Attributes.ADDRESS,
            value: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
          },
        ]),
        out: [],
      };
      expect(() => BuildBusinessLocationStep(data)).toThrowError(
        new Error('Duplicated attribute: base_name'),
      );
    });
  });

  describe('SLCが複数ある場合', () => {
    it('7. 正常系: SLCごとに拠点情報が構築できること', () => {
      const data: MergeWorkFlowData = {
        in: {
          sansan_organization_code: dummySOC,
          attributes: [
            ...buildDummyBusinessLocationAttributes('1234567890123', [
              {
                attribute_name: Attributes.BASE_NAME,
                value: '本社',
              },
              {
                attribute_name: Attributes.ADDRESS,
                value: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
              },
            ]).attributes,
            ...buildDummyBusinessLocationAttributes('0987654321123', [
              {
                attribute_name: Attributes.BASE_NAME,
                value: 'Sansan パラシオ',
              },
              {
                attribute_name: Attributes.ADDRESS,
                value: '東京都港区北青山3-6-7 明治安田生命青山パラシオ 4F',
              },
            ]).attributes,
          ],
        },
        out: [],
      };
      const result = BuildBusinessLocationStep(data);
      const expected: MergeWorkFlowData = {
        ...data,
        out: [
          {
            sansan_organization_code: dummySOC,
            sansan_location_code: '1234567890123',
            base_name: '本社',
            address: '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
            zip_code: null,
            phone_number: null,
            updated_at: now,
          },
          {
            sansan_organization_code: dummySOC,
            sansan_location_code: '0987654321123',
            base_name: 'Sansan パラシオ',
            address: '東京都港区北青山3-6-7 明治安田生命青山パラシオ 4F',
            zip_code: null,
            phone_number: null,
            updated_at: now,
          },
        ],
      };
      expect(result).toEqual(expected);
    });
  });
});

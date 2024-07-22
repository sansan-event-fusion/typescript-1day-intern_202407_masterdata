import { NormalizeZipCodeStep } from 'src/application-services/normalize/steps/normalize-zip-code.step';
import { Attributes } from 'src/value/attribute';
import { dummyRawData } from 'src/application-services/normalize/steps/fixtures';
import { NormalizeWorkFlowData } from 'src/types/normalize-workflow-step';

const inputToOutput = (input: NormalizeWorkFlowData) => {
  return {
    sansan_organization_code: input.in.sansan_organization_code,
    sansan_location_code: input.in.sansan_location_code,
    data_source: input.in.data_source,
    crawled_at: input.in.crawled_at,
    attribute: Attributes.ZIP_CODE,
  };
};

describe('NormalizeZipCodeStep', () => {
  it('1. 全角ハイフンが半角ハイフンに正規化される', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        zip_code: '123ー4567',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '123-4567',
    };

    const result = await NormalizeZipCodeStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it('2. 全角数字が半角数字に正規化される', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        zip_code: '１２３-４５６７',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '123-4567',
    };

    const result = await NormalizeZipCodeStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  describe('3. 空白文字が取り除かれる', () => {
    it.each([
      { input: '123 4567', expected: '123-4567' },
      { input: '123\t4567', expected: '123-4567' },
      { input: '123\n4567', expected: '123-4567' },
      { input: '123\r4567', expected: '123-4567' },
      { input: '123\r\n4567', expected: '123-4567' },
    ])('%s', async ({ input, expected }) => {
      const inputData = {
        in: {
          ...dummyRawData,
          zip_code: input,
        },
        out: [],
      };

      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };

      const result = await NormalizeZipCodeStep(inputData);

      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe('4. ハイフンが適切な位置に挿入される', () => {
    it.each([
      { input: '1234567', expected: '123-4567' },
      { input: '12345', expected: '123-45' },
    ])('%s', async ({ input, expected }) => {
      const inputData = {
        in: {
          ...dummyRawData,
          zip_code: input,
        },
        out: [],
      };

      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };

      const result = await NormalizeZipCodeStep(inputData);

      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe('5. 5 or 7桁の数字以外はそのまま返される', () => {
    it.each([
      { input: '123', expected: '123' },
      { input: '12345678', expected: '12345678' },
      { input: 'abcdefg', expected: 'abcdefg' },
    ])('%s', async ({ input, expected }) => {
      const inputData = {
        in: {
          ...dummyRawData,
          zip_code: input,
        },
        out: [],
      };

      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };

      const result = await NormalizeZipCodeStep(inputData);

      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe('6. 入力値がfalsyな値の場合、outにデータを追加しない', () => {
    it.each([[null], [undefined], ['']])('%s', async (zip_code) => {
      const inputData = {
        in: {
          ...dummyRawData,
          zip_code: zip_code,
        },
        out: [],
      };

      const result = await NormalizeZipCodeStep(inputData);
      expect(result.out.length).toEqual(0);
    });
  });

  describe('7. 正規化できない場合は、入力値をそのまま返す', () => {
    it.each([['hogehogedragon'], ['111111111111111']])(
      '%s',
      async (zip_code) => {
        const inputData = {
          in: {
            ...dummyRawData,
            zip_code: zip_code,
          },
          out: [],
        };

        const result = await NormalizeZipCodeStep(inputData);
        expect(result.out[0].value).toEqual(zip_code);
      },
    );
  });

  it('8. 5桁の郵便番号が正規化される', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        zip_code: '123ー45',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '123-45',
    };

    const result = await NormalizeZipCodeStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it('9. 全角半角が混合しているケースでも正規化される', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        zip_code: '123ー４5６７',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '123-4567',
    };

    const result = await NormalizeZipCodeStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it('10. ①、⑪を含む値も正規化される', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        zip_code: '①23-45⑪',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '123-4511',
    };

    const result = await NormalizeZipCodeStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });
});

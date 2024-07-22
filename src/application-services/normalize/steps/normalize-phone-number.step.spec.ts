import { NormalizePhoneNumberStep } from './normalize-phone-number.step';
import { Attributes } from 'src/value/attribute';
import { dummyRawData } from 'src/application-services/normalize/steps/fixtures';
import { NormalizeWorkFlowData } from 'src/types/normalize-workflow-step';

const inputToOutput = (input: NormalizeWorkFlowData) => {
  return {
    sansan_organization_code: input.in.sansan_organization_code,
    sansan_location_code: input.in.sansan_location_code,
    data_source: input.in.data_source,
    crawled_at: input.in.crawled_at,
    attribute: Attributes.PHONE_NUMBER,
  };
};

describe('NormalizePhoneNumberStep', () => {
  it('1. 全角電話番号が半角になる', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        phone_number: '０１２３４５６７８９０',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '01234567890',
    };

    const result = await NormalizePhoneNumberStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it('2. ハイフンが統一される', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        phone_number: '012ー3456ー7890',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '012-3456-7890',
    };

    const result = await NormalizePhoneNumberStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it('3. 先頭末尾の空白がトリムされる', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        phone_number: ' 012-3456-7890 ',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '012-3456-7890',
    };

    const result = await NormalizePhoneNumberStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it('4. タブ文字、改行文字、復帰文字以外の制御文字は取り除かれる', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        phone_number:
          '012\x00\x01\x02\x03\x04\x05\x06\x07\x08\x0B\x0C\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\xAD\x7F-3456-7890',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '012-3456-7890',
    };

    const result = await NormalizePhoneNumberStep(inputData);
    expect(result.out[0]).toEqual(expectedOutput);
  });

  it('5. BOM が取り除かれる', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        phone_number: '\uFEFF012-3456-7890',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '012-3456-7890',
    };

    const result = await NormalizePhoneNumberStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  describe('6. 入力値がfalsyな値の場合、outにデータを追加しない', () => {
    it.each([[null], [undefined], ['']])('%s', async (phone_number) => {
      const inputData = {
        in: {
          ...dummyRawData,
          phone_number: phone_number,
        },
        out: [],
      };

      const result = await NormalizePhoneNumberStep(inputData);
      expect(result.out.length).toEqual(0);
    });
  });

  describe.skip('7. 空白、タブ文字、改行文字で切られている場合はハイフンで置換する', () => {
    it.each([
      ['012 3456 7890', '012-3456-7890'],
      ['012　3456　7890', '012-3456-7890'],
      ['012\t3456\t7890', '012-3456-7890'],
      // 改行文字
      ['012\n3456\n7890', '012-3456-7890'],
      ['012\r3456\r7890', '012-3456-7890'],
      ['012\r\n3456\r\n7890', '012-3456-7890'],
    ])('%s', async (phone_number, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          phone_number: phone_number,
        },
        out: [],
      };

      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };

      const result = await NormalizePhoneNumberStep(inputData);

      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  it.skip('8. 先頭末尾の括弧が取り除かれる', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        phone_number: '(012-3456-7890)',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '012-3456-7890',
    };

    const result = await NormalizePhoneNumberStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it.skip('9. 数字(数字)-数字 というパターンにマッチする値の括弧を取り除き、括弧内の数字の前にハイフンを挿入する', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        phone_number: '012-(3456)-7890',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '012-3456-7890',
    };

    const result = await NormalizePhoneNumberStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it.skip('10. 数字(数字)-数字 というパターンにマッチする値の括弧を取り除き、括弧内の数字の前にハイフンを挿入する', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        phone_number: '0123(456)-7890',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '0123-456-7890',
    };

    const result = await NormalizePhoneNumberStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });
});

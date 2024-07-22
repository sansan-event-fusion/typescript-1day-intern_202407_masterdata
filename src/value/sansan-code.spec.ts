import { ZodError } from 'zod';
import { SOC, SLC } from './sansan-code';

describe('SOC', () => {
  const sansan_organization_code = '0123456789012';

  describe('.parse', () => {
    it('オブジェクトを生成できる', () => {
      expect(SOC.parse(sansan_organization_code)).toBeDefined();
    });

    // POINT: 境界値テスト
    it.each([
      ['12文字以下のとき', '012345678901'],
      ['14文字以上のとき', '01234567890123'],
      ['空文字', ''],
      ['null', null],
      ['undefined', undefined],
    ])('sansan_organization_codeが %s だとエラーになる', (_text, code) => {
      expect(() => SOC.parse(code)).toThrowError(ZodError);
    });
  });
});

describe('SLC', () => {
  const sansan_location_code = '0123456789012';

  describe('.parse', () => {
    it('オブジェクトを生成できる', () => {
      expect(SLC.parse(sansan_location_code)).toBeDefined();
    });

    it.each([
      ['12文字以下のとき', '012345678901'],
      ['14文字以上のとき', '01234567890123'],
      ['空文字', ''],
      ['null', null],
      ['undefined', undefined],
    ])('sansan_location_codeが %s だとエラーになる', (_text, code) => {
      expect(() => SLC.parse(code)).toThrowError(ZodError);
    });
  });
});

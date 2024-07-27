import {
  CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP,
  CONTROL_CHARACTER_REGEXP
} from '../steps/constant'

export type NormalizeRule = (from: string) => string

export const REMOVE_BOM: NormalizeRule = (from) =>
  from.replace(CONTROL_CHARACTER_REGEXP, '')

export const REPLACE_CJK_RADICALS: NormalizeRule = (s) =>
  CJK_RADICALS_SUPPLEMENT_REPLACE_REGEXP_MAP.reduce(
    (str, [, from, , to]) => str.replaceAll(from, to),
    s
  )

// TODO: もっとルールを追加する

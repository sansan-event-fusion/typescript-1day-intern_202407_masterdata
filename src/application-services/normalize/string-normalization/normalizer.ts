import type { NormalizeRule } from './rules'

export class StringNormalizer {
  rules: NormalizeRule[] = []

  enable(rule: NormalizeRule) {
    this.rules.push(rule)
  }

  execute(from: string) {
    return this.rules.reduce((str, rule) => rule(str), from)
  }
}

import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  collectPlatformStandardsViolations,
  validateFixturePair,
} from './verify-platform-standards.ts'

const ROOT = resolve(import.meta.dirname, '..')

describe('platform standards gate', () => {
  it('accepts the repository standards and rejects every negative fixture', () => {
    expect(collectPlatformStandardsViolations(ROOT)).toEqual([])
  })

  it('reports a positive fixture rejected by its schema', () => {
    const schema = {
      type: 'object',
      additionalProperties: false,
      required: ['id'],
      properties: { id: { type: 'string' } },
    }

    expect(validateFixturePair(schema, {}, { unexpected: true }, 'sample')).toEqual([
      "sample: valid fixture was rejected: / must have required property 'id'",
    ])
  })

  it('reports a negative fixture that no longer violates the schema', () => {
    const schema = {
      type: 'object',
      additionalProperties: false,
      required: ['id'],
      properties: { id: { type: 'string' } },
    }

    expect(validateFixturePair(schema, { id: 'valid' }, { id: 'also-valid' }, 'sample')).toEqual([
      'sample: invalid fixture was accepted; add or correct the schema rule it is meant to violate',
    ])
  })
})

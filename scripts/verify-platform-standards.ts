/**
 * Validate manufacturing-platform schemas, fixtures, agent instructions, and review entry points.
 * @module scripts/verify-platform-standards
 */

import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import Ajv2020, { type AnySchema, type ErrorObject } from 'ajv/dist/2020.js'
import { load } from 'js-yaml'

const ROOT = resolve(import.meta.dirname, '..')

const MANIFESTS = ['plugin-manifest', 'solution-profile', 'agent-manifest'] as const

const STANDARD_DOCUMENTS = [
  'README',
  'product-requirements',
  'architecture-standard',
  'agent-standard',
  'ui-standard',
  'engineering-standard',
  'security-and-conformance',
] as const

const README_LINKS = [
  'product-requirements.md',
  'architecture-standard.md',
  'agent-standard.md',
  'ui-standard.md',
  'engineering-standard.md',
  'security-and-conformance.md',
] as const

const REVIEW_MARKERS = [
  '<!-- platform-standards-impact -->',
  '<!-- platform-agent-risk -->',
  '<!-- platform-change-evidence -->',
  '<!-- platform-verification -->',
] as const

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  if (errors === undefined || errors === null || errors.length === 0) return 'unknown validation error'
  return errors
    .map(error => `${error.instancePath || '/'} ${error.message ?? 'is invalid'}`)
    .join('; ')
}

/**
 * Prove that a schema accepts its positive fixture and rejects its negative fixture.
 * @param schema - Draft 2020-12 schema to compile.
 * @param validFixture - document expected to satisfy the schema.
 * @param invalidFixture - document expected to violate the schema.
 * @param label - diagnostic subject.
 * @returns actionable conformance violations.
 */
export function validateFixturePair(
  schema: AnySchema,
  validFixture: unknown,
  invalidFixture: unknown,
  label: string,
): string[] {
  const ajv = new Ajv2020({ allErrors: true, strict: true })
  let validate: ReturnType<Ajv2020['compile']>
  try {
    validate = ajv.compile(schema)
  }
  catch (error) {
    return [`${label}: schema does not compile: ${error instanceof Error ? error.message : String(error)}`]
  }

  const violations: string[] = []
  if (!validate(validFixture)) {
    violations.push(`${label}: valid fixture was rejected: ${formatErrors(validate.errors)}`)
  }
  if (validate(invalidFixture)) {
    violations.push(`${label}: invalid fixture was accepted; add or correct the schema rule it is meant to violate`)
  }
  return violations
}

function readStructuredFile(path: string): unknown {
  const source = readFileSync(path, 'utf8')
  return path.endsWith('.json') ? JSON.parse(source) as unknown : load(source)
}

function requireFile(root: string, relativePath: string, violations: string[]): boolean {
  if (existsSync(resolve(root, relativePath))) return true
  violations.push(`${relativePath}: required platform standards file is missing`)
  return false
}

function requireText(
  root: string,
  relativePath: string,
  required: readonly string[],
  violations: string[],
): void {
  if (!requireFile(root, relativePath, violations)) return
  const source = readFileSync(resolve(root, relativePath), 'utf8')
  for (const text of required) {
    if (!source.includes(text)) violations.push(`${relativePath}: missing required marker ${JSON.stringify(text)}`)
  }
}

/**
 * Collect every mechanically enforceable platform-standards violation in a repository checkout.
 * @param root - repository root to inspect.
 * @returns violations; an empty result means the static conformance checks passed.
 */
export function collectPlatformStandardsViolations(root: string): string[] {
  const violations: string[] = []

  for (const name of STANDARD_DOCUMENTS) {
    requireFile(root, `docs/platform-standards/${name}.md`, violations)
    requireFile(root, `docs/platform-standards/${name}.zh.md`, violations)
    requireFile(root, `docs/platform-standards/${name}.i18n.yaml`, violations)
  }

  requireText(
    root,
    'docs/platform-standards/README.md',
    [...README_LINKS, '../../schemas/platform/', '../../.agents/skills/manufacturing-platform-development/SKILL.md'],
    violations,
  )
  requireText(root, 'docs/platform-standards/README.zh.md', README_LINKS, violations)
  requireText(root, 'AGENTS.md', [
    'docs/platform-standards/README.md',
    '.agents/skills/manufacturing-platform-development/SKILL.md',
  ], violations)
  requireText(root, '.agents/skills/manufacturing-platform-development/SKILL.md', [
    'enforcement owner',
    'must not import another implementation package',
    'Route reads through Query',
    'business side effect through Action',
    'PostgreSQL as authoritative',
    'Neo4j rebuildable',
    'Durable business Workflow belongs to Temporal',
    'tenant, site, principal',
    'pnpm run verify-platform-standards',
  ], violations)
  requireText(root, '.github/pull_request_template.md', REVIEW_MARKERS, violations)

  const agentsPath = resolve(root, 'AGENTS.md')
  const claudePath = resolve(root, 'CLAUDE.md')
  if (requireFile(root, 'CLAUDE.md', violations) && existsSync(agentsPath)) {
    if (realpathSync(claudePath) !== realpathSync(agentsPath)) {
      violations.push('CLAUDE.md: must resolve to root AGENTS.md so Claude and Codex receive the same instructions')
    }
  }

  for (const name of MANIFESTS) {
    const schemaRelative = `schemas/platform/${name}.schema.json`
    const validRelative = `schemas/platform/fixtures/${name}.valid.yaml`
    const invalidRelative = `schemas/platform/fixtures/${name}.invalid.yaml`
    if (![schemaRelative, validRelative, invalidRelative].every(path => requireFile(root, path, violations))) continue

    try {
      violations.push(...validateFixturePair(
        readStructuredFile(resolve(root, schemaRelative)) as AnySchema,
        readStructuredFile(resolve(root, validRelative)),
        readStructuredFile(resolve(root, invalidRelative)),
        name,
      ))
    }
    catch (error) {
      violations.push(`${name}: cannot read schema fixtures: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return violations
}

if (process.argv[1] && import.meta.filename === resolve(process.argv[1])) {
  const violations = collectPlatformStandardsViolations(ROOT)
  if (violations.length > 0) {
    process.stderr.write('verify-platform-standards: violations found:\n')
    for (const violation of violations) process.stderr.write(`  ${violation}\n`)
    process.exit(1)
  }
  process.stdout.write(
    `verify-platform-standards: ${String(MANIFESTS.length)} schemas and ${String(STANDARD_DOCUMENTS.length)} bilingual standards conform.\n`,
  )
}

# Example Policies

Readiness policies customize which criteria are evaluated and how they're scored.

## Usage

Pass a policy file with `--policy` using a relative `./` path:

```sh
primer readiness --policy ./examples/policies/ai-only.json
primer readiness --policy ./examples/policies/strict.json
```

Multiple policies can be chained (comma-separated):

```sh
primer readiness --policy ./examples/policies/ai-only.json,./my-overrides.json
```

## Included Policies

| File                    | Purpose                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `ai-only.json`          | Disables all repo-health criteria, focusing only on AI tooling readiness             |
| `repo-health-only.json` | Disables all AI-tooling criteria and the `agents-doc` extra, focusing on repo health |
| `strict.json`           | Sets 100% pass-rate threshold and elevates several criteria to high impact           |

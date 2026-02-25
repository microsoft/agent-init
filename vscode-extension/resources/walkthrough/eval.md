## Measure the Impact

How much do your instructions actually help? AgentRC's **eval framework** answers that question by comparing AI responses with and without your custom instructions.

### How it works

1. **Scaffold** — AgentRC analyzes your codebase and generates test cases (`agentrc.eval.json`) with questions an AI might answer about your code
2. **Run** — Each test case gets two AI responses: one with instructions, one without
3. **Judge** — A judge model scores which response better follows your codebase conventions
4. **Review** — An interactive HTML viewer shows the comparisons side-by-side with scores

### Get started

If you don't have a `agentrc.eval.json` yet, use **Scaffold Eval Config** to auto-generate test cases from your codebase analysis.

Then run the eval — results open in an interactive viewer right inside VS Code.

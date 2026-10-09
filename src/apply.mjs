import { resolvePair } from "./registry.mjs";
import { buildApplyPrompt } from "./prompt.mjs";

export async function applyCombo(_root, comboId) {
  return applyPair(_root, { comboId });
}

export async function applyPair(_root, spec) {
  const pair = resolvePair(spec);
  const prompt = buildApplyPrompt(pair);
  return { ok: true, combo: pair, prompt };
}

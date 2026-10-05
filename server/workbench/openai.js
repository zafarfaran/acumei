// Provider adapter: OpenAI Chat Completions over fetch. The agent only sees
// chat({ messages, tools }) → { content, toolCalls }, so swapping providers
// means writing another adapter like this one.
export function createOpenAI({ apiKey, model = 'gpt-4.1-mini', fetchImpl = fetch, maxTokens = 700, timeoutMs = 25000 }) {
  return {
    async chat({ messages, tools }) {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), timeoutMs);
      try {
        const res = await fetchImpl('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          signal: ctl.signal,
          headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages,
            tools: tools.map((t) => ({ type: 'function', function: t })),
            max_completion_tokens: maxTokens,
          }),
        });
        if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
        const msg = (await res.json()).choices?.[0]?.message || {};
        return {
          content: msg.content || null,
          toolCalls: (msg.tool_calls || []).map((c) => {
            let args = {};
            try { args = JSON.parse(c.function?.arguments || '{}'); } catch { /* malformed arguments: treat as empty */ }
            return { id: c.id, name: c.function?.name, args };
          }),
        };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

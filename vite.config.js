import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In `vite dev`, serve the Workbench's Vercel function from the same origin so
// live mode can be tried locally. Reads OPENAI_*, UPSTASH_* and WORKBENCH_* from
// .env files; set WORKBENCH_FAKE_PROVIDER=1 to run without an API key.
function workbenchApi(env) {
  return {
    name: 'workbench-api',
    apply: 'serve',
    configureServer(server) {
      for (const [k, v] of Object.entries(env)) if (/^(OPENAI_|UPSTASH_|WORKBENCH_)/.test(k)) process.env[k] = v
      server.middlewares.use('/api/workbench/run', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const mod = await server.ssrLoadModule('/api/workbench/run.js')
          const request = new Request('http://localhost/api/workbench/run', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-forwarded-for': req.socket.remoteAddress || 'local' },
            body: Buffer.concat(chunks),
          })
          const resp = await mod.POST(request)
          res.statusCode = resp.status
          resp.headers.forEach((v, k) => res.setHeader(k, v))
          const reader = resp.body.getReader()
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            res.write(value)
          }
          res.end()
        } catch (e) {
          server.config.logger.error(String(e?.stack || e))
          res.statusCode = 500
          res.end(JSON.stringify({ kind: 'error', summary: 'Dev API error' }) + '\n')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), workbenchApi(loadEnv(mode, process.cwd(), ''))],
}))

import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

const MAX_BYTES = 2_000_000

function sendJson(res: ServerResponse, status: number, body: unknown) {
  if (res.writableEnded) return
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer | string) => {
      const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
      size += buf.length
      if (size > MAX_BYTES) {
        reject(new Error('too-large'))
        req.destroy()
        return
      }
      chunks.push(buf)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function attach(server: ViteDevServer | PreviewServer) {
  const file = path.join(server.config.root, 'data', 'workspace.json')

  server.middlewares.use((req, res, next) => {
    const url = req.url?.split('?')[0] ?? ''
    if (url !== '/api/workspace') {
      next()
      return
    }

    void handle(req, res, file).catch((error: unknown) => {
      const invalid = error instanceof SyntaxError
      const missing = error instanceof Error && 'code' in error && error.code === 'ENOENT'
      const status = invalid ? 400 : missing ? 404 : 500
      const message = invalid
        ? 'JSON no válido'
        : req.method === 'GET'
          ? 'No se pudo leer el archivo'
          : 'No se pudo escribir el archivo'
      sendJson(res, status, { error: message })
    })
  })
}

async function handle(req: IncomingMessage, res: ServerResponse, file: string) {
  if (req.method === 'GET') {
    const data = fs.readFileSync(file, 'utf8')
    if (res.writableEnded) return
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.end(data)
    return
  }

  if (req.method === 'PUT') {
    const raw = await readBody(req)
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      sendJson(res, 400, { error: 'Se esperaba un objeto JSON' })
      return
    }
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const pretty = `${JSON.stringify(parsed, null, 2)}\n`
    const tmp = `${file}.tmp`
    fs.writeFileSync(tmp, pretty)
    fs.renameSync(tmp, file)
    sendJson(res, 200, { ok: true })
    return
  }

  if (!res.writableEnded) {
    res.statusCode = 405
    res.setHeader('Allow', 'GET, PUT')
    res.end()
  }
}

export function workspacePlugin(): Plugin {
  return {
    name: 'workspace-api',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

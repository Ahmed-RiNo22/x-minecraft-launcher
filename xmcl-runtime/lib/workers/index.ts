import { checksum } from '@xmcl/core'
import { createHash } from 'crypto'
import { FileExtension, stream } from 'file-type'
import { createReadStream } from 'fs'
import { MessagePort, parentPort } from 'worker_threads'
import { parseResource } from '../entities/resource'
import { ResolveResourceWorkPayload, WorkerInterface, WorkPayload } from '../entities/worker'
import { copyPassively, fileType, pipeline } from '../util/fs'

if (parentPort !== null) {
  main(parentPort)
}
let semaphore = 0

function main(port: MessagePort) {
  port.on('message', (message: WorkPayload) => {
    const id = message.id
    const handler = (handlers as any as Record<string, (...message: any[]) => Promise<any>>)[message.type]
    if (handler) {
      semaphore += 1
      handler(...message.args).then((result) => {
        port.postMessage({ result, id })
      }, (error) => {
        port.postMessage({ error, id })
      }).finally(() => {
        semaphore -= 1
        if (semaphore <= 0) {
          port.postMessage('idle')
        }
      })
    }
  })
}

const handlers: WorkerInterface = {
  fileType: (path) => fileType(path),
  checksum: (path, algorithm) => checksum(path, algorithm),
  checksumAndFileType: (path, algorithm) => checksumAndFileType(path, algorithm),
  parseResource: (m: ResolveResourceWorkPayload) => parseResource(m.path, m.context, m.hint),
  async copyPassively(files): Promise<void> {
    await Promise.all(files.map(({ src, dest }) => copyPassively(src, dest)))
  },
}

async function checksumAndFileType(path: string, algorithm: string): Promise<[string, FileExtension | 'unknown']> {
  const readStream = await stream(createReadStream(path))
  const hashStream = createHash(algorithm).setEncoding('hex')
  await pipeline(readStream, hashStream)
  const fileType = readStream.fileType?.ext ?? 'unknown'
  const hash = hashStream.digest('hex')
  return [hash, fileType]
}

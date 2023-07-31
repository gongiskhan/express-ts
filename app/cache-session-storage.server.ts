import { createSessionStorage } from '@remix-run/node'
import type { SessionIdStorageStrategy, SessionData } from '@remix-run/node'

type Cookie = SessionIdStorageStrategy['cookie']

interface ICacheService {
  set(key: string, value: any, ttlSeconds: number | null): Promise<void>
  get(key: string): Promise<any>
  del(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}

const expiresToSeconds = (expires?: Date): number | null => {
  if (!expires) {
    return null
  }
  const [now, expiresDate] = [new Date(), new Date(expires)]
  const secondsDelta = (expiresDate.getTime() - now.getTime()) / 1000
  return secondsDelta < 0 ? 0 : Math.ceil(secondsDelta)
}
type createCacheSessionStorageArgs = {
  cookie: Cookie
  cacheService: ICacheService
  sessionIdKey: string
  defaultTTL: number
}

export default function createCacheSessionStorage({
  cookie,
  cacheService,
  sessionIdKey,
  defaultTTL
}: createCacheSessionStorageArgs) {
  const getIdFromData = (data: SessionData) => {
    if (!data[sessionIdKey]) {
      throw new Error(`you have to provide ${sessionIdKey} key to create session`)
    }

    return String(data[sessionIdKey])
  }

  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const id = getIdFromData(data)
      const isExist = await cacheService.exists(id)
      if (!isExist) {
        // create data actually
        await cacheService.set(id, data, expiresToSeconds(expires) || defaultTTL)
      }
      return id
    },
    async readData(id) {
      return cacheService.get(id)
    },
    async updateData(id, data, expires) {
      return cacheService.set(id, data, expiresToSeconds(expires) || defaultTTL)
    },
    async deleteData(id) {
      return cacheService.del(id)
    }
  })
}

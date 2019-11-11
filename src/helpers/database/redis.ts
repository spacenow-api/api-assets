import Redis from 'ioredis'

let redis: any = null;

function initInstance() {
  if (!redis) {
    console.info('Initializing Redis connection.')
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: 6379
    })
  }
}

function getInstance() {
  if (!redis) {
    initInstance()
  }
  return redis
}

export { initInstance, getInstance }

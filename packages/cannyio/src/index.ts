import { Router } from 'itty-router'
import post from './middlewares/post'
import checkUUID from './middlewares/checkUUID'
import handleErrors from './utils/handleErrors'

export type Params = {
  params: { uuid?: string }
}

// POST /:uuid
export type BodyRequest = {
  source?: string
  target: string
  text: string[]
}

export type Env = {
  ENVIRONMENT: 'development' | 'production'
  UUID: string
  TOKEN: string
  SENTRY_DSN: string
}

const router = Router({ base: '/canny.io' })

router.post('/:uuid', checkUUID, post)
router.all('*', () => new Response(null, { status: 404 }))

export default {
  fetch: (request: Request & Params, env: Env, context: ExecutionContext) =>
    router
      .handle(request, env, context)
      .catch((err: unknown) =>
        handleErrors('workers - fetch', err, { request, env, context })
      )
}

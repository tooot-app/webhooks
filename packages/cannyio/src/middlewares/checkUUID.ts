import { Env, Params } from '..'

const checkUUID = async (
  request: Request & Params,
  env: Env
): Promise<Response | void> => {
  if (!request.params.uuid) {
    return new Response(null, { status: 403 })
  }

  if (request.params.uuid !== env.UUID) {
    return new Response(null, { status: 403 })
  }
}

export default checkUUID

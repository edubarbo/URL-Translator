
import { ENABLED_GLOBALLY } from '../constants'

export async function parseAndValidate(_ctx: any) {  
  const ctx: Context = _ctx
  if (!ENABLED_GLOBALLY) {
    ctx.body = 'Service not enabled.'
    ctx.status = 200
    return
  }
  const {
    body,
    clients:{
      events
    }
  } = ctx
  ctx.status = 200
  console.log(ctx.body)
  events.sendEvent(
    'desafioonboarding31.url-translater-auto', 
    'update.url',
    body
  )
  return 
}

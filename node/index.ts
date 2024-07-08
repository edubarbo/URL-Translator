import type { ClientsConfig, ParamsContext } from '@vtex/api'
import { Service } from '@vtex/api'
import { method } from '@vtex/api'

import { Clients } from './clients'
import { parseAndValidate } from './middlewares/parse'
import { updateURL } from './middlewares/updateURL'


const TREE_SECONDS_MS = 4 * 1000
const CONCURRENCY = 10

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    events: {
      exponentialTimeoutCoefficient: 2,
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 50,
      retries: 3,
      timeout: TREE_SECONDS_MS,
      concurrency: CONCURRENCY,
    },
  },
}

export default new Service<Clients, State, ParamsContext>({
  clients,
  events:{
    update: updateURL,
    
    broadcasterNotification: parseAndValidate
  },
  routes: {endpointNotification: method({
    POST: parseAndValidate,
  }),},
})

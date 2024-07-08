import { IOClients } from '@vtex/api'

import Catalog from './search'
import { Messages } from './messages'
import Rewriter from './rewriter'
import Tenant from './tenant'

export class Clients extends IOClients {
  public get search() {
    return this.getOrSet('search', Catalog)
  }
  
  public get messages() {
    return this.getOrSet('messages', Messages)
  }

  public get rewriter() {
    return this.getOrSet('rewriter', Rewriter)
  }

  public get bindings() {
    return this.getOrSet('tenant', Tenant)
  }
}

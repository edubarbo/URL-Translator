import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class Tenant extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.myvtex.com`, context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie:
          context.adminUserAuthToken ?? context.authToken ?? '',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async getBindings() {
    const requestBody = {
      query: `
       {
  tenantInfo {
    bindings {
      id
      defaultLocale
      supportedLocales
    }
  }
}`,
      variables: {},
    };

    return this.http.post<any>(`/_v/private/graphql/v1`, requestBody);
  }
}

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class Rewriter extends ExternalClient {
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

  public async postURL(productId: string, from: string, resolveAs: string, binding: string) {
    const requestBody = {
      query: `
        mutation saveInternal($productId: String!, $from: String!, $resolveAs: String!, $binding: String!) {
          internal {
            save(route: {
              from: $from, 
              id: $productId, 
              resolveAs: $resolveAs, 
              binding: $binding, 
              declarer: "vtex.store@2.x", 
              type: "product"
            }) @context(provider: "vtex.rewriter") {
              from
            }
          }
        }`,
      variables: {
        productId,
        from,
        resolveAs,
        binding,
      },
    };

    return this.http.post<any>(`/_v/private/graphql/v1`, requestBody);
  }

  public async getURL(path: string) {
    const requestBody = {
      query: `
        query path($path: String!) {
  internal {
    get(path: $path) {
      query
      from
      declarer
      type
    }
  }
}
`,
      variables: {
        path
      },
    };

    return this.http.post<any>(`/_v/private/graphql/v1`, requestBody);
  }
}

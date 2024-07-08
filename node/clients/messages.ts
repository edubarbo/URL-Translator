import type { InstanceOptions, IOContext } from '@vtex/api'
import { GraphQLServer } from './graphqlServer'

const extension = {
  persistedQuery: {
    provider: 'vtex.catalog-graphql@1.x'
  },
}

const extension1 = {
  persistedQuery: {
    provider: 'vtex.rewriter@1.x'
  },
}
export class Messages extends GraphQLServer {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super(ctx, opts)
  }

  public getProductLinkId = (id: string, locale: string , account: string) => {
    const variables = {
      identifier: {
        field: 'id',
        value: id,
      },
    }

    return this.query<any, any>(
      `query GetProduct($identifier: ProductUniqueIdentifier){
          product(identifier:$identifier){
            name
            linkId
          }
      }`,
      variables,
      extension,
      {
        metric: 'get-product',
        params: { locale },
        headers: {
          'X-Vtex-Locale': locale,
          'X-Vtex-Tenant': account,
        },
      }
    )
  }

  public getSKUName = (id: string, locale: string = 'ca-ES', account: string) => {
    const variables = {
      sku: id,
    }
    const language = locale

    return this.query<any, typeof variables>(
      `query GetSKUName($sku: ID!){
        sku(identifier:{
          field: id,
          value: $sku
        }){
          name
        }}`,
      variables,
      extension1,
      {
        headers: {
          'X-Vtex-Locale': language,
          'X-Vtex-Tenant': account,
        },
        forceMaxAge: 5,
        params: {
          locale: language
        },
        tracing: {
          requestSpanNameSuffix: 'catalog-sku',
        },
      }
    )
  }

  public saveProductURL = (productId: string, from: string, resolveAs: string, binding: string, account: string ) => {
    const variables = {
      productId,
      from,
      resolveAs,
      binding
    }
    const language = 'pt-BR'

    return this.query<any, typeof variables>(
      `mutation saveInternal(
          $productId: String!,
          $from: String!,
          $resolveAs: String!,
          $binding: String!
        ){
  internal {
    save(route: {from:$from, id:$productId, resolveAs:$resolveAs,binding: $binding, declarer: "vtex.store@2.x", type: "product"   }){
       from
      
    }
  }
}`,
      variables,
      extension1,
      {
        headers: {
          'x-vtex-locale': language,
          'X-Vtex-Tenant': account,
        },
        params: {
          locale: language
        },
        forceMaxAge: 5,
        tracing: {
          requestSpanNameSuffix: 'catalog-sku',
        },
      }
    )
  }
}

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class Catalog extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.myvtex.com/api`, context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie:
          context.adminUserAuthToken ?? context.authToken ?? '',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async getProductId(skuId: string) {
    return this.http.get(
      `/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`,
      {
        metric: 'get-productid-bysku-id',
      }
    )
  }

  public async getProduct(productId: string) {
    return this.http.get(
      `/catalog_system/pvt/products/ProductGet/${productId}`,
      {
        metric: 'get-product-by-id',
      }
    )
  }


}
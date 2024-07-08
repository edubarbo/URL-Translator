import {
  AppClient,
  GraphQLClient,
  InstanceOptions,
  IOContext,
  RequestConfig,
  Serializable,
} from '@vtex/api'

/**
 * Used to perform requests to VTEX's GraphQL using the `vtex.graphql-server` app as middleware.
 */
export class GraphQLServer extends AppClient {
  protected graphql: GraphQLClient

  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.graphql-server@1.x', ctx, opts)
    this.graphql = new GraphQLClient(this.http)
  }

  public query = async <TResponse extends Serializable, TArgs extends object>(
    query: string,
    variables: TArgs,
    extensions: any,
    config: RequestConfig
  ) => {
    return this.graphql.query<TResponse, TArgs>(
      {
        extensions,
        query,
        variables,
      },
      {
        ...config,
        params: {
          ...config.params,
        },
        url: '/graphql',
      }
    )
  }
}

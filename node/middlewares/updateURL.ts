import { slugify } from "../utils/slugify";

export async function updateURL(_ctx: any) {
  const ctx: Context = _ctx;

  const {
    body,
    clients: {
      search,
      messages,
      rewriter,
      //bindings
    },
  } = ctx;

  console.log(ctx.body.IdSku);
  //console.log(ctx.vtex.account)

  if (ctx.body.HasStockKeepingUnitModified == true) {
    const maxRetries = 3;
    let attempt = 0;
    let success = false;
    while (attempt < maxRetries && !success) {
      try {
        /* Get Binding and Locale*/
        const appId = process.env.VTEX_APP_ID as string;
        const settings = await ctx.clients.apps.getAppSettings(appId);
        var settingsBinding = settings.bindingId; /* binding */
        console.log(settingsBinding);
        var settingsLocale = settings.locale;
        console.log(settingsLocale);

        /* Get Product Id by SKU Id */
        const skuId = ctx.body.IdSku;
        console.log(`Sku ID é ${skuId}`);
        const productIdData = await search.getProductId(skuId);
        const productId = productIdData?.ProductId ?? "";
        console.log(`O ID do produto é ${productId}`); /* id */

        /* Get Product URL by Locale */
        const productData = await messages.getProductLinkId(
          productId,
          settingsLocale,
          ctx.vtex.account
        );
        const ProductLink = productData?.data?.product?.linkId ?? "";
        const slug = slugify(ProductLink);
        console.log(slug);
        const pdp = `/${slug}/p`; /* from */
        console.log(`A URL do produto no locale é ${pdp}`);

        /* Get  URL in Rewriter */
        const rewriterResponse = await rewriter.getURL(pdp);
        const rewriterValidation =
          rewriterResponse?.data?.internal?.get?.from ?? "";
        console.log(rewriterValidation);

        /* Validate if there's a translated URL and update if there's not */
        if (rewriterValidation != pdp) {
          console.log(`Atualizando: ${pdp} > IdProduto:${productId}`);

          const productInformation = await search.getProduct(productId);
          const linkDefault = `/${productInformation.LinkId}/p`; /* resolveAs */
          console.log(`O link no binding default é ${linkDefault}`);

          const chamada = await rewriter.postURL(
            productId,
            pdp,
            linkDefault,
            settingsBinding
          );
          const newURL = chamada?.data?.internal?.save?.from ?? "";
          console.log(
            `O produto ${productId} foi atualizado, com a URL ${newURL}`
          );
          const {
            vtex: { logger },
          } = ctx;
          logger.error(
            `O produto ${productId} foi atualizado, com a URL ${newURL}`
          );
        } else {
          console.log(`O produto ${productId} tem URL traduzida e atualizada`);
        }

        ctx.state.payload = body;
        ctx.status = 200;
        ctx.body = "Done.";
      } catch (e) {
        attempt++;

        console.error(
          `Falha na traducao na tentativa ${attempt}: ${e}`
        );

        if (attempt >= maxRetries) {
          const {
            vtex: { logger },
          } = ctx;

          logger.error(
            `Falha na traducao do SKU ${ctx.body.IdSku} depois de ${maxRetries} tentativas`
          );

          ctx.status = 400;

          ctx.body = "Fail.";
        }
      }
    }
  } else {
    console.log(`Sem atualizacao`);
  }
}

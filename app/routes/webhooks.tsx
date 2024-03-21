import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { topic, shop, session, admin, webhookId, payload } = await authenticate.webhook(request);
  console.log(`Start request ${new Date().toISOString()}`,)
  // const {topic, shop, session, admin}  = await authenticate.webhook(request);
  // console.log({ topic, shop, session, admin })
  let topic, shop, session, admin, webhookId, payload;
  try {
    const data = await authenticate.webhook(request);
    topic = data.topic;
    shop = data.shop;
    session = data.session;
    admin = data.admin;
    webhookId = data.webhookId;
    payload = data.payload;
    console.log({topic, shop, session, admin, webhookId, payload})
  } catch (error) {
    console.log({ error })
  }
  console.log(`-------------End request--------------`,)
  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "PRODUCTS_CREATE":
      console.log('handle create product');
      break;
    case "ORDERS_CREATE":
      console.log('handle create order');
      break;
    case "ORDERS_UPDATED":
      console.log('handle update order');
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};

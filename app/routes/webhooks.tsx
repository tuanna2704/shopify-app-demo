import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { createOrUpdate } from "~/models/orders";
export const action = async ({ request }: ActionFunctionArgs) => {
  // const { topic, shop, session, admin, webhookId, payload } = await authenticate.webhook(request);
  console.log(`Start request ${new Date().toISOString()}`);
  const {topic, shop, session, admin, webhookId, payload}  = await authenticate.webhook(request);

  // let topic, shop, session, admin, webhookId, payload;
  // try {
  //   const data = await authenticate.webhook(request);
  //   topic = data.topic;
  //   shop = data.shop;
  //   session = data.session;
  //   admin = data.admin;
  //   webhookId = data.webhookId;
  //   payload = data.payload;
  //   console.log({ topic, shop, session, admin, webhookId, payload });
  // } catch (error) {
  //   console.log({ error });
  // }
  // console.log(`-------------End request--------------`);
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
      console.log("handle create product");
      break;
    case "ORDERS_CREATE":
      console.log("handle create order");
      if (session) {
        const {
          id: orderId,
          order_number: orderNumber,
          total_price: totalPrice,
          payment_gateway_names: paymentGateway,
          tags,
          customer: { email, first_name, last_name, default_address: { address1, city, country } }
        } = payload as any;
        const response = await createOrUpdate({
          orderId: orderId.toString(),
          orderNumber,
          totalPrice,
          paymentGateway: paymentGateway.join(","),
          tags,
          customerAddress: `${address1}, ${city}, ${country}`,
          customerEmail: email,
          customerFullName: `${first_name} ${last_name}`,
        });
        console.log(response);
      }
      console.log("-------------handle create order end----------------");
      break;
    case "ORDERS_UPDATED":
      console.log("handle update order");
      if (session) {
        const {
          id: orderId,
          order_number: orderNumber,
          total_price: totalPrice,
          payment_gateway_names: paymentGateway,
          tags,
          customer: { email, first_name, last_name, default_address: { address1, city, country } }
        } = payload as any;
        const response = await createOrUpdate({
          orderId: orderId.toString(),
          orderNumber,
          totalPrice,
          paymentGateway: paymentGateway.join(","),
          tags,
          customerAddress: `${address1}, ${city}, ${country}`,
          customerEmail: email,
          customerFullName: `${first_name} ${last_name}`,
        });
        console.log(response);
      }
      console.log("-------------handle update order end----------------");
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};

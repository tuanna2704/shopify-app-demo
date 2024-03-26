import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }: { request: any, params: any }) {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(`
    {
      order(id: "gid://shopify/Order/${params.id}") {
        id
        tags
        customer {
          id
          displayName
          email
        }
      }
    }`);

  const {
    data: { order }
  } = await response.json();

  return json(order);
}

export default function Index() {
  const data = useLoaderData();
  console.log(data);
  return (
    <>page order detail</>
  );
}

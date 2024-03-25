import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }: { request: any, params: any }) {
  const { admin, session } = await authenticate.admin(request);
  console.log(params);
  return json({
    tuanna: 'tuanna',
  }); 
}

export default function Index() {
  const data = useLoaderData();
  console.log(data);
  return (
    <>page order detail</>
  );
}

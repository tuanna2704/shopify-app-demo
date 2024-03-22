import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { Card, EmptyState, Layout, Page, IndexTable } from "@shopify/polaris";
import { Order } from "@prisma/client";
import { getOrders } from "../models/orders";

export async function loader({ request }: { request: any }) {
  const { admin, session } = await authenticate.admin(request);
  const orders = await getOrders();

  return json({
    orders
  });
}

const EmptyQRCodeState = () => (
  <EmptyState image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
    <p>Allow customers to scan codes and buy products using their phones.</p>
  </EmptyState>
);

const OrderTable = ({ orders }: { orders: Order[] }) => (
  <IndexTable
    itemCount={orders.length}
    headings={[
      { title: "Order Id"},
      { title: "Order Number" },
      { title: "Total Price" },
      { title: "Date created" },
      { title: "Tags" },
    ]}
    selectable={false}
  >
    {orders.map((order: Order) => (
      <OrderTableRow order={order} />
    ))}
  </IndexTable>
);

const OrderTableRow = ({ order }: { order: Order }) => {
  const orderUrl = `https://admin.shopify.com/store/tuanna2704-store1/orders/${order.orderId}`
  return (
    <IndexTable.Row id={order.id.toString()} position={order.id} key={order.id}>
      <IndexTable.Cell><Link to={`${orderUrl}`} target="_blank">{order.orderId}</Link></IndexTable.Cell>
      <IndexTable.Cell>{order.orderNumber}</IndexTable.Cell>
      <IndexTable.Cell>{order.totalPrice}</IndexTable.Cell>
      <IndexTable.Cell>
        {new Date(order.createdAt).toDateString()}
      </IndexTable.Cell>
      <IndexTable.Cell>{order.tags}</IndexTable.Cell>
    </IndexTable.Row>
  );
};

export default function Index() {
  const { orders }: { orders: any[]} = useLoaderData();
  return (
    <Page>
      <ui-title-bar title="QR codes">
        <button variant="primary" onClick={() => console.log('export order to csv')}>
          Export To CSV
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {orders.length === 0 ? (
              <EmptyQRCodeState />
            ) : (
              <OrderTable orders={orders} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

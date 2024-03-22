import { Prisma } from '@prisma/client';

export const createOrUpdate = async (orderData: Prisma.OrderWhereInput) => {
  const { orderId, ...data } = orderData;
  try {
    const existingUser = await prisma.order.findFirst({
      where: { orderId },
    })

    if (existingUser) {
      // If user exists, update the email
      return await prisma.order.update({ where: { orderId: orderId as string }, data: data as Prisma.OrderUpdateInput })
    } else {
      // If user doesn't exist, create a new user
      return await prisma.order.create({ data: orderData as Prisma.OrderCreateInput })
    }
  } catch (error) {
    console.error(error)
  }
}

export async function getOrders() {
  const orders = await prisma.order.findMany({
    where: {},
    orderBy: { id: "desc" },
  });

  return orders;
}

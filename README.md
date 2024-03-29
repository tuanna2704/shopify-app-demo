# Shopify App Template - Remix

## Database design
Table Session
| Field            | Type       | Description                |
|------------------|------------|----------------------------|
| id               | String     | Unique identifier          |
| shop             | String     | Name of the shop           |
| state            | String     | State of the session       |
| isOnline         | Boolean    | Indicates if session is online or not (default: false) |
| scope            | String     | Scope of the session       |
| expires          | DateTime   | Expiry date of the session |
| accessToken      | String     | Access token for the session |
| userId           | BigInt     | User ID associated with the session (nullable) |

Table Orders
| Field            | Type       | Description                |
|------------------|------------|----------------------------|
| id               | Int        | Unique identifier (auto-incremented) |
| orderId          | String     | Unique identifier of the order |
| orderNumber      | Int        | Order number               |
| totalPrice       | String     | Total price of the order (nullable) |
| paymentGateway   | String     | Payment gateway used for the order |
| customerEmail    | String     | Email of the customer (nullable) |
| customerFullName | String     | Full name of the customer (nullable) |
| customerAddress  | String     | Address of the customer (nullable) |
| tags             | String     | Tags associated with the order (nullable) |
| createdAt        | DateTime   | Creation timestamp of the order (default: current timestamp) |


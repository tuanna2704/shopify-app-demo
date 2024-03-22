-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "totalPrice" TEXT,
    "paymentGateway" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerFullName" TEXT,
    "customerAddress" TEXT,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Order" ("createdAt", "customerAddress", "customerEmail", "customerFullName", "id", "orderId", "orderNumber", "paymentGateway", "tags", "totalPrice") SELECT "createdAt", "customerAddress", "customerEmail", "customerFullName", "id", "orderId", "orderNumber", "paymentGateway", "tags", "totalPrice" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

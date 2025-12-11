# lemur

| Test                              | Steps                                                                 | Expected Result                                               |
|-----------------------------------|-----------------------------------------------------------------------|---------------------------------------------------------------|
| 1. Verify Products                | Use AWS Console or CLI to scan the `products` table ✅                  | Should see 19 products with all lemur types                   |
| 2. Verify Orders                  | Use AWS Console or CLI to scan the `orders` table  ✅                   | Should see 10 orders with various statuses                    |
| 3. Test Checkout Lambda           | POST to `/checkout` with items array containing productIds            | Should create new order and return orderId, total, eta        |
| 4. Test Ask-Order Lambda          | POST to `/ask-order` with orderId from test #3 and a question         | Should return answer from Bedrock about the order             |
| 5. Test Ask-Order with Invalid ID | POST to `/ask-order` with non-existent orderId                        | Should handle gracefully and return "Order not found" context |
| 6. Verify Order Totals            | Check that order totals match sum of (price × quantity) for each item | All totals should be correctly calculated                     |
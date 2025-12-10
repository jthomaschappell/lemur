import json
import uuid
import boto3
import os
from datetime import datetime, timedelta

dynamodb = boto3.resource("dynamodb")
products_table = dynamodb.Table(os.environ["PRODUCTS_TABLE"])
orders_table = dynamodb.Table(os.environ["ORDERS_TABLE"])

def handler(event, context):
    body = json.loads(event.get("body", "{}"))

    items = body.get("items", [])  # [{productId, quantity}, ...]
    print("Hi Mom!!!")
    print(items)

    total = 0
    for item in items:
        product = products_table.get_item(Key={"productId": item["productId"]})
        price = product["Item"]["price"]
        total += price * item["quantity"]

    order_id = str(uuid.uuid4())
    eta = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")

    orders_table.put_item(Item={
        "orderId": order_id,
        "items": items,
        "total": total,
        "eta": eta,
        "status": "Processing"
    })

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "orderId": order_id,
            "total": float(total),
            "eta": eta
        })
    }



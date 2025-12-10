import json
import boto3
import os

bedrock = boto3.client("bedrock-runtime", region_name="us-west-2")
dynamodb = boto3.resource("dynamodb")
orders_table = dynamodb.Table(os.environ["ORDERS_TABLE"])

def handler(event, context):
    body = json.loads(event.get("body", "{}"))
    question = body.get("question", "")
    order_id = body.get("orderId", "")

    # ===== fetch order from DynamoDB =====
    order = None
    if order_id:
        resp = orders_table.get_item(Key={"orderId": order_id})
        order = resp.get("Item", None)

    order_context = (
        f"Order status: {order.get('orderStatus')}\n"
        f"Total: {order.get('total')}\n"
        f"ETA: {order.get('eta')}\n"
        if order else "Order not found.\n"
    )

    prompt = f"""
    You are a support assistant. 
    User question: {question}
    {order_context}
    Provide a short, friendly answer.
    """

    # ===== CHANGE WAS MADE HERE: invoke Bedrock =====
    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-haiku-20240307-v1:0",
        body=json.dumps({"prompt": prompt, "max_tokens": 250}),
        contentType="application/json",
        accept="application/json"
    )

    model_output = json.loads(response["body"].read())
    answer = model_output.get("completion") or model_output.get("output_text")

    return {
        "statusCode": 200,
        "body": json.dumps({"answer": answer})
    }

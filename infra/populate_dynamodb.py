#!/usr/bin/env python3
"""
Script to populate DynamoDB tables with sample data for testing.
Populates both the products and orders tables.
"""

import boto3
import json
import uuid
from datetime import datetime, timedelta
from decimal import Decimal

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-west-2')
products_table = dynamodb.Table('products')
orders_table = dynamodb.Table('orders')

# Lemur product data
lemurs = [
    {
        "name": "Aye-Aye",
        "description": "A rare nocturnal lemur with distinctive elongated middle fingers, native to Madagascar. Known for its unique foraging behavior using echolocation."
    },
    {
        "name": "Black-and-White Ruffed Lemur",
        "description": "One of the largest lemurs, known for its distinctive black and white fur pattern and loud vocalizations. Native to eastern Madagascar."
    },
    {
        "name": "Black Lemur",
        "description": "A medium-sized lemur with striking black fur and bright orange eyes. Found in the rainforests of northern Madagascar."
    },
    {
        "name": "Blue-Eyed Black Lemur",
        "description": "A critically endangered lemur with stunning blue eyes and black fur. One of the few non-human primates with blue eyes."
    },
    {
        "name": "Common Brown Lemur",
        "description": "A widespread and adaptable lemur species with brown-gray fur. Known for its social behavior and varied diet."
    },
    {
        "name": "Coquerel's Sifaka",
        "description": "A beautiful lemur with white and maroon fur, known for its distinctive sideways hopping locomotion. Native to northwestern Madagascar."
    },
    {
        "name": "Crowned Sifaka",
        "description": "A medium-sized sifaka with a distinctive crown-like pattern on its head. Lives in the dry forests of western Madagascar."
    },
    {
        "name": "Diademed Sifaka",
        "description": "One of the largest sifakas with a beautiful diadem pattern on its head. Found in the eastern rainforests of Madagascar."
    },
    {
        "name": "Eastern Lesser Bamboo Lemur",
        "description": "A small lemur specialized in eating bamboo. Known for its ability to process cyanide found in bamboo shoots."
    },
    {
        "name": "Golden Bamboo Lemur",
        "description": "A critically endangered lemur with golden-orange fur. One of the few mammals that can tolerate high levels of cyanide in its diet."
    },
    {
        "name": "Golden-Crowned Sifaka",
        "description": "A rare sifaka with golden fur on its head and body. One of the most endangered lemur species, found only in a small area of Madagascar."
    },
    {
        "name": "Indri",
        "description": "The largest living lemur, known for its haunting songs that can be heard for miles. Has a distinctive black and white coat."
    },
    {
        "name": "Perrier's Sifaka",
        "description": "A critically endangered sifaka with black fur and white patches. One of the rarest lemurs, found only in a small region of northern Madagascar."
    },
    {
        "name": "Red-Bellied Lemur",
        "description": "A medium-sized lemur with reddish-brown fur and a distinctive red belly. Known for its strong family bonds."
    },
    {
        "name": "Red-Fronted Lemur",
        "description": "A social lemur with reddish-brown fur and a distinctive red patch on its forehead. Found in various forest types across Madagascar."
    },
    {
        "name": "Red-Ruffed Lemur",
        "description": "A large, beautiful lemur with vibrant red-orange fur. Known for its loud calls and fruit-eating habits."
    },
    {
        "name": "Ring-Tailed Lemur",
        "description": "The most recognizable lemur with its distinctive black and white ringed tail. Often seen in zoos and known for sunbathing behavior."
    },
    {
        "name": "Verreaux's Sifaka",
        "description": "A white sifaka with black face and shoulders. Famous for its sideways dancing locomotion when moving on the ground."
    },
    {
        "name": "White-Headed Lemur",
        "description": "A medium-sized lemur with a distinctive white head and dark body. Found in the eastern rainforests of Madagascar."
    }
]

# Product IDs matching the file names
product_ids = [
    "aye-aye",
    "black-and-white-ruffed-lemur",
    "black-lemur",
    "blue-eyed-black-lemur",
    "common-brown-lemur",
    "coquerels-sifaka",
    "crowned-sifaka",
    "diademed-sifaka",
    "eastern-lesser-bamboo-lemur",
    "golden-bamboo-lemur",
    "golden-crowned-sifaka",
    "indri",
    "perriers-sifaka",
    "red-bellied-lemur",
    "red-fronted-lemur",
    "red-ruffed-lemur",
    "ring-tailed-lemur",
    "verreauxs-sifaka",
    "white-headed-lemur"
]

def populate_products():
    """Populate the products table with lemur data."""
    print("Populating products table...")
    
    # Price ranges for variety (in dollars)
    base_prices = [29.99, 34.99, 39.99, 44.99, 49.99, 54.99, 59.99, 64.99, 69.99, 74.99, 79.99, 84.99, 89.99, 94.99, 99.99, 109.99, 119.99, 129.99, 149.99]
    
    for i, product_id in enumerate(product_ids):
        product = {
            "productId": product_id,
            "name": lemurs[i]["name"],
            "price": Decimal(str(base_prices[i])),
            "description": lemurs[i]["description"]
        }
        
        products_table.put_item(Item=product)
        print(f"  ✓ Added product: {product['name']} (${product['price']})")
    
    print(f"\n✓ Successfully populated {len(product_ids)} products\n")

def populate_orders():
    """Populate the orders table with sample order data."""
    print("Populating orders table...")
    
    # Sample orders with various statuses
    sample_orders = [
        {
            "items": [
                {"productId": "ring-tailed-lemur", "quantity": 2},
                {"productId": "indri", "quantity": 1}
            ],
            "status": "Processing",
            "days_offset": 2
        },
        {
            "items": [
                {"productId": "aye-aye", "quantity": 1},
                {"productId": "blue-eyed-black-lemur", "quantity": 1},
                {"productId": "red-ruffed-lemur", "quantity": 1}
            ],
            "status": "Shipped",
            "days_offset": 1
        },
        {
            "items": [
                {"productId": "coquerels-sifaka", "quantity": 3}
            ],
            "status": "Delivered",
            "days_offset": -1
        },
        {
            "items": [
                {"productId": "golden-bamboo-lemur", "quantity": 2},
                {"productId": "verreauxs-sifaka", "quantity": 1},
                {"productId": "diademed-sifaka", "quantity": 1}
            ],
            "status": "Processing",
            "days_offset": 3
        },
        {
            "items": [
                {"productId": "black-and-white-ruffed-lemur", "quantity": 1},
                {"productId": "common-brown-lemur", "quantity": 2}
            ],
            "status": "Shipped",
            "days_offset": 0
        },
        {
            "items": [
                {"productId": "ring-tailed-lemur", "quantity": 1},
                {"productId": "red-fronted-lemur", "quantity": 1},
                {"productId": "white-headed-lemur", "quantity": 1},
                {"productId": "crowned-sifaka", "quantity": 1}
            ],
            "status": "Processing",
            "days_offset": 4
        },
        {
            "items": [
                {"productId": "perriers-sifaka", "quantity": 1}
            ],
            "status": "Delivered",
            "days_offset": -2
        },
        {
            "items": [
                {"productId": "golden-crowned-sifaka", "quantity": 2},
                {"productId": "eastern-lesser-bamboo-lemur", "quantity": 1}
            ],
            "status": "Shipped",
            "days_offset": 1
        },
        {
            "items": [
                {"productId": "black-lemur", "quantity": 1},
                {"productId": "red-bellied-lemur", "quantity": 1}
            ],
            "status": "Processing",
            "days_offset": 2
        },
        {
            "items": [
                {"productId": "indri", "quantity": 2},
                {"productId": "verreauxs-sifaka", "quantity": 1},
                {"productId": "ring-tailed-lemur", "quantity": 1}
            ],
            "status": "Delivered",
            "days_offset": -3
        }
    ]
    
    # Calculate totals for each order
    for order_data in sample_orders:
        total = Decimal('0')
        for item in order_data["items"]:
            product = products_table.get_item(Key={"productId": item["productId"]})
            if "Item" in product:
                price = product["Item"]["price"]
                total += price * item["quantity"]
        
        # Calculate ETA based on days_offset
        eta_date = datetime.now() + timedelta(days=order_data["days_offset"])
        eta = eta_date.strftime("%Y-%m-%d")
        
        order = {
            "orderId": str(uuid.uuid4()),
            "items": order_data["items"],
            "total": total,
            "eta": eta,
            "status": order_data["status"]
        }
        
        orders_table.put_item(Item=order)
        print(f"  ✓ Added order: {order['orderId'][:8]}... - {order['status']} - ${order['total']} - ETA: {order['eta']}")
    
    print(f"\n✓ Successfully populated {len(sample_orders)} orders\n")

def main():
    """Main function to populate both tables."""
    print("=" * 60)
    print("Populating DynamoDB Tables with Sample Data")
    print("=" * 60)
    print()
    
    try:
        populate_products()
        populate_orders()
        
        print("=" * 60)
        print("✓ All tables populated successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())

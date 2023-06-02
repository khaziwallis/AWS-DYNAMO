## Basic Syntax ##
```
aws dynamodb
```

## Read multiple from Table ##

```
aws dynamodb batch-get-item --request-items file://request-items.json --return-consumed-capacity TOTAL
```
    # request-items.json #
    ---------------
    {
        "Servers": {
            "Keys": [
                {
                    "id": {"S": "1"},
                    "price": {"N": "100"}
                },
                {
                    "id": {"S": "2"},
                    "price": {"N": "200"}
                }
            ],
            "ProjectionExpression": "id,price,age"
        }
    }

## Insert multiple into Table ##

```
aws dynamodb batch-write-item --request-items file://insert-items.json --return-consumed-capacity TOTAL
```
    # insert-items.json #
    ----------------
    {
        "Serv`ers": [
            {
                "PutRequest": {
                    "Item": {
                        "id": {"S": "5"},
                        "price": {"N": "500"},
                        "age": {"S": "50"}
                    }
                }
            },
            {
                "PutRequest": {
                    "Item": {
                        "id": {"S": "6"},
                        "price": {"N": "600"},
                        "age": {"S": "60"}
                    }
                }
            },
            {
                "PutRequest": {
                    "Item": {
                        "id": {"S": "7"},
                        "price": {"N": "700"},
                        "age": {"S": "70"},
                        "name": {"S": "Server 70"}
                    }
                }
            }
        ]
    }

## Basic Syntax ##
```
aws dynamodb
```

## List Dynamodb Tables ##

```
list-tables
```

## Create Table ##

```
create-table --table-name Servers --attribute-definitions AttributeName=id,AttributeType=S AttributeName=price,AttributeType=N --key-schema AttributeName=id,KeyType=HASH AttributeName=price,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
```

## Insert into Tables ##

```
put-item --table-name Servers --item file://item.json --return-item-collection-metrics SIZE
```
    # item.json #
    ---------------
    {
        "id": {"S": "4"},
        "price": {"N": "400"},
        "age": {"N": "40"}
    }

## Read from Table ##

```
get-item --table-name Servers --key file://key.json --return-consumed-capacity TOTAL
```
    # key.json #
    ---------------
    {
        "id": {"S": "4"},
        "price": {"N": "400"}
    }

## Update Row from Table ##
Note: updating the key attributes not allowed

```
update-item --table-name Servers --key file://key.json --update-expression "SET #AT = :t"  --expression-attribute-names file://expression-attribute-names.json --expression-attribute-values file://expression-attribute-values.json  --return-values ALL_NEW --return-consumed-capacity TOTAL --return-item-collection-metrics SIZE
```
    # key.json #
    ----------------
    {
        "id": {"S": "1"},
        "price": {"N": "100"}
    }

    # expression-attribute-names.json #
    ---------------
    {
        "#AT":"age"
    }

    # expression-attribute-values.json #
    ---------------
    {
        ":t":{"S": "1000"}
    }

## Delete Row from Table ##
```
delete-item --table-name Servers --key file://key.json --return-values ALL_OLD
```
    # key.json #
    ----------------
    {
        "id": {"S": "1"},
        "price": {"N": "100"}
    }

## Drop Table ##
```
delete-table --table-name Servers
```


## Batch Operations ##
https://github.com/khaziwallis/AWS-DYNAMO/blob/master/cli/batch.md

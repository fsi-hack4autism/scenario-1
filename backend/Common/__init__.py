import os

import azure.cosmos.cosmos_client as cosmos_client

def db_connect_container(container_id: str):
    HOST = os.environ['HOST']
    MASTER_KEY = os.environ['MASTER_KEY']
    DATABASE_ID = os.environ['DATABASE_ID']

    client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY})

    database = client.get_database_client(DATABASE_ID)

    container = database.get_container_client(container_id)

    return container

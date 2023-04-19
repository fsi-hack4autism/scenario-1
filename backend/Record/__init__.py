import os
import logging

import azure.functions as func
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.database as database
import azure.cosmos.exceptions as exceptions

# import config

HOST = os.environ['HOST']
MASTER_KEY = os.environ['MASTER_KEY']
DATABASE_ID = os.environ['DATABASE_ID']
CONTAINER_ID = "ButtonSemantics"
       

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        logging.info('Python HTTP trigger function processed a request.')

        client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY})
        database = client.get_database_client(DATABASE_ID)
        container = database.get_container_client(CONTAINER_ID)

        patientId = req.route_params.get('patientId')
        objectiveId = req.route_params.get('objectiveId')

        # TODO: HANDLE POST

        query = "SELECT c.name FROM c"
        items = list(container.query_items(
                query=query,
                enable_cross_partition_query=True
            ))
        
        return func.HttpResponse(f"{items}")
    
    except RuntimeError:
        return RuntimeError

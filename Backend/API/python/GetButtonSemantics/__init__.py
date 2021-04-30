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

        query = "SELECT c.name FROM c"
        items = list(container.query_items(
                query=query,
                enable_cross_partition_query=True
            ))
        
        return func.HttpResponse(f"{items}")

    #     name = req.params.get('name')
    #     if not name:
    #         try:
    #             req_body = req.get_json()
    #         except ValueError:
    #             pass
    #         else:
    #             name = req_body.get('name')

    #     if name:
    #         return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    #     else:
    #         return func.HttpResponse(
    #             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
    #             status_code=200
    #         )
    except RuntimeError:
        return RuntimeError

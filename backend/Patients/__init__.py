import os
import logging
import json
import uuid

import azure.functions as func
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.database as database
import azure.cosmos.exceptions as exceptions

HOST = os.environ['HOST']
MASTER_KEY = os.environ['MASTER_KEY']
DATABASE_ID = os.environ['DATABASE_ID']
CONTAINER_ID = "Patients"

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        logging.info(f'Received {req.method} request to /patients')

        client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY})
        database = client.get_database_client(DATABASE_ID)
        container = database.get_container_client(CONTAINER_ID)


        if req.method == "GET":
            query = "SELECT p.id, p.firstName, p.surname FROM p"

            items = list(container.query_items(
                query=query,
                enable_cross_partition_query=True
            ))

            response = {
                "patients": items
            }

            return func.HttpResponse(json.dumps(response), mimetype="application/json; charset=utf-8")

        elif req.method == "POST":
            patient = req.get_json()
            patient["id"] = str(uuid.uuid4())

            container.create_item(patient)

            return func.HttpResponse(json.dumps(patient), mimetype="application/json; charset=utf-8", status_code=201)
        
        else:
            return func.HttpResponse("{}", status_code=400)

    except RuntimeError:
        return RuntimeError

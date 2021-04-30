# post session (session name, therapist, patient, device, map: button -> attribute

import logging
import os
import uuid
import azure.functions as func

import azure.functions as func
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.database as database
import azure.cosmos.exceptions as exceptions



HOST = os.environ['HOST']
MASTER_KEY = os.environ['MASTER_KEY']
DATABASE_ID = os.environ['DATABASE_ID']
CONTAINER_ID = "ButtonDeviceSessions"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    current_id = str(uuid.uuid1())

    client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY})
    database = client.get_database_client(DATABASE_ID)
    container = database.get_container_client(CONTAINER_ID)

    req_body = req.get_json()

    patient_id = req_body.get("patient_id")
    therapist_id = req_body.get("therapist_id")
    device_id = req_body.get("device_id")
    button_mappings = req_body.get("button_mappings")

    session_item = {"id":current_id,"patient_id": patient_id, "therapist_id": therapist_id, "device_id":device_id, "button_mappings" : button_mappings}
    result = container.create_item(body=session_item)
    
    return func.HttpResponse(
            f"Function executed successfully",
            status_code=200
    )

    # name = req.params.get('name')
    # if not name:
    #     try:
    #         req_body = req.get_json()
    #     except ValueError:
    #         pass
    #     else:
    #         name = req_body.get('name')

    # if name:
    #     return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    # else:
    #     return func.HttpResponse(
    #          "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
    #          status_code=200
    #     )

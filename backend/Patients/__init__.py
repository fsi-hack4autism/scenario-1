import logging
import json
import uuid

from Common import db_connect_container

import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info(f'Received {req.method} request to /patients')

    container = db_connect_container('Patients')

    if req.method == 'GET':
        query = 'SELECT p.id, p.firstName, p.surname FROM p'

        items = list(container.query_items(
            query=query,
            enable_cross_partition_query=True
        ))

        response = {
            'patients': items
        }

        return func.HttpResponse(
            json.dumps(response),
            mimetype='application/json; charset=utf-8'
        )

    elif req.method == 'POST':
        patient = req.get_json()
        patient['id'] = str(uuid.uuid4())

        container.create_item(patient)

        return func.HttpResponse(
            json.dumps(patient),
            mimetype='application/json; charset=utf-8',
            status_code=200
        )

    else:
        return func.HttpResponse("{}", status_code=400)

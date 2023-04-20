import logging
import json

from Common import db_connect_container

import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    patientId = req.route_params.get('patientId')

    logging.info(f'Received {req.method} request to /patients/{patientId}')

    if patientId == None or patientId == '':
        logging.info('Patient ID was invalid and the patient could not be found')

        return func.HttpResponse('', status_code=404)

    container = db_connect_container('Patients')

    if req.method != 'GET':
        logging.info(f'Invalid HTTP method: {req.method}')

        return func.HttpResponse('', status_code=400)
    
    items = list(container.query_items(
        query='SELECT p.id, p.firstName, p.surname FROM p WHERE p.id = @patientId',
        enable_cross_partition_query=True,
        parameters=[dict(name="@patientId", value=patientId)]
    ))

    if len(items) != 1:
        logging.info(f'Expected 1 patient but found {len(items)}')

        return func.HttpResponse('', status_code=400)

    return func.HttpResponse(
        json.dumps({ 'patient': items[0] }),
        mimetype='application/json; charset=utf-8'
    )

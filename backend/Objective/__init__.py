import logging
import json

from Common import db_connect_container

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info(
        f'Received {req.method} request to /patients/patientId/objectives/objectiveId')

    patientId = req.route_params.get('patientId')
    objectiveId = req.route_params.get('objectiveId')

    if patientId == None or patientId == '':
        logging.info('Unable to locate the patient ID on the request')
        return func.HttpResponse('', status_code=404)
    
    if objectiveId == None or objectiveId == '':
        logging.info('Unable to locate the objective ID on the request')
        return func.HttpResponse('', status_code=404)

    container = db_connect_container('Objectives')

    query_params = [
        dict(name="@patientId", value=patientId),
        dict(name="@objectiveId", value=objectiveId)
    ]

   
    if req.method != 'GET':
        logging.warn(f'Invalid method {req.method}')

        return func.HttpResponse('{}', status_code=400)
    
    query = 'SELECT o.id, o.description, o.patientId, o.type FROM Objectives o WHERE o.patientId = @patientId and o.id = @objectiveId'

    items = container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=query_params
    )

    response = {
        'objective': items.next()
    }

    logging.info(f'Retrieved objective {objectiveId} for {patientId}')

    return func.HttpResponse(
        json.dumps(response),
        mimetype='application/json; charset=utf-8'
    )
        

import logging
import json
import uuid

from Common import db_connect_container

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info(
        f'Received {req.method} request to /patients/patientId/objectives')

    patientId = req.route_params.get('patientId')

    if patientId == None or patientId == '':
        logging.info('Unable to locate the patient ID on the request')
        return func.HttpResponse('', status_code=404)

    patient_container = db_connect_container('Patients')
    container = db_connect_container('Objectives')

    query_params = dict(name="@patientId", value=patientId)

    patients = list(patient_container.query_items(
        query='SELECT p.id FROM Patients p WHERE p.id = @patientId',
        enable_cross_partition_query=True,
        parameters=[query_params]
    ))

    if len(patients) != 1:
        logging.info(f'No patient with id {patientId} could be found')
        return func.HttpResponse('', status_code=404)

    if req.method == 'GET':
        query = 'SELECT o.id, o.description, o.patientId, o.type FROM Objectives o WHERE o.patientId = @patientId'

        items = list(container.query_items(
            query=query,
            enable_cross_partition_query=True,
            parameters=[query_params]
        ))

        response = {
            'objectives': items
        }

        logging.info(f'Retrieved {len(items)} objectives for {patientId}')
        return func.HttpResponse(
            json.dumps(response),
            mimetype='application/json; charset=utf-8'
        )

    elif req.method == 'POST':
        objective = req.get_json()
        objectiveId = str(uuid.uuid4())

        objective['patientId'] = patientId
        objective['id'] = objectiveId

        container.create_item(objective)

        logging.info(f'Created new objective with id {objectiveId}')

        return func.HttpResponse(
            json.dumps({ 'objective': objective }),
            mimetype='application/json; charset=utf-8',
            status_code=201
        )

    else:
        logging.warn(f'Invalid method {req.method}')

        return func.HttpResponse('{}', status_code=400)

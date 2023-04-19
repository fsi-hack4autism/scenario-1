import logging
import json
import uuid

from Common import db_connect_container

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info(
        f'Received {req.method} request to /patients/patientId/objectives/objectiveId')

    if req.method != 'POST':
        logging.warn(f'Invalid method {req.method}')

        return func.HttpResponse('{}', status_code=400)

    patientId = req.route_params.get('patientId')
    objectiveId = req.route_params.get('objectiveId')

    if patientId == None or patientId == '':
        logging.info('Unable to locate the patient ID on the request')
        return func.HttpResponse('', status_code=404)

    if objectiveId == None or objectiveId == '':
        logging.info('Unable to locate the objective ID on the request')
        return func.HttpResponse('', status_code=404)


    query_params = [
        dict(name="@patientId", value=patientId),
        dict(name="@objectiveId", value=objectiveId)
    ]

    patient_container = db_connect_container('Patients')

    patients = list(patient_container.query_items(
        query='SELECT p.id FROM Patients p WHERE p.id = @patientId',
        enable_cross_partition_query=True,
        parameters=query_params
    ))

    if len(patients) != 1:
        logging.info(f'No patient with id {patientId} could be found')
        return func.HttpResponse('', status_code=404)

    objectives_container = db_connect_container('Objectives')

    objectives = list(objectives_container.query_items(
        query='SELECT o.id FROM Objectives o WHERE o.id = @objectiveId and o.patientId = @patientId',
        enable_cross_partition_query=True,
        parameters=query_params
    ))

    if len(objectives) != 1:
        logging.info(f'No patient with id {objectiveId} could be found')
        return func.HttpResponse('', status_code=404)

    container = db_connect_container('Metrics')

    item = req.get_json()
    metricId = str(uuid.uuid4())

    item['id'] = metricId
    item['objectiveId'] = objectiveId

    container.create_item(item)

    logging.info(
        f'Create metric {metricId} for objective {objectiveId} for {patientId}')

    return func.HttpResponse(
        json.dumps(item),
        mimetype='application/json; charset=utf-8'
    )

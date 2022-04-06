from flask import Blueprint
from flask_restx import Api

import json
from flask import Flask
from flask_restx import Resource, Namespace
from werkzeug.exceptions import BadRequest
from azure.cosmos import CosmosClient
from constants import ResponseCodes, ErrorMessages
from models.responsemodel import ResponseModel, build_response
from models.request_models import get_session_info_fields, session_info_fields, add_event_info_fields, update_event_end_time_fields, patient_behavior_trend_fields


app = Flask(__name__)

app.config.from_file("config.demo.json", load=json.load)


blueprint = Blueprint('api', __name__)

api = Api(blueprint,
          title='Hackathon API',
          version='1.0',
          description='Application to expose hackathon APIs',
          validate=True
          )



ns = Namespace("Hackathon", "All the APIs related to Hackathon")
client = CosmosClient(app.config["ACCOUNT_URI"], credential=app.config["ACCOUNT_KEY"])
database = client.get_database_client(app.config["DATABASE"])
# Hackathon Resources

class GetPatients(Resource):
    def get(self):
        response = None
        req = None
        try:
            container = database.get_container_client("Users")
            patients = container.query_items(
                query='SELECT u.id, u.firstname, u.lastname FROM Users u WHERE u.type = "patient"',
                enable_cross_partition_query=True)
            response = ResponseModel(list(patients), ResponseCodes.SUCCESS)
        except Exception as e:  
            print(e)
            response = ResponseModel(None, ResponseCodes.SERVERERROR,ErrorMessages.DEFAULT)
        finally:
            return build_response(response)

class GetTherapists(Resource):
    def get(self):
        response = None
        req = None
        try:
            container = database.get_container_client("Users")
            therapists = container.query_items(
                query='SELECT u.id, u.firstname, u.lastname FROM Users u WHERE u.type = "therapist"',
                enable_cross_partition_query=True)
            response = ResponseModel(list(therapists), ResponseCodes.SUCCESS)
        except Exception as e:  
            print(e)
            response = ResponseModel(None, ResponseCodes.SERVERERROR,ErrorMessages.DEFAULT)
        finally:
            return build_response(response)

class GetBehaviors(Resource):
    def get(self):
        response = None
        req = None
        try:
            container = database.get_container_client("Behavior")
            behaviors = container.query_items(
                query='SELECT b.id, b.description, b.type FROM Behaviors b',
                enable_cross_partition_query=True)
            response = ResponseModel(list(behaviors), ResponseCodes.SUCCESS)
        except Exception as e:  
            print(e)
            response = ResponseModel(None, ResponseCodes.SERVERERROR,ErrorMessages.DEFAULT)
        finally:
            return build_response(response)

class GetSessionInfo(Resource):
    @ns.expect(get_session_info_fields)
    def get(self):
        response = None
        req = None
        try:
            req = get_session_info_fields.parse_args()
            container = database.get_container_client("Sessions")
            if req.sessionId:
                session_info = container.query_items(
                    query='SELECT s.id, s.startTime, s.endTime, s.patientId, s.therapistId, s.events FROM Sessions s WHERE s.id = @id',
                    parameters=[
                    dict(name='@id', value=req.sessionId)
                    ],
                    enable_cross_partition_query=True)
            else:
                session_info = container.query_items(
                    query='SELECT s.id, s.startTime, s.endTime, s.patientId, s.therapistId FROM Sessions s WHERE s.patientId = @patientId',
                    parameters=[
                    dict(name='@patientId', value=req.patientId)
                ],
                    enable_cross_partition_query=True)
            response = ResponseModel(list(session_info), ResponseCodes.SUCCESS)
        except BadRequest as e:
            print(e)
            response = ResponseModel(None, ResponseCodes.BAD_REQUEST,ErrorMessages.BAD_REQUEST)
        except Exception as e:  
            print(e)
            response = ResponseModel(None, ResponseCodes.SERVERERROR,ErrorMessages.DEFAULT)
        finally:
            return build_response(response)

class PatientBehaviorTrend(Resource):
    @ns.expect(patient_behavior_trend_fields)
    def get(self):
        response = None
        req = None
        try:
            req = patient_behavior_trend_fields.parse_args()
            container = database.get_container_client("Sessions")
            session_details = { "startTime": None, "sessionStats": []}
            sessions = container.query_items(
                query='SELECT s.id, s.startTime FROM Sessions s WHERE s.patientId = @patientId',
                parameters=[
                dict(name='@patientId', value=req.patientId)
                ],
                enable_cross_partition_query=True)

            for session in sessions:
                session_details['startTime'] = session['startTime']
                container = database.get_container_client("Events")
                behavior_ids = container.query_items(
                    query='SELECT DISTINCT e.behaviorId FROM Events e where e.sessionId = @sessionId',
                    parameters=[
                    dict(name='@sessionId', value=session['id'])
                    ],
                    enable_cross_partition_query=True)
                behaviorDuration = 0
                behaviorCount = 0
                for behaviorId in behavior_ids:
                    container = database.get_container_client("Events")
                    durations = container.query_items(
                        query='SELECT DateTimeDiff("minute", e.startTime, e.endTime) as duration FROM Events e where e.sessionId = @sessionId and e.behaviorId = @behaviorId',
                        parameters=[
                        dict(name='@sessionId', value=session['id']),
                        dict(name='@behaviorId', value=behaviorId['behaviorId'])
                        ],
                        enable_cross_partition_query=True)
                    for duration in durations:
                        behaviorCount = behaviorCount + 1
                        behaviorDuration = behaviorDuration + duration['duration']
                    session_details['sessionStats'].append({"behaviorId": behaviorId, "behaviorDuration": behaviorDuration, "behaviorCount": behaviorCount})

            response = ResponseModel(session_details, ResponseCodes.SUCCESS)
        except BadRequest as e:
            print(e)
            response = ResponseModel(None, ResponseCodes.BAD_REQUEST,ErrorMessages.BAD_REQUEST)
        except Exception as e:  
            print(e)
            response = ResponseModel(None, ResponseCodes.SERVERERROR,ErrorMessages.DEFAULT)
        finally:
            return build_response(response)

class AddSessionInfo(Resource):
    @ns.expect(session_info_fields)
    def post(self):
        response = None
        req = None
        try:
            req = session_info_fields.parse_args()
            container = database.get_container_client("Sessions")
            container.upsert_item({
                'id': req.id,
                'startTime': req.startTime,
                'endTime': req.endTime,
                'patientId': req.patientId,
                'therapistId': req.therapistId
            })
            response = ResponseModel(None, ResponseCodes.CREATED)
        
        except BadRequest as e:
            print(e)
            response = ResponseModel(None, ResponseCodes.BAD_REQUEST,ErrorMessages.BAD_REQUEST)
        except Exception as e:
            print(e)
            response = ResponseModel(None, ResponseCodes.SERVERERROR, ErrorMessages.DEFAULT)
        finally:
            return build_response(response)

class AddEventInfo(Resource):
    @ns.expect(add_event_info_fields)
    def post(self):
        response = None
        req = None
        try:
            req = add_event_info_fields.parse_args()
            container = database.get_container_client("Events")
            container.upsert_item({
                'id': req.id,
                'sessionId': req.sessionId,
                'behaviorId': req.behaviorId,
                'startTime': req.time
            })
            response = ResponseModel(None, ResponseCodes.CREATED)
        
        except BadRequest as e:
            print(e)
            response = ResponseModel(None, ResponseCodes.BAD_REQUEST,ErrorMessages.BAD_REQUEST)
        except Exception as e:
            print(e)
            response = ResponseModel(None, ResponseCodes.SERVERERROR, ErrorMessages.DEFAULT)
        finally:
            return build_response(response)

class UpdateEventEndTime(Resource):
    @ns.expect(update_event_end_time_fields)
    def post(self):
        response = None
        req = None
        try:
            req = update_event_end_time_fields.parse_args()
            container = database.get_container_client("Events")
            session_info = container.query_items(
                    query='SELECT s.id, s.sessionId, s.behaviorId, s.startTime FROM Sessions s WHERE s.id = @id OFFSET 0 LIMIT 1',
                    parameters=[
                    dict(name='@id', value=req.id)
                    ],
                    enable_cross_partition_query=True)
            event_data = list(session_info)[0]
            container.upsert_item({
                'id': event_data['id'],
                'sessionId': event_data['sessionId'],
                'behaviorId': event_data['behaviorId'],
                'startTime': event_data['startTime'],
                'endTime': req.time
            })
            response = ResponseModel(None, ResponseCodes.SUCCESS)
        
        except BadRequest as e:
            print(e)
            response = ResponseModel(None, ResponseCodes.BAD_REQUEST,ErrorMessages.BAD_REQUEST)
        except Exception as e:
            print(e)
            response = ResponseModel(None, ResponseCodes.SERVERERROR, ErrorMessages.DEFAULT)
        finally:
            return build_response(response)


# Adding Resources to Namespace.

ns.add_resource(
    GetPatients,
    "api/v1/patients",
    endpoint="get_patients"
)

ns.add_resource(
    GetTherapists,
    "api/v1/therapists",
    endpoint="get_therapists"
)

ns.add_resource(
    GetBehaviors,
    "api/v1/behaviors",
    endpoint="get_behaviors"
)

ns.add_resource(
    GetSessionInfo,
    "api/v1/session",
    endpoint="get_session_info"
)

ns.add_resource(
    AddSessionInfo,
    "api/v1/sessions",
    endpoint="add_session_info"
)

ns.add_resource(
    AddEventInfo,
    "api/v1/events/start",
    endpoint="add_event_start"
)

ns.add_resource(
    UpdateEventEndTime,
    "api/v1/events/end",
    endpoint="update_event_end_time"
)

ns.add_resource(
    PatientBehaviorTrend,
    "api/v1/reports/patientsBehaviorTrend",
    endpoint="patient_behavior_trend"
)


api.add_namespace(ns, path='/')


app.register_blueprint(blueprint)

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=7090,debug=True)

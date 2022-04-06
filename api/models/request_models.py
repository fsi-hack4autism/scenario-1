from datetime import datetime
from flask_restx import reqparse
from uuid import UUID
import re

def uuid_type(arg_value):
    try:
        UUID(arg_value, version=4)
    except ValueError:
        raise ValueError("Invalid UUID")
    return arg_value

# Get Session Info Fields
get_session_info_fields = reqparse.RequestParser(bundle_errors=True)
get_session_info_fields.add_argument('sessionId', type=uuid_type, location='args', help="ID of tthe session.")
get_session_info_fields.add_argument('patientId', type=str, location='args', help="Id of the patient.")

# Get Patient Behavior Trend Fields
patient_behavior_trend_fields = reqparse.RequestParser(bundle_errors=True)
patient_behavior_trend_fields.add_argument('patientId', type=str, location='args', help="Id of the patient.")

# Add Session Info Fields
session_info_fields = reqparse.RequestParser(bundle_errors=True)
session_info_fields.add_argument('id', type=uuid_type, location='json', required=True, help="Id of the Session .")
session_info_fields.add_argument('startTime', type=str, location='json', required=True, help="Start time of the session.")
session_info_fields.add_argument('endTime', type=str, location='json', required=True, help="End time of the session")
session_info_fields.add_argument('patientId', type=str, location='json', required=True, help="Id of the patient.")
session_info_fields.add_argument('therapistId', type=str, location='json', required=True, help="Id of the therapist.")

# Add Event Info Fields
add_event_info_fields = reqparse.RequestParser(bundle_errors=True)
add_event_info_fields.add_argument('id', type=str, location='json', required=True, help="Id of the Event.")
add_event_info_fields.add_argument('sessionId', type=uuid_type, location='json', required=True, help="Id of the Session.")
add_event_info_fields.add_argument('behaviorId', type=int, location='json', required=True, help="Id of the behavior")
add_event_info_fields.add_argument('time', type=str, location='json', required=True, help="Start time of the Event.")

# Update Event end time Fields
update_event_end_time_fields = reqparse.RequestParser(bundle_errors=True)
update_event_end_time_fields.add_argument('id', type=str, location='json', required=True, help="Id of the Event.")
update_event_end_time_fields.add_argument('time', type=str, location='json', required=True, help="Start time of the Event.")


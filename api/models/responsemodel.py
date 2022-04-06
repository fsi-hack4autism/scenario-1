import json
from flask import make_response

def build_response(response):
    response = make_response(response.toJSON())
    response.headers['content-type'] = 'application/json'
    return response

class ResponseModel():
    """Response model for APIs.

    Attributes:
        response -- data
        message -- explanation of the error.
        status_code -- status code of the error
    """

    def __init__(self, response, status_code, message=None):
        self.data = response
        self.status = StatusModel(status_code, message)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)

class StatusModel():
    """Status model for APIs

    Attributes:
        message -- explanation of the error.
        status_code -- status code of the error
    """
    def __init__(self, status_code, message=None):
        self.code = status_code
        self.message = message

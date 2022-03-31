import os

settings = {
    'host': os.environ.get('ACCOUNT_HOST', 'https://hackathon-cosmos-db.documents.azure.com:443/'),
    'master_key': os.environ.get('ACCOUNT_KEY', '7DGqJdLEXdpFrb03w0z7AyBJCXGFBh8zpYrIkt8YEDOPeYTuDWGLp2nMcFMInmY0bFqaCX3dlYbV2xqBBgB91Q=='),
    'database_id': os.environ.get('COSMOS_DATABASE', 'IoTData'),
    'container_id': os.environ.get('COSMOS_CONTAINER', 'Users'),
}
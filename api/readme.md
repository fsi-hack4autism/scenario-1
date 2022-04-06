# Scenario 1 - Backend

## Prerequisites

1. Install [Python 3.10.4](https://www.python.org/downloads/release/python-3104/)
   - If not included, install `pip3`
   - Run `pip install -r requirements.txt`
2. If running Cosmos DB locally, install the [Cosmos DB emulator](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator?tabs=ssl-netstd21)

## Installation and running the API

1. If necessary, launch the Cosmos DB emulator
   1. Create a `Users` container with partition key `/type`
   2. Create a `Behaviors` container with partition key `/type`
   3. Create a `Sessions` container with partition key `/therapistId`
   4. Create an `Events` container with partition key `/sessionId`
2. Run `python3 app.py` to launch the API

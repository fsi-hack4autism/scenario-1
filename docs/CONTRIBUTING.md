# Scenario 1

## Backend

The backend is written in Python and utilizes Azure functions.

### Azure Functions

To easily develop, you should download the
[Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
extension for VS Code.

Manual deployment to Azure can be accomplished using [this Microsoft Learn guide](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-python?pivots=python-mode-configuration)
or [this VS Code guide](https://code.visualstudio.com/docs/azure/deployment).

You can also find the Azure FUnctions Python developer guide
[here](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-python?tabs=asgi%2Capplication-level&pivots=python-mode-configuration).

In order to launch the Functions locally,
you can utilize the debugger for VS Code,
selecting the "Attach to Python Function" option.
However,
to do this you **must be scoped to the `/backend` directory**
in VS Code (e.g., `code ./backend`).
Once done, VS Code should prompt you with
a popup containing the following message:

> Failed to find Python virtual environment ".venv",
which is expected based on the setting
"azureFunctions.pythonVenv".

Select the appropriate option to have VS Code automatically
generate the Python virtual environment for you.
If you miss the prompt or it never appears,
you can manually create the environment using the following.

```shell
python -m venv .venv
```

Then run as normal.

This version of Azure Functions requires Python 3.6 to 3.9 to run.
The latest 3.9 version can be downloaded
[here](https://www.python.org/downloads/release/python-3913/).

#### Publishing the Azure Functions

To publish the Azure Functions,
you should be in a shell in the scope of the `backend/` directory,
then run the following commands:

```shell
$> az login --tenant <directory-or-tenant-id>

$> func azure functionapp publish <app-name>
```

Where `<directory-or-tenant-id>` is the ID of the Hackathon's directory or tenant andd
`<app-name>` is the name of the function app to publish to.
The the case of the 2023 event,
these were `0dd73973-d561-4aa6-b161-6ce0fa5e96fb` and `hackathon-function-iot-2023` respectively.

### CosmosDb

In order to execute the functions, they must have access to a CosmosDb instance.
This can either be one running in Azure or a local verison using the
[CosmosDb Emulator](https://learn.microsoft.com/en-us/azure/cosmos-db/local-emulator)
provided by Microsoft.

Once you create a Database,
create the appropriate container(s) for the Functions,
then update the `local.settings.json` file to include the following:

```json
{
    "Values": {
        "HOST": "<url>",
        "MASTER_KEY": "<secret_key>",
        "DATABASE_ID": "<database_name>"
    }
}
```

These values are required and can be set using environment variables to target the production environment.

For some examples of how to make requests to CosmosDb, see
[here](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/cosmos/azure-cosmos/samples/examples.py)

### Postman

To test the endpoints, you may utilize the
[`backend.postman_collection.json`](../backend/backend.postman_collection.json).
Importing this file into
[Postman](https://www.postman.com/downloads/)
will allow you to easily modify and send HTTP requests to the backend.

## Frontend

The frontend is a static React application which communicates directly
with the [backend](#backend).

### Deploying the React application

To begin, compile the React application

```shell
$> cd web

$> npm run build
```

The compiled code will be available in the `build/` directory,
change to the newly created directory.

```shell
$> cd build
```

Finally, upload to Azure utilizing the following commands:

```shell
$> az login --tenant <directory-or-tenant-id>

$> az webapp up -n <app-name> --html
```

Where `<directory-or-tenant-id>` is the ID of the Hackathon's directory or tenant,
and `<app-name>` is the name of the web app to publish to.
The the case of the 2023 event,
these were `0dd73973-d561-4aa6-b161-6ce0fa5e96fb`
and `windows-webapp-fsihack23` respectively.

> Note: A requirement of utilizing an HTML web app is that the web app must be
a Windows instance

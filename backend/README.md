# Scenario 1 - IoT Device - Backend

## TODO

- [ ] - Create GET /patients endpoint
- [ ] - Create POST /patients endpoint
- [ ] - Create GET /patients/{patientId}/objectives endpoint
- [ ] - Create POST /patients/{patientId}/objectives endpoint
- [ ] - Create GET /patients/{patientId}/objectives/{objectiveId} endpoint
- [ ] - Create POST /patients/{patientId}/objectives/{objectiveId}/record endpoint
- [ ] - Create a Terraform script to deploy and create the resources
  - Azure function for each set of endpoints
  - API Gateway
  - Database (CosmosDb)

## Publishing the Azure Functions

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

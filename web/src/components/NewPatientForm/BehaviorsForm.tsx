import { Form, FieldArray, Field, Formik } from "formik";
import React from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import Objective from "../../models/Objective";
import PatientDetails from "../../models/PatientDetails";
import Icon from "../Icon";

const BehaviorsForm = () => (
  <Formik
    initialValues={
      {
        firstName: "",
        surname: "",
        behaviorsList: [] as Objective[],
      } as PatientDetails
    }
    className="m-3"
    onSubmit={(patient: any) => {
    }}
  >
    {({ values }) => (
      <Form className="m-2">
        <FormGroup>
          <Label className="h3" for="behaviorsList">
            Behaviors
          </Label>
          <FieldArray
            name="behaviorsList"
            render={(arrayHelpers) =>
              values.behaviorsList && values.behaviorsList.length > 0 ? (
                <div>
                  {values.behaviorsList.map((_, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-end justify-content-space-between"
                    >
                      <FormGroup className="me-1 flex-grow-1">
                        <Label for={`behaviorsList.${index}.description`}>
                          Description
                        </Label>
                        <Field
                          name={`behaviorsList.${index}.description`}
                          as={Input}
                        />
                      </FormGroup>
                      <FormGroup className="me-1 flex-grow-1">
                        <Label for={`behaviorsList.${index}.type`}>Type</Label>
                        <Field
                          name={`behaviorsList.${index}.type`}
                          as={Input}
                          type="select"
                        >
                          <option value="Event">Frequency / Rate</option>
                          <option value="Duration">Duration Recording</option>
                          <option value="TimeToResponse">
                            Latency Recording
                          </option>
                        </Field>
                      </FormGroup>

                      <Button
                        color="danger"
                        type="button"
                        className="mb-3"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        <Icon name="minus" />
                      </Button>
                    </div>
                  ))}
                  <div className="text-center">
                    <Button
                      block
                      outline
                      type="button"
                      onClick={() => arrayHelpers.push("")}
                    >
                      Add a behavior
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    block
                    outline
                    type="button"
                    onClick={() => arrayHelpers.push("")}
                  >
                    Add a behavior
                  </Button>
                </div>
              )
            }
          />
        </FormGroup>
      </Form>
    )}
  </Formik>
);

export default BehaviorsForm;

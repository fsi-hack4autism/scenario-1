import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from "react-router";

import PatientDetails from "../../models/PatientDetails";
import { createPatient } from "../../mocks/patientStore";
import Icon from "../Icon";
import Behavior from "../../models/Behavior";

const NewPatientForm = () => {
    const navigateTo = useNavigate();

    return <div>
        <Formik
            initialValues={{ firstName: "", surname: "", behaviorsList: [] as Behavior[] } as PatientDetails}
            className="m-3"
            onSubmit={(patient:any) => {
                console.log(patient);
                const patientId = createPatient(patient);
                navigateTo(`/patient/${patientId}`);
            }}
        >
            {({values}) => (
                <Form className="m-2">
                    <h2>New Patient:</h2>

                    <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Field as={Input} name="firstName" />
                    </FormGroup>

                    <FormGroup>
                        <Label for="surname">Surname</Label>
                        <Field as={Input} name="surname" />
                    </FormGroup>

                    <FormGroup>
                        <Label for="behaviorsList">Behaviors</Label>
                        <FieldArray
                            name="behaviorsList"
                            render={arrayHelpers => (
                            <ul>
                                {values.behaviorsList && values.behaviorsList.length > 0 ? (
                                values.behaviorsList.map((_, index) => (
                                    <li key={index}>
                                    <Field name={`behaviorsList.${index}.description`} />
                                    <Field name={`behaviorsList.${index}.type`} as="select" >
                                        <option value="Event">Frequency / Rate</option>
                                        <option value="Duration">Duration Recording</option>
                                        <option value="TimeToResponse">Latency Recording</option>
                                    </Field>
                                    <button
                                        type="button"
                                        onClick={() => arrayHelpers.remove(index)}
                                    >
                                        <Icon name="minus"/> Remove
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => arrayHelpers.insert(index + 1, '')}
                                    >
                                        <Icon name="plus"/> Insert below
                                    </button>
                                    </li>
                                ))
                                ) : (
                                <li>
                                    <button type="button" onClick={() => arrayHelpers.push('')}>
                                        Add a behavior
                                    </button>
                                </li>
                                )}
                            </ul>
                            )}
                        />
                    </FormGroup>


                    <Button type="submit" block>Create Patient</Button>
                </Form>
            )}
        </Formik>
    </div>
};

export default NewPatientForm;
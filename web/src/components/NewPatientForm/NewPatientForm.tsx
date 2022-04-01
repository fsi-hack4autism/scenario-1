import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { useNavigate } from "react-router";

import PatientDetails from "../../models/PatientDetails";
import Icon from "../Icon";
import Behavior from "../../models/Behavior";
import { Link } from "react-router-dom";

const NewPatientForm = () => {
    const navigateTo = useNavigate();

    return <Row className="m-2">
        <Col lg={{ size: 8, offset: 2 }} className="border p-2 rounded">
            <Formik
                initialValues={{ firstName: "", surname: "", behaviorsList: [] as Behavior[] } as PatientDetails}
                className="m-3"
                onSubmit={(patient: any) => {
                    console.log(patient);
                    navigateTo(`/patient/1`);
                }}
            >
                {({ values }) => (
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
                            <Label className="h3" for="behaviorsList">Behaviors</Label>
                            <FieldArray
                                name="behaviorsList"
                                render={arrayHelpers => (
                                    values.behaviorsList && values.behaviorsList.length > 0
                                        ? (
                                            <div>{
                                                values.behaviorsList.map((_, index) => (
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
                                                            <Label for={`behaviorsList.${index}.type`}>
                                                                Type
                                                            </Label>
                                                            <Field
                                                                name={`behaviorsList.${index}.type`}
                                                                as={Input}
                                                                type="select"
                                                            >
                                                                <option value="Event">Frequency / Rate</option>
                                                                <option value="Duration">Duration Recording</option>
                                                                <option value="TimeToResponse">Latency Recording</option>
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
                                                ))
                                            }
                                                <div className="text-center">
                                                    <Button block outline type="button" onClick={() => arrayHelpers.push('')}>
                                                        Add a behavior
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                        : (
                                            <div className="text-center">
                                                <Button block outline type="button" onClick={() => arrayHelpers.push('')}>
                                                    Add a behavior
                                                </Button>
                                            </div>
                                        )
                                )}
                            />
                        </FormGroup>

                        <hr />
                        <div className="d-flex align-items-center justify-content-center">
                            <Link to="/home"
                                color="secondary"
                                className="d-inline-block flex-shrink-0 me-2"
                            >
                                Back to Patients
                            </Link>
                            <Button type="submit" color="primary" className="px-4">
                                <Icon name="plus" className="me-2" />
                                Create Patient
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Col>
    </Row>
};

export default NewPatientForm;
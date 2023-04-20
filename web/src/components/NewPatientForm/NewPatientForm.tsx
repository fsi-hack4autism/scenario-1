import React from "react";
import { Formik, Form, Field } from "formik";
import { FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { useNavigate } from "react-router";

import Icon from "../Icon";
import { Link } from "react-router-dom";
import { createPatient } from "../../api";

const NewPatientForm = () => {
    const navigateTo = useNavigate();

    return <Row className="m-2">
        <Col lg={{ size: 8, offset: 2 }} className="border p-2 rounded">
            <Formik
                initialValues={{ firstName: "", surname: "" }}
                className="m-3"
                onSubmit={async (patient: any) => {
                    const newPatient = await createPatient(patient);

                    navigateTo(`/patient/${newPatient.patientId}`);
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

                        <hr />
                        <div className="d-flex align-items-center justify-content-center">
                            <Link to="/patients"
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
import React from "react";
import { Formik, Form, Field } from "formik";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from "react-router";

import Patient from "../../models/Patient";
import { createPatient } from "../../mocks/store";

const NewPatientForm = () => {
    const navigateTo = useNavigate();

    return <div>
        <Formik
            initialValues={{ firstName: "", surname: "" } as Patient}
            onSubmit={(patient) => {
                const patientId = createPatient(patient);
                navigateTo(`/patient/${patientId}`);
            }}
        >
            {() => (
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

                    <Button type="submit" block>Create Patient</Button>
                </Form>
            )}
        </Formik>
    </div>
};

export default NewPatientForm;
import React from "react";
import { Formik, Form, Field } from "formik";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from "react-router";

import PatientDetails from "../../models/PatientDetails";
import { createPatient } from "../../mocks/patientStore";

const NewPatientForm = () => {
    const navigateTo = useNavigate();

    return <div>
        <Formik
            initialValues={{ firstName: "", surname: "" } as PatientDetails}
            className="m-3"
            onSubmit={(patient:any) => {
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
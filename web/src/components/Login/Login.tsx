import React from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router";
import { FormGroup, Label, Input, Button } from "reactstrap";

import "./Login.css";

const Login = () => {
    const navigateTo = useNavigate();

    return <div className="m-3">
        <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={() => {
                navigateTo(`/home`);
            }}
        >
            {() => (
                <Form className="m-2">
                    <h2>Login</h2>

                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Field as={Input} name="username" />
                    </FormGroup>

                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Field as={Input} name="password" />
                    </FormGroup>

                    <Button type="submit" block>Login</Button>
                </Form>
            )}
        </Formik>
    </div>
};
export default Login;

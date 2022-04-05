import React from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router";
import { FormGroup, Input, Button, Card, CardBody, Row, Col } from "reactstrap";

import "./Login.css";

const Login = () => {
  const navigateTo = useNavigate();

  return (
    <Row>
      <Col sm={{ offset: 4, size: 3 }}>
        <Card className="mt-3">
          <CardBody>
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={() => navigateTo(`/patients`)}
            >
              {() => (
                <Form className="m-2">
                  <h2>Login</h2>
                  <hr />
                  <FormGroup>
                    <Field as={Input} placeholder="Username" name="username" />
                  </FormGroup>

                  <FormGroup>
                    <Field
                      as={Input}
                      type="password"
                      placeholder="Password"
                      name="password"
                    />
                  </FormGroup>

                  <Button type="submit" color="primary" block>
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default Login;

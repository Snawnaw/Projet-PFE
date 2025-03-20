import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { auth } from '../services/api';

const SignInContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string().required('Mot de passe requis'),
});

const SignIn = () => {
    const handleSubmit = async (values) => {
        try {
            const response = await auth.login(values.email, values.password);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SignInContainer>
            <h1>Connexion</h1>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={SignInSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <FormGroup>
                            <Field
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="Email"
                            />
                            {errors.email && touched.email && (
                                <div className="text-danger">{errors.email}</div>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Field
                                name="password"
                                type="password"
                                className="form-control"
                                placeholder="Mot de passe"
                            />
                            {errors.password && touched.password && (
                                <div className="text-danger">{errors.password}</div>
                            )}
                        </FormGroup>

                        <button type="submit" className="btn btn-primary w-100">
                            Se connecter
                        </button>
                    </Form>
                )}
            </Formik>
        </SignInContainer>
    );
};

export default SignIn;

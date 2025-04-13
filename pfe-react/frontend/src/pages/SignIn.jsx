import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { auth } from '../services/api';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const [error, setError] = useState('');
    
    const handleSubmit = async (values, { setSubmitting }) => {
        setError('');
        console.log('Submitting login form with:', values.email);
        try {
            const response = await auth.login(values.email, values.password);
        
        if (response && response.data) {
            const { user, token } = response.data;
            
            // Store user data and token
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        }
        } catch (error) {
            console.error('Detailed login error:', error);
            if (error.response) {
                // Server responded with error
                setError(error.response.data.message || 'Identifiants invalides');
            } else if (error.request) {
                // No response received
                setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
            } else {
                // Other errors
                setError(error.message || 'Erreur de connexion');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SignInContainer>
            <h1>Connexion</h1>
            {error && <div className="alert alert-danger">{error}</div>}
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

                        <button type="submit" className="btn btn-primary w-100">Se connecter</button>
                        <p>Vous n'avez pas un compte ? <a href="SignUp">Créer un compte</a></p>
                    </Form>
                )}
            </Formik>
        </SignInContainer>
    );
};

export default SignIn;

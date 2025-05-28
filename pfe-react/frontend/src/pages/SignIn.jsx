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
    const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
    
    const handleSubmit = async (values, { setSubmitting }) => {
        setError('');
        try {
            // Debug: log values being sent
            console.log('Login attempt:', values);
            const response = await auth.login(values.email, values.password);
            if (response && response.data && response.data.user) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                if (response.data.user.role === 'admin') {
                    navigate('/admin');
                }
                else {
                    navigate('/user');
                }
            }
        } catch (error) {
            setError('Identifiants invalides');
            console.error('Login error:', error);
        }
        setSubmitting(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/login', { email, password });
            const user = res.data.user;
            // Save token/user info as needed
            if (user.role === 'etudiant') navigate('/Etudiant');
            else if (user.role === 'enseignant') navigate('/Enseignant');
            else if (user.role === 'admin') navigate('/Admin');
        } catch (err) {
            setError('Identifiants invalides');
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
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Mot de passe"
                            />
                            {errors.password && touched.password && (
                                <div className="text-danger">{errors.password}</div>
                            )}
                            <div style={{ marginTop: "0.5rem" }}>
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    style={{ marginRight: "0.5rem" }}
                                />
                                <label htmlFor="showPassword">Afficher le mot de passe</label>
                            </div>
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

import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextInput, Text, Anchor, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';

const regSchema = joi.object({
    login: joi.string().required().min(3).max(32).pattern(/^[A-z0-9_]+$/).message({
        "any.required": "Login is required",
        "string.min": "The login must contain at least 3 characters",
        "string.max": "The maximum login length is 32 characters",
        "string.pattern.base": "Login should contain only latin letters, numbers and _"
    }),
    password: joi.string().required().min(8).max(64).pattern(/^(?=.*[A-Z])[A-z0-9]+$/).message({
        "any.required": "Password is required",
        "string.min": "The password must contain at least 8 characters",
        "string.max": "The maximum password length is 64 characters",
        "string.pattern.base": "Passwords should contain only latin letters, numbers and symbols"
    }),
    password_confirmation: joi.string().required().valid(joi.ref("password")).messages({
        "any.required": "Password confirmation is required",
        "any.only": "Password confirmation does not match password"
    }),
    full_name: joi.string().required().pattern(/^[A-Za-z]+\s+[A-Za-z]+$/).message({
        "any.required": "Full name is required",
        "string.pattern.base": "The full name must contain only Latin letters and consist of two words"
    }),
    email: joi.string().required().email({ tlds: { allow: false } }).message({
        "any.required": "Email is required",
        "string.email": "Email is not valid"
    })
});

export default function Login() {
    const navigate = useNavigate();
    const [err, setErr] = React.useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            login: '',
            password: '',
            password_confirmation: '',
            full_name: '',
            email: '',
        },

        validate: joiResolver(regSchema),
    });

    const handleLogin = async (values, event) => {
        event.preventDefault();
        const { login, password, password_confirmation, full_name, email } = values;

        try {
            const result = await axios.post(
                "http://localhost:5868/api/auth/register",
                { login, password, password_confirmation, full_name, email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            navigate("/login");
        } catch (error) {
            if (error.response) {
                setErr(error.response.data.error);
            } else if (error.request) {
                setErr("Server did not respond.");
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleLogin)}>.
            <Stack spacing="md">
            <TextInput
                withAsterisk
                label="Login"
                required
                {...form.getInputProps('login')}
            />
            <TextInput
                withAsterisk
                label="Password"
                type='password'
                required
                {...form.getInputProps('password')}
            />
            <TextInput
                withAsterisk
                label="Password confirmation"
                type='password'
                required
                {...form.getInputProps('password_confirmation')}
            />
             <TextInput
                withAsterisk
                label="Full name"
                required
                {...form.getInputProps('full_name')}
            />
             <TextInput
                withAsterisk
                label="Email"
                required
                {...form.getInputProps('email')}
            />
            {err && <Text color="red">{err}</Text>}
            <Button type="submit">Register</Button> 
            <Anchor component={Link} to="/login">Already have account?</Anchor>
            </Stack>
        </form>
    )
}
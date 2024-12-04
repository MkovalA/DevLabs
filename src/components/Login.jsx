import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, TextInput, Text, Anchor, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';

const loginSchema = joi.object({
    login: joi.string().required().min(3).max(32).pattern(/^[a-zA-Z0-9_]+$/).message({
        "any.required": "Login is required",
        "string.min": "The login must contain at least 3 characters",
        "string.max": "The maximum login length is 32 characters",
        "string.pattern.base": "Passwords should contain only latin letters, numbers and _"
    }),
    email: joi.string().required().email({ tlds: { allow: false } }).message({
        "any.required": "Email is required",
        "string.email": "Email is not valid"
    }),
    password: joi.string().required().min(8).max(64).pattern(/^[A-Za-z0-9\W]+$/).message({
        "any.required": "Password is required",
        "string.min": "The password must contain at least 8 characters",
        "string.max": "The maximum password length is 64 characters",
        "string.pattern.base": "Passwords should contain only latin letters, numbers and symbols"
    })
});

export default function Login() {
    const [err, setErr] = React.useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            login: '',
            email: '',
            password: '',
        },

        validate: joiResolver(loginSchema),
    });

    const handleLogin = async (values, event) => {
        event.preventDefault();
        const { login, email, password } = values;

        try {
            const result = await axios.post(
                "http://localhost:5868/api/auth/login",
                { login, password, email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            localStorage.setItem("access_token", result.data.access_token);
            localStorage.setItem("refresh_token", result.data.refresh_token);
            window.location.href = "/";
        } catch (error) {
            if (error.response) {
                setErr(error.response.data.error);
            } else if (error.request) {
                setErr("Server did not respond.");
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleLogin)}>
            <Stack spacing="md">
            <TextInput
                withAsterisk
                label="Login"
                required
                {...form.getInputProps('login')}
            />
            <TextInput
                withAsterisk
                label="Email"
                type='email'
                required
                {...form.getInputProps('email')}
            />
            <TextInput
                withAsterisk
                label="Password"
                type='password'
                required
                {...form.getInputProps('password')}
            />

            {err && <Text color="red">{err}</Text>}
            <Button type="submit">Login</Button> 
            <Anchor component={Link} to="/register">You don`t have account?</Anchor>
            <Anchor component={Link} to="/reset-password">Forgot password?</Anchor>
            </Stack>
        </form>
    )
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Text, Stack, Group, AppShell, useMantineTheme, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';
import axiosConfigurated from './axiosConfig';

const createUserSchema = joi.object({
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
    email: joi.string().required().email({ tlds: { allow: false } }).message({
        "any.required": "Email is required",
        "string.email": "Email is not valid"
    }),
    role: joi.string().required().valid("user", "admin").messages({
        "any.required": "Role is required",
        "any.only": "Role must be user or admin"
    })
});

export default function CreateUser() {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [err, setErr] = React.useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            login: '',
            password: '',
            password_confirmation: '',
            email: '',
            role: ''
        },

        validate: joiResolver(createUserSchema)
    });

    const handleUser = async (values, event) => {
        event.preventDefault();
        const { login, password, password_confirmation, email, role } = values;

        try {
            await axiosConfigurated.post("/users",
                { login, password, password_confirmation, email, role }
            );
            navigate("/users");
        } catch (error) {
            if (error.response) {
                setErr(error.response.data.error);
            } else if (error.request) {
                setErr("Server did not respond.");
            } else {
                console.log(error.message);
            }
        }
    };

    return (
        <AppShell.Main>
            <Group style={{ width: '100%', padding: '10px', height: '15vh', display: "flex", justifyContent: "Center", verticalAlign: "Center"}} position="apart" >
                <Title>Create user</Title>
            </Group>
            <Group style={{ border: "1px solid #dedede", padding: "15px"}}>
                <form onSubmit={form.onSubmit(handleUser)}>
                    <Stack spacing="md">
                        <TextInput
                        withAsterisk
                        label="Login"
                        required
                        {...form.getInputProps('login')}
                        style={{ width: '50vw' }}
                        />
                        <TextInput
                        withAsterisk
                        label="Password"
                        type='password'
                        required
                        {...form.getInputProps('password')}
                        style={{ width: '50vw' }}
                        />
                        <TextInput
                        withAsterisk
                        label="Password Confirmation"
                        type='password'
                        required
                        {...form.getInputProps('password_confirmation')}
                        style={{ width: '50vw' }}
                        />
                        <TextInput
                        withAsterisk
                        label="Email"
                        type='email'
                        required
                        {...form.getInputProps('email')}
                        style={{ width: '50vw' }}
                        />
                        <TextInput
                        withAsterisk
                        label="Role"
                        required
                        {...form.getInputProps('role')}
                        style={{ width: '50vw' }}
                        />
                        {err && <Text color="red">{err}</Text>}
                        <Button type="submit" color={theme.colors.green[5]}>Create user</Button>
                    </Stack>
                </form>
            </Group>
        </AppShell.Main>
    )
}
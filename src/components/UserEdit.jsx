import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, TextInput, Text, Group, Stack, AppShell, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';
import axiosConfigurated from './axiosConfig';

const editUserSchema = joi.object({
    login: joi.string().required().min(3).max(32).pattern(/^[A-z0-9_]+$/).message({
        "any.required": "Login is required",
        "string.min": "The login must contain at least 3 characters",
        "string.max": "The maximum login length is 32 characters",
        "string.pattern.base": "Login should contain only latin letters, numbers and _"
    }),
    password: joi.string().min(8).max(64).pattern(/^(?=.*[A-Z])[A-z0-9]+$/).message({
        "string.min": "The password must contain at least 8 characters",
        "string.max": "The maximum password length is 64 characters",
        "string.pattern.base": "Passwords should contain only latin letters, numbers and symbols"
    }),
    full_name: joi.string().pattern(/^[A-Za-z]+\s+[A-Za-z]+$/).message({
        "string.pattern.base": "The full name must contain only Latin letters and consist of two words"
    }),
    email: joi.string().email({tlds: { allow: false}}).message({
        "string.email": "Email is not valid"
    }),
    rating: joi.number().messages({
        "number.base": "Rating must be number"
    }),
    role: joi.string().required().valid("user", "admin").messages({
        "any.required": "Role is required",
        "any.only": "Role must be user or admin"
    })
});

export default function UserEdit() {
    const { id } = useParams();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [err, setErr] = useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            login: '',
            password: '',
            full_name: '',
            email: '',
            rating: undefined,
            role: ''
        }
    });

    const handleUserEdit = async (values, event) => {
        event.preventDefault();
        const { login, password, full_name, email, rating, role } = values;
        console.log("Form values:", values);

        let data = new FormData;

        login ? data.append("login", login) : undefined;
        password ? data.append("password", password) : undefined;
        full_name ? data.append("full_name", full_name) : undefined;
        email ? data.append("email", email) : undefined;
        rating ? data.append("rating", rating) : undefined;
        role ? data.append("role", role) : undefined;

        try {
            await axiosConfigurated.patch("/users/" + id, data);
            navigate("/users/");
        } catch (error) {
            if (error.response) {
                setErr(error.response.data.error);
            } else if (error.request) {
                setErr("Server did not respond.");
            }
        }
    };

    return (
        <AppShell.Main>
        <form onSubmit={form.onSubmit(handleUserEdit)}>.
            <Stack spacing="md">
            <TextInput
                label="login"
                {...form.getInputProps('login')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="password"
                type='password'
                {...form.getInputProps('password')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="full_name"
                {...form.getInputProps('full_name')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="email"
                {...form.getInputProps('email')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="rating"
                type='number'
                {...form.getInputProps('rating')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="role"
                {...form.getInputProps('role')}
                style={{ width: '50vw' }}
            />
            {err && <Text color="red">{err}</Text>}
            <Button type="submit" color={theme.colors.green[5]}>Submit</Button>
            </Stack>
        </form>
        </AppShell.Main>
    )
}
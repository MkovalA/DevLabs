import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, TextInput, Text, Anchor, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';

const ResetPasswordSchema = joi.object({
    email: joi.string().required().email({ tlds: { allow: false } }).message({
        "any.required": "Email is required",
        "string.email": "Email is not valid"
    })
});

export default function ResetPassword() {
    const [err, setErr] = React.useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            email: '',
        },

        validate: joiResolver(ResetPasswordSchema),
    });

    const handleReset = async (values, event) => {
        event.preventDefault();
        const { email } = values;

        try {
            const result = await axios.post(
                "http://localhost:5868/api/auth/password-reset",
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (result.data.message) {
                console.log(result.data);
                alert("Check your email");
            }
        } catch (error) {
            if (error.response) {
                setErr(error.response.data.error);
            } else if (error.request) {
                setErr("Server did not respond. Please check your network connection.");
            } else {
                setErr("An unexpected error occurred.");
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleReset)}>
            <Stack spacing="md">
            <TextInput
                withAsterisk
                label="Email"
                type='email'
                required
                {...form.getInputProps('email')}
            />

            {err && <Text color="red">{err}</Text>}
            <Button type="submit">Reset password</Button>
            <Anchor component={Link} to="/login">To login</Anchor>
            </Stack>
        </form>
    )
}
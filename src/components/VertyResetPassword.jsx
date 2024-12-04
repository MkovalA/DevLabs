import React from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Button, TextInput, Text, Anchor, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';

const VertyResetPasswordSchema = joi.object({
  new_password: joi.string().required().min(8).max(64).pattern(/^[A-Za-z0-9\W]+$/).message({
    "any.required": "Password is required",
    "string.min": "The password must contain at least 8 characters",
    "string.max": "The maximum password length is 64 characters",
    "string.pattern.base": "Passwords should contain only latin letters, numbers and symbols"
  })
});

export default function ResetPassword() {
    const { token } = useParams();
    const [err, setErr] = React.useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
          new_password: '',
        },

        validate: joiResolver(VertyResetPasswordSchema),
    });

    const handleReset = async (values, event) => {
        event.preventDefault();
        const { new_password } = values;

        try {
            const result = await axios.post(
                "http://localhost:5868/api/auth/password-reset/" + token,
                { new_password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (result.data.message) {
                console.log(result.data);
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
                label="New password"
                type='password'
                required
                {...form.getInputProps('new_password')}
            />

            {err && <Text color="red">{err}</Text>}
            <Button type="submit">Reset password</Button>
            <Anchor component={Link} to="/login">To login</Anchor>
            </Stack>
        </form>
    )
}
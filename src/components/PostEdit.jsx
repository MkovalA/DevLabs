import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, TextInput, Text, Group, Stack, AppShell, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';
import axiosConfigurated from './axiosConfig';

const editPostSchema = joi.object({
    title: joi.string().min(1).max(128).messages({
        "string.min": "The content must contain at least 1 characters",
        "string.max": "The maximum content length is 128 characters"
    }),
    content: joi.string().min(1).max(65535).messages({
        "string.min": "The content must contain at least 1 characters",
        "string.max": "The maximum content length is 65535 characters"
    }),
    status: joi.string().valid("active", "inactive").messages({
        "any.required": "Status is required",
        "any.only": "Status must be active/inactive"
    })
});

export default function PostEdit() {
    const { id } = useParams();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [err, setErr] = useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            title: '',
            content: '',
            status: '',
        }
    });

    const handlePostEdit = async (values, event) => {
        event.preventDefault();
        const { title, content, status } = values;
        let data = new FormData;

        title ? data.append("title", title) : undefined;
        content ? data.append("content", content) : undefined;
        status ? data.append("status", status) : undefined;


        try {
            await axiosConfigurated.patch("/posts/" + id, data);
            navigate("/posts/" + id);
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
        <form onSubmit={form.onSubmit(handlePostEdit)}>.
            <Stack spacing="md">
            <TextInput
                label="title"
                {...form.getInputProps('title')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="content"
                {...form.getInputProps('content')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="status"
                {...form.getInputProps('status')}
                style={{ width: '50vw' }}
            />
            {err && <Text color="red">{err}</Text>}
            <Button type="submit" color={theme.colors.green[5]}>Submit</Button>
            </Stack>
        </form>
        </AppShell.Main>
    )
}
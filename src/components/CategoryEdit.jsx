import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, TextInput, Text, Group, Stack, AppShell, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';
import axiosConfigurated from './axiosConfig';

const editCategorySchema = joi.object({
    title: joi.string().min(1).max(64).messages({
        "string.min": "The title must contain at least 1 characters",
        "string.max": "The maximum title length is 64 characters"
    }),
    description: joi.string().min(1).max(65535).messages({
        "string.min": "The description must contain at least 1 characters",
        "string.max": "The maximum description length is 65535 characters"
    })
});

export default function CategoryEdit() {
    const { id } = useParams();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [err, setErr] = useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            title: '',
            description: ''
        }
    });

    const handleCategoryEdit = async (values, event) => {
        event.preventDefault();
        const { title, description } = values;
        console.log("Form values:", values);

        let data = new FormData;

        title ? data.append("title", title) : undefined;
        description ? data.append("description", description) : undefined;

        try {
            await axiosConfigurated.patch("/categories/" + id, data);
            navigate("/categories");
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
        <form onSubmit={form.onSubmit(handleCategoryEdit)}>
            <Stack spacing="md">
            <TextInput
                label="title"
                {...form.getInputProps('title')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="description"
                {...form.getInputProps('description')}
                style={{ width: '50vw' }}
            />
            {err && <Text color="red">{err}</Text>}
            <Button type="submit" color={theme.colors.green[5]}>Submit</Button>
            </Stack>
        </form>
        </AppShell.Main>
    )
}
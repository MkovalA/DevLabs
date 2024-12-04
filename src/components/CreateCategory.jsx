import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Text, Stack, Group, AppShell, useMantineTheme, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';
import axiosConfigurated from './axiosConfig';

const createCategorySchema = joi.object({
    title: joi.string().required().min(1).max(64).messages({
        "any.required": "Title is required",
        "string.min": "The title must contain at least 1 characters",
        "string.max": "The maximum title length is 64 characters"
    })
});

export default function CreateCategory() {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [err, setErr] = React.useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            title: ''
        },

        validate: joiResolver(createCategorySchema),
    });

    const handleCategory = async (values, event) => {
        event.preventDefault();
        const { title } = values;

        try {
            await axiosConfigurated.post("/categories",
                { title}
            );
            navigate("/categories");
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
                <Title>Create category</Title>
            </Group>
            <Group style={{ border: "1px solid #dedede", padding: "15px"}}>
                <form onSubmit={form.onSubmit(handleCategory)}>
                    <Stack spacing="md">
                        <TextInput
                        withAsterisk
                        label="Title"
                        required
                        {...form.getInputProps('title')}
                        style={{ width: '50vw' }}
                        />
                        {err && <Text color="red">{err}</Text>}
                        <Button type="submit" color={theme.colors.green[5]}>Create category</Button>
                    </Stack>
                </form>
            </Group>
        </AppShell.Main>
    )
}
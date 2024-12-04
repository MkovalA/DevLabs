import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Text, Stack, MultiSelect, Textarea, Group, Container, AppShell, useMantineTheme, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';
import axiosConfigurated from './axiosConfig';
import { useEffect } from 'react';

const createPostSchema = joi.object({
    title: joi.string().required().min(1).max(128).messages({
        "any.required": "Content is required",
        "string.min": "The content must contain at least 1 characters",
        "string.max": "The maximum content length is 128 characters"
    }),
    content: joi.string().required().min(1).max(65535).messages({
        "any.required": "Content is required",
        "string.min": "The content must contain at least 1 characters",
        "string.max": "The maximum content length is 65535 characters"
    }),
    categories: joi.array().required().min(1).unique().items(joi.string()).messages({
        "any.required": "Categories is required",
        "array.min": "Post must contain at least 1 category",
        "array.unique": "All categiries must be unique"
    })
});

export default function CreatePost() {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [err, setErr] = React.useState(null);
    const [categories, setCategories] = React.useState([]);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            title: '',
            content: '',
            categories: []
        },

        validate: joiResolver(createPostSchema),
    });

    useEffect(() => {
        const getCategory = async () => {
          try {
            const result = await axiosConfigurated.get("/categories");
            result.data = result.data.map((category) => category.title);
            setCategories(result.data);
          } catch (error) {
            console.error("Failed to check admin status:", error);
          }
        };
    
        getCategory();
    }, []);

    const handlePost = async (values, event) => {
        event.preventDefault();
        const { title, content, categories } = values;
        console.log(title, content, categories);

        try {
            await axiosConfigurated.post("/posts",
                { title, content, categories}
            );
            navigate("/posts");
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
                <Title>Ask question</Title>
            </Group>
            <Group style={{ border: "1px solid #dedede", padding: "15px"}}>
                <form onSubmit={form.onSubmit(handlePost)}>
                    <Stack spacing="md">
                        <TextInput
                        withAsterisk
                        label="Title"
                        required
                        {...form.getInputProps('title')}
                        style={{ width: '50vw' }}
                        />
                        <Textarea
                        withAsterisk
                        label="Content"
                        required
                        {...form.getInputProps('content')}
                        style={{ width: '50vw'}}
                        />
                        <MultiSelect
                        searchable
                        data={categories}
                        label="Select categories"
                        required
                        {...form.getInputProps('categories')}
                        style={{ width: '50vw' }}
                        />
                        {err && <Text color="red">{err}</Text>}
                        <Button type="submit" color={theme.colors.green[5]}>Create question</Button>
                    </Stack>
                </form>
            </Group>
        </AppShell.Main>
    )
}
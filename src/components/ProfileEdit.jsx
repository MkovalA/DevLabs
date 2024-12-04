import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextInput, Text, Group, Stack, AppShell, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import joi from 'joi';
import { joiResolver } from 'mantine-form-joi-resolver';
import axiosConfigurated from './axiosConfig';

const editProfileSchema = joi.object({
    title: joi.string().min(1).max(128).messages({
        "string.min": "The content must contain at least 1 characters",
        "string.max": "The maximum content length is 128 characters"
    }),
    content: joi.string().min(1).max(65535).messages({
        "string.min": "The content must contain at least 1 characters",
        "string.max": "The maximum content length is 65535 characters"
    }),
    categories: joi.array().min(1).unique().items(joi.string()).messages({
        "array.min": "Post must contain at least 1 category",
        "array.unique": "All categiries must be unique"
    }),
    status: joi.string().valid("active", "inactive").messages({
        "any.required": "Status is required",
        "any.only": "Status must be active/inactive"
    })
});

export default function ProfileEdit() {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [err, setErr] = useState(null);

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
            password: '',
            password_confirmation: '',
            full_name: '',
            email: '',
            avatar: null
        }
    });

    const handleProfileEdit = async (values, event) => {
        event.preventDefault();
        const { password, password_confirmation, full_name, email, avatar } = values;
        console.log("Form values:", values);

        let data = new FormData;

        title ? data.append("password", password) : undefined;
        content ? data.append("password_confirmation", password_confirmation) : undefined;
        categories ? data.append("full_name", full_name) : undefined;
        status ? data.append("email", email) : undefined;

        try {
            await axiosConfigurated.patch("/users", data);
            if (avatar) {
                await axiosConfigurated.patch("/users/0/avatar", { avatar }, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }
            navigate("/profile");
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
        <form onSubmit={form.onSubmit(handleProfileEdit)}>.
            <Stack spacing="md">
            <TextInput
                label="Password"
                type='password'
                {...form.getInputProps('password')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="Password confirmation"
                type='password'
                {...form.getInputProps('password_confirmation')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="Full name"
                {...form.getInputProps('full_name')}
                style={{ width: '50vw' }}
            />
            <TextInput
                label="Email"
                {...form.getInputProps('email')}
                style={{ width: '50vw' }}
            />
            <Dropzone
            onDrop={(files) => {
                form.setFieldValue('avatar', files[0]);
            }}
            accept={['image/png', 'image/jpeg']}
            maxSize={5 * 1024 ** 2}
            style={{ width: '50vw', border: "2px dashed " + theme.colors.blue[6] }}
            disabled={!!form.values.avatar}
            >
            <Group justify="center">
                <Dropzone.Accept>
                    <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconCloudUpload size={50} stroke={1.5} />
                </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="lg" mt="xl">
                <Dropzone.Accept>Drop files here</Dropzone.Accept>
                <Dropzone.Reject>PNG, JPG file less than 5mb</Dropzone.Reject>
                <Dropzone.Idle>Upload resume</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
                Drag&apos;n&apos;drop files here to upload. We can accept only <i>.png, .jpg</i> files that are less than 5mb in size.
            </Text>
            </Dropzone>
            {err && <Text color="red">{err}</Text>}
            <Button type="submit" color={theme.colors.green[5]}>Submit</Button>
            </Stack>
        </form>
        </AppShell.Main>
    )
}
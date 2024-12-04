import React from 'react';
import { AppShell, Title, Card, Group, Button, List, useMantineTheme } from '@mantine/core';
import axiosConfigurated from './axiosConfig';
import { Link } from 'react-router-dom';

export default function AllUsers() {
  const [result, setResult] = React.useState(null);
  const theme = useMantineTheme();

  React.useEffect(() => {
    axiosConfigurated.get("/users/")
      .then(async (response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
      <AppShell.Main>

        <Group style={{ width: '100%', padding: '10px', height: '15vh', display: "flex", justifyContent: "Center", verticalAlign: "Center"}} position="apart" >
          <Title>All users</Title>
        </Group>
        <Group>
          <Group>
          {result && result.map((user) => {
          return (
          <Card shadow="sm" padding="lg" radius="md" withBorder color='primaryBlue' key={user.id}>
            <Group position="apart">
              <Title order={3}>
                {user.login}
              </Title>
            </Group>

            <List
            spacing="xs"
            size="sm">
            <List.Item>Full name: {user.full_name}</List.Item>
            <List.Item>Email: {user.email}</List.Item>
            <List.Item>Verification email: {user.verification_email}</List.Item>
            <List.Item>Profile picture: {user.profile_picture}</List.Item>
            <List.Item>Rating: {user.rating}</List.Item>
            <List.Item>Role: {user.role}</List.Item>
            </List>
            <Group>
              <Link to={"/user-edit/" + user.id}><Button color={theme.colors.green[5]}>Edit user</Button></Link>
              <Link to={"/user-delete/" + user.id}><Button color={theme.colors.red[5]}>Delete user</Button></Link>
            </Group>
          </Card>
          );
          })}
          </Group>
        </Group>
      </AppShell.Main>
  );
}

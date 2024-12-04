import React from 'react';
import { AppShell, Title, Card, Group, Button, List, useMantineTheme } from '@mantine/core';
import axiosConfigurated from './axiosConfig';
import { Link } from 'react-router-dom';

export default function AllCategories() {
  const [result, setResult] = React.useState(null);
  const theme = useMantineTheme();

  React.useEffect(() => {
    axiosConfigurated.get("/categories/")
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
          <Title>All categories</Title>
        </Group>
        <Group style={{ width: '100%' }}>
          {result && result.map((categories) => {
          return (
          <Card shadow="sm" padding="lg" radius="md" withBorder color='primaryBlue' style={{ width: '100%' }} key={categories.id}>
            <Group position="apart">
              <Title order={3}>
                {categories.title}
              </Title>
            </Group>

            <List
            spacing="xs"
            size="sm">
            <List.Item>Id: {categories.id}</List.Item>
            <List.Item>description: {categories.description}</List.Item>
            </List>
            <Group>
              <Link to={"/category-edit/" + categories.id}><Button color={theme.colors.green[5]}>Edit</Button></Link>
              <Link to={"/category-delete/" + categories.id}><Button color={theme.colors.red[5]}>Delete</Button></Link>
            </Group>
          </Card>
          );
          })}
        </Group>
      </AppShell.Main>
  );
}

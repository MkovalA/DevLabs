import React from 'react';
import { AppShell, Title, Text, Card, Group, Stack, Avatar, List, useMantineTheme, Badge, Button} from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import axiosConfigurated from './axiosConfig';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [result, setResult] = React.useState(null);
  const theme = useMantineTheme();

  React.useEffect(() => {
    axiosConfigurated
      .get('/users/0')
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  if (!result) {
    return (
      <AppShell.Main>
        <Text align="center" size="lg" color="dimmed">
          Завантаження...
        </Text>
      </AppShell.Main>
    );
  }

  return (
    <AppShell.Main>
      <Card
        shadow="lg"
        padding="xl"
        radius="lg"
        withBorder
        style={{
          backgroundColor: theme.colors.gray[2]
        }}
      >
        <Stack spacing="md" align="center">
          <Avatar
            src={result.profile_picture}
            size="lg"
            style={{ border: "2px solid " + theme.colors.green[6] }}
          />
          <Title order={1} align="center" style={{ color: theme.colors.blue1[6] }}>
            {result.login}
          </Title>

          <List spacing="xs" center>
            <List.Item>
              <Text color="dimmed">Email: {result.email}</Text>
            </List.Item>
            <List.Item>
              <Text color="dimmed">Role: {result.role}</Text>
            </List.Item>
            <List.Item>
              <Text color="dimmed">Full name: {result.full_name}</Text>
            </List.Item>
          </List>

          <Badge
            color="green"
            size="lg"
            leftSection={<IconStar size={14} />}
          >
            Rating: {result.rating}
          </Badge>
          <Link to="/profile-edit"><Button>Edit profile</Button></Link>
        </Stack>
        
      </Card>
    </AppShell.Main>
  );
}

import { useEffect, useState } from 'react';
import { AppShell, Title, Text, Card, Group, Stack, Avatar, useMantineTheme, Textarea, Button} from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import axiosConfigurated from './axiosConfig';
import { Link, useParams } from 'react-router-dom';

export default function PostInf() {
  const [result, setResult] = useState(null);
  const [comments, setComments] = useState(null);
  const [userData, setUserData] = useState({});
  const [newComment, setNewComment] = useState('');
  const id = useParams().id;
  const theme = useMantineTheme();

  async function getUserData(id) {
    try {
      const result = await axiosConfigurated.get("/users/" + id);
      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function updateComments() {
    axiosConfigurated.get('/posts/' + id + '/comments').then(async (response) => {
      setComments(response.data);
      const comments = response.data;

      const userPromises = comments.map(comment => getUserData(comment.author));
      const users = await Promise.all(userPromises);
      const userMap = users.reduce((acc, user, i) => {
        acc[comments[i].author] = user.data;
        return acc;
      }, {});

      setUserData(userMap);
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    axiosConfigurated.get('/posts/' + id).then(async (response) => {
      setResult(response.data);
    }).catch((error) => {
      console.error('Error:', error);
    });

    updateComments();
  }, []);

  if (!result) {
    return (
      <AppShell.Main>
        <Text align="center" size="lg" color="dimmed">
          Loading...
        </Text>
      </AppShell.Main>
    );
  }

  const handleCreateComment = async () => {
    try {
      await axiosConfigurated.post('/posts/' + id + '/comments', { content: newComment });
      updateComments();
      setNewComment('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <AppShell.Main>
      <Group
        shadow="lg"
        padding="xl"
        radius="lg"
        style={{
          backgroundColor: theme.colors.gray[2]
        }}>
        <Stack spacing="md" align="center">
          <Title order={1} align="center" style={{ color: theme.colors.blue1[6] }}>
            {result.title}
          </Title>
          <Text>{result.publish_date}</Text>
          <Text>{result.content}</Text>
        </Stack>
        <Stack>
          <Title order={4} style={{ color: theme.colors.blue1[6] }}>
            Comments
          </Title>
          {comments && comments.map((comment) => {
            const user = userData[comment.author];
            if (!user) {
              return <Text key={comment.id}>Loading user data...</Text>;
            }
            return (
              <Card key={comment.id}>
                <Avatar src={user.avatar}/>
                <Text align="left" size="lg"> {user.login} </Text>
                <Text align="left">{comment.content}</Text>
              </Card>
            );
          })}
        </Stack>
        <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            style={{ width: '100%' }}
          />
        <Button onClick={handleCreateComment} align="left">
          Submit Comment
        </Button>
      </Group>
      
    </AppShell.Main>
  );
}

import React from 'react';
import { AppShell, Stack, Title, Text, Card, Group, Badge, useMantineTheme, Pagination, TextInput, ActionIcon, Button, Select } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import axiosConfigurated from './axiosConfig';
import { Link } from 'react-router-dom';
import { IconClockHour5, IconStar, IconSearch, IconArrowRight, IconThumbUp } from '@tabler/icons-react';

export default function AllPost() {
  const [result, setResult] = React.useState(null);
  const [total, setTotal] = React.useState(0);
  const [current, setCurrent] = React.useState(1);
  const [userData, setUserData] = React.useState({});
  const [categories, setCategories] = React.useState({});
  const [AllCategories, setAllCategories] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('');
  const [selectStatus, setSelectStatus] = React.useState('');
  const [selectCategory, setSelectCategory] = React.useState('');
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const [likedPosts, setLikedPosts] = React.useState({});
  const theme = useMantineTheme();

  const handleButtonClick = () => {
    console.log('Поточне значення:', value);
  };

  async function getUserData(id) {
    try {
      const result = await axiosConfigurated.get("/users/" + id);
      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function categoryPost(id) {
    try {
      const result = await axiosConfigurated.get("/posts/" + id + "/categories/");
      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  React.useEffect(() => {
    axiosConfigurated.get("/posts/?page=" + current + "&limit=10" + (sortOrder ? "&sort=date" : '') + (selectStatus ? "&status=" + selectStatus : '' ) +
       (selectCategory ? "&categories=" + [selectCategory] : '')).then(async (response) => {
        const posts = response.data.posts;
        
        const userPromises = posts.map(post => getUserData(post.author));
        const categoryPromises = posts.map(post => categoryPost(post.id));

        const users = await Promise.all(userPromises);
        const categories = await Promise.all(categoryPromises);

        const userMap = users.reduce((acc, user, i) => {
          acc[posts[i].author] = user.data;
          return acc;
        }, {});
        const categoryMap = categories.reduce((acc, category, i) => {
          acc[posts[i].id] = category.data;
          return acc;
        }, {});

        setUserData(userMap);
        setCategories(categoryMap);
        setResult(response.data.posts);
        setTotal(response.data.count);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    axiosConfigurated.get("/categories/").then((response) => {
      console.log("Response:", response);
      response.data.map((item) => {
        item.value = item.title;
        item.label = item.title;
      });
      setAllCategories(response.data);
    }).catch((error) => {
      console.error("Error:", error);
    });
  }, [current, sortOrder, selectStatus, selectCategory]);

  const handlePageChange = (page) => {
    setCurrent(page);
  };

  const handleSortChange = (sort) => {
    setSortOrder(sort);
  }

  const handleStatusChange = (status) => {
    setSelectStatus(status);
  }

  const handleCategoryChange = (category) => {
    setSelectCategory(category);
  }

  return (
      <AppShell.Main>
        <Group style={{ width: '100%', padding: '10px', height: '15vh', display: "flex", justifyContent: "Center", verticalAlign: "Center"}} position="apart" >
          <Title>All Post</Title>
        </Group>
        <Group style={{ width: '100%' }}>
          <TextInput style={{ flex: 1 }}
          radius="md"
          size="lg"
          placeholder="Search questions"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rightSectionWidth={42}
          leftSection={<IconSearch size={18} stroke={1.5} />}
          rightSection={
          <ActionIcon size={32} radius="xl" color={theme.colors.green[5]} variant="filled" onClick={handleButtonClick}>
            <IconArrowRight size={18} stroke={1.5} />
          </ActionIcon>}
          />
          <Link to="/create-post">
            <Button size={isSmallScreen ? 'sm' : 'lg'} color={theme.colors.green[7]} >
              Ask a question
            </Button>
          </Link>
          </Group>
          <Group style={{ width: '100%' }}>
            <Select placeholder='Select status' value={selectStatus} onChange={handleStatusChange} data={[{value: "active", label: "Active"}, {value: "Inactive", label: "Inactive"}]}/>
            <Select placeholder='Select categoties' value={selectCategory} onChange={handleCategoryChange} data={AllCategories}/>
            <Select placeholder='Sort by' value={sortOrder} onChange={handleSortChange} data={[{value: "", label: "Likes"}, {value: "date", label: "Date"}]}/>
        </Group>
        <Stack>
          {result && result.map((post) => {
          const user = userData[post.author];
          const category = categories[post.id];
          console.log('User:', user);
          console.log('Category:', category);
          return (
          <Card shadow="sm" padding="lg" radius="md" withBorder color='primaryBlue' key={post.id}>
            <Group position="apart">
              <Link to={"/posts/" + post.id}><Title order={3}>{post.title}</Title></Link>
              {post.status === 'active' ? <Badge color="green" variant="filled"> Active </Badge> : <Badge color="red" variant="filled">Inactive</Badge>}
            </Group>

            <Group>
              <Text lineClamp={2} color='dimmed'>{post.content}</Text>
            </Group>
      
            <Group mt="sm" spacing="xs">
              <Text><IconClockHour5 size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />{user.login} published {post.publish_date}</Text>
              <Text color={theme.colors.yellow[7]}>{post.like_count} likes</Text>
            </Group>
              
            <Group>
              {Array.isArray(category) ? (
                category.map((item, index) => (
                <Badge key={index} color="green" variant="light">
                  {item.title}
                </Badge>
              ))
              ) : (
              <Badge color="green" variant="light">
                {category}
              </Badge>
              )}
            </Group>

          </Card>
          );
          })}
          <Pagination total={total} page={current} onChange={handlePageChange} />
        </Stack>
      </AppShell.Main>
  );
}

import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { Burger, Group, TextInput, ActionIcon, useMantineTheme, AppShell, Title, Avatar, Text, Button } from '@mantine/core';
import classes from '../css/header.module.css';
import { useState, useEffect } from 'react';
import axiosConfigurated from './axiosConfig';
import { Link } from 'react-router-dom';


export default function Header({ opened, toggle }) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const theme = useMantineTheme();

  const handleButtonClick = () => {
    console.log('Поточне значення:', value);
  };

  useEffect(() => {
    axiosConfigurated.get("/users/0").then((response) => {
      console.log("Response:", response);
      setResult(response.data);
    }).catch((error) => {
      console.error("Error:", error);
    });
  }, []);

  return (
    <AppShell.Header style={{ backgroundColor: theme.colors.blue1[7],display: "flex", justifyContent: "space-between", alignItems: "center", height: "80px", padding: "10px"}}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <TextInput
          radius="xl"
          size="md"
          placeholder="Search questions"
          value={value}
          className={classes.search}
          onChange={(event) => setValue(event.target.value)}
          rightSectionWidth={42}
          leftSection={<IconSearch size={18} stroke={1.5} />}
          rightSection={
          <ActionIcon size={32} radius="xl" color={theme.colors.green[5]} variant="filled" onClick={handleButtonClick}>
            <IconArrowRight size={18} stroke={1.5} />
          </ActionIcon>}
          />
        </Group>

        <Group>
          {result ? (
            <>
              <Link to="/profile"><Avatar src={result.profile_picture}/></Link><Text style={{ color: "white"}}>Welcome, {result.login}. Role: {result.role}</Text>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </Group>

    </AppShell.Header>
  );
}
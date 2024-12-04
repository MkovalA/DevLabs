import React from 'react';
import { AppShell, Title, Group, Button } from '@mantine/core';
import { useParams, Link } from 'react-router-dom';
import axiosConfigurated from './axiosConfig';


export default function CategoryDelete() {
    const { id } = useParams();
  
    React.useEffect(() => {
      axiosConfigurated.delete("/categories/" + id)
        .then(async (response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, []);
  
    return (
        <AppShell.Main>
            <Group style={{ width: '100%', padding: '10px', height: '15vh', display: "flex", justifyContent: "Center", verticalAlign: "Center"}} position="apart" >
                <Title>Category deleted</Title>
                <Link to="/categories"><Button>All categories</Button></Link>
            </Group>
        </AppShell.Main>
    );
  }
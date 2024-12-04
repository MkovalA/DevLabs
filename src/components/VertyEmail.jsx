import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Text } from '@mantine/core';

export default function VertyEmail() {3
  const { token } = useParams();

  React.useEffect(() => {
    console.log("Received token:", token);
  
    axios.get("http://localhost:5868/api/auth/register/" + token)
      .then((response) => {
        console.log("Response:", response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [token]);
  return <Text>Email verified</Text>;
}
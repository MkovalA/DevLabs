import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  autoContrast: true,
  fontFamily: "Poppins",
  colors: {
    blue1: [
      "#eff3fa",
      "#dde4ef",
      "#b7c6e0",
      "#8fa7d2",
      "#6d8cc7",
      "#587bc0",
      "#4c73be",
      "#3d62a8",
      "#345796",
      "#284b86"
    ],
    blue2: [
      "#e9f3ff",
      "#d2e2fc",
      "#a3c1f7",
      "#719ff3",
      "#4882ef",
      "#3070ee",
      "#2367ee",
      "#1657d5",
      "#0b4dbf",
      "#0042a9"
    ],
    green: [
      "#e5fef3",
      "#d4f8e8",
      "#aceed1",
      "#80e3b9",
      "#5cdba4",
      "#44d597",
      "#35d38f",
      "#24ba7b",
      "#16a66c",
      "#00905b"
    ]
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
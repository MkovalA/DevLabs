import { AppShell, useMantineTheme, Text } from '@mantine/core';

export default function Footer() {
  const theme = useMantineTheme();

  return (
    <AppShell.Footer style={{ backgroundColor: theme.colors.blue1[8] }}>
      <Text style={{ color: "white", padding: "10px"}}>DevLabs by mkoval</Text>
    </AppShell.Footer>
  );
}
import { Title, AppShell, useMantineTheme, Group, Text } from '@mantine/core';
import { checkAdmin } from './ProtectedRoutes';
import { Link } from 'react-router-dom';
import classes from '../css/navBar.module.css';
import { useEffect, useState } from 'react';

const dataAdmin = [
  {label: 'Main', link: '/'},
  {label: 'Own posts', link: '/own-posts'},
  {label: 'All Users', link: '/users'},
  {label: 'Create user', link: '/create-user'},
  {label: 'All posts', link: '/posts'},
  {label: 'Create posts', link: '/create-post'},
  {label: 'All categoties', link: '/categories'},
  {label: 'Create category', link: '/create-category'}
];

const dataUser = [
  {label: 'Main', link: '/'},
  {label: 'Own posts', link: '/own-posts'},
  {label: 'All posts', link: '/posts'},
  {label: 'Create posts', link: '/create-post'}
];


export default function NavBar() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [activeLink, setActiveLink] = useState("Main");

  useEffect(() => {
    const roleCheck = async () => {
      try {
        const isAdmin = await checkAdmin();
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
      }
    };

    roleCheck();
  }, []);

  if (isAdmin === null) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </div>
    );
  }

  const linksdata = isAdmin ? dataAdmin : dataUser;

  const links = linksdata.map((link) => (
    <Link
      to={link.link}
      key={link.label}
      className={classes.link}
      data-active={activeLink === link.label || undefined}
      onClick={() => setActiveLink(link.label)}
    >
      {link.label}
    </Link>
  ));

  return (
    <AppShell.Navbar style={{ backgroundColor: "#172b4d" }}>
      <Group>
        <Title style={{ color: "white", padding: "10px" }}>DevLabs</Title>
      </Group>
      {links}
      <Link to="/logout" className={classes.link} style={{ marginTop: "auto" }}>Logout</Link>
    </AppShell.Navbar>
  );
}


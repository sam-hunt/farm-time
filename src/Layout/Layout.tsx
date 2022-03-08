import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Nav from '../Nav/Nav';

const Layout = () => (
    <div>
        <Nav />
        <Container>
            <main>
                <Outlet />
            </main>
        </Container>
    </div>
);

export default Layout;

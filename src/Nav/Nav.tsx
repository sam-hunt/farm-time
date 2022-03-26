import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Icon from '@mdi/react'
import { mdiBackupRestore, mdiBrightness4, mdiBrightness7, mdiCalendar, mdiMenu, mdiSigma } from '@mdi/js';
import { MouseEventHandler, useContext, useState } from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../App/App';

const Nav = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { currentTheme, toggleTheme } = useContext(ThemeContext);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        id='basic-button'
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}

                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{ mr: 2 }}
                    >
                        <Icon path={mdiMenu}
                            title='Menu'
                            size={1}
                        />
                    </IconButton>
                    <Menu
                        id='basic-menu'
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem component={Link} to={'/calendar'} onClick={handleClose}>
                            <ListItemIcon>
                                <Icon path={mdiCalendar}
                                    title='Menu'
                                    size={1}
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Calendar
                            </ListItemText>
                        </MenuItem>
                        <MenuItem component={Link} to={'/reports'} onClick={handleClose}>
                            <ListItemIcon>
                                <Icon path={mdiSigma}
                                    title='Menu'
                                    size={1}
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Reports
                            </ListItemText>
                        </MenuItem>
                        <MenuItem component={Link} to={'/backup-restore'} onClick={handleClose}>
                            <ListItemIcon>
                                <Icon path={mdiBackupRestore}
                                    title='Menu'
                                    size={1}
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Backup/Restore
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                    <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                        Farm Time
                    </Typography>
                    <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                        {currentTheme === 'light'
                            ? <Icon path={mdiBrightness4} title='Menu' size={1} />
                            : <Icon path={mdiBrightness7} title='Menu' size={1} />
                        }
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Nav;

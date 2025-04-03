import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Chat, History, Settings } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  // 根据当前路径设置底部导航的激活项
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') setValue(0);
    else if (path.startsWith('/chat')) setValue(1);
    else if (path === '/history') setValue(2);
    else if (path === '/manage') setValue(3);
  }, [location]);

  const menuItems = [
    { text: '首页', icon: <Home />, path: '/' },
    { text: '对话', icon: <Chat />, path: '/chat' },
    { text: '记录', icon: <History />, path: '/history' },
    { text: '管理', icon: <Settings />, path: '/manage' },
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          overflow: 'auto',
          pt: 2, // 顶部留出空间
          pb: 9, // 底部为导航栏留出空间
          px: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>

      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          bgcolor: 'rgba(32, 32, 32, 0.8)',
          backdropFilter: 'blur(10px)',
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(menuItems[newValue].path);
          }}
          showLabels
          sx={{
            bgcolor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 8px',
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#FFFFFF',
              },
            },
          }}
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.text}
              label={item.text}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout; 
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Chat as ChatIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  VpnKey as VpnKeyIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

const Profile: React.FC = () => {
  // 模拟用户数据
  const userData = {
    username: '用户昵称',
    avatar: '/images/user-avatar.jpg',
    remainingChats: 25,
    totalChats: 30,
  };

  const menuItems = [
    { text: '对话记录', icon: <HistoryIcon />, path: '/history' },
    { text: '账号设置', icon: <SettingsIcon />, path: '/settings' },
    { text: '修改密码', icon: <VpnKeyIcon />, path: '/change-password' },
    { text: '帮助与反馈', icon: <HelpIcon />, path: '/help' },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      {/* 用户信息卡片 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={userData.avatar}
            sx={{ width: 80, height: 80, mr: 2, border: '2px solid white' }}
          />
          <Box>
            <Typography variant="h5" gutterBottom>
              {userData.username}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              剩余对话次数：{userData.remainingChats}/{userData.totalChats}
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(userData.remainingChats / userData.totalChats) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'white',
            },
          }}
        />
      </Paper>

      {/* 充值按钮 */}
      <Button
        variant="contained"
        fullWidth
        sx={{ mb: 3, py: 1.5 }}
        onClick={() => {/* 处理充值逻辑 */}}
      >
        充值对话次数
      </Button>

      {/* 菜单列表 */}
      <Paper elevation={0}>
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItem button onClick={() => {/* 处理导航逻辑 */}}>
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                <ListItemSecondaryAction>
                  <ChatIcon sx={{ color: 'text.secondary' }} />
                </ListItemSecondaryAction>
              </ListItem>
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* 退出登录按钮 */}
      <Button
        variant="outlined"
        color="error"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => {/* 处理退出登录逻辑 */}}
      >
        退出登录
      </Button>
    </Box>
  );
};

export default Profile; 
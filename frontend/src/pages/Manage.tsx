import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  LinearProgress,
  Switch,
} from '@mui/material';
import {
  VpnKey as VpnKeyIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const Manage: React.FC = () => {
  // 模拟用户数据
  const userData = {
    username: '用户昵称',
    remainingChats: 25,
    totalChats: 30,
  };

  const settingsItems = [
    { 
      text: '通知设置', 
      icon: <NotificationsIcon />, 
      secondaryText: '消息提醒设置',
      hasSwitch: true 
    },
    { 
      text: '隐私设置', 
      icon: <SecurityIcon />, 
      secondaryText: '管理隐私选项',
      hasSwitch: false 
    },
    { 
      text: '充值记录', 
      icon: <PaymentIcon />, 
      secondaryText: '查看充值历史',
      hasSwitch: false 
    },
    { 
      text: '修改密码', 
      icon: <VpnKeyIcon />, 
      secondaryText: '更改登录密码',
      hasSwitch: false 
    },
    { 
      text: '帮助与反馈', 
      icon: <HelpIcon />, 
      secondaryText: '获取帮助或提供反馈',
      hasSwitch: false 
    },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* 用户信息卡片 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {userData.username}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            剩余对话次数：{userData.remainingChats}/{userData.totalChats}
          </Typography>
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
        sx={{ mb: 3, py: 1.5, borderRadius: 2 }}
        onClick={() => {/* 处理充值逻辑 */}}
      >
        充值对话次数
      </Button>

      {/* 设置列表 */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <List>
          {settingsItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItem>
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  secondary={item.secondaryText}
                />
                <ListItemSecondaryAction>
                  {item.hasSwitch ? (
                    <Switch color="primary" />
                  ) : null}
                </ListItemSecondaryAction>
              </ListItem>
              {index < settingsItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* 退出登录按钮 */}
      <Button
        variant="outlined"
        color="error"
        fullWidth
        sx={{ mt: 3, mb: 2, borderRadius: 2 }}
        onClick={() => {/* 处理退出登录逻辑 */}}
      >
        退出登录
      </Button>
    </Box>
  );
};

export default Manage; 
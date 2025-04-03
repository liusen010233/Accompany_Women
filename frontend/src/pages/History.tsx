import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 模拟对话记录数据
const historyData = [
  {
    id: 1,
    characterName: '温柔总裁',
    characterAvatar: '/images/characters/ceo.jpg',
    lastMessage: '今天工作辛苦了，要好好休息。',
    timestamp: '2024-04-02 20:30',
    messageCount: 42,
  },
  {
    id: 2,
    characterName: '阳光学长',
    characterAvatar: '/images/characters/senior.jpg',
    lastMessage: '下次篮球赛我们一定能赢！',
    timestamp: '2024-04-02 18:15',
    messageCount: 28,
  },
  // 更多对话记录...
];

const History: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredHistory = historyData.filter(
    (history) =>
      history.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      history.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 2,
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.default',
          zIndex: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索对话记录..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <List sx={{ bgcolor: 'background.paper' }}>
        {filteredHistory.map((history, index) => (
          <React.Fragment key={history.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 处理删除逻辑
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="continue"
                    onClick={() => navigate(`/chat/${history.id}`)}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              }
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => navigate(`/chat/${history.id}`)}
            >
              <ListItemAvatar>
                <Avatar
                  alt={history.characterName}
                  src={history.characterAvatar}
                  sx={{ width: 50, height: 50, mr: 1 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="subtitle1" component="span">
                      {history.characterName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {history.timestamp}
                    </Typography>
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{
                        display: 'block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {history.lastMessage}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      共 {history.messageCount} 条对话
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < filteredHistory.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default History; 
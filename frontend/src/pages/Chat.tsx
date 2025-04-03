import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Tooltip,
  keyframes,
  createTheme,
  ThemeProvider,
  Collapse,
  Zoom,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Switch,
  Slider,
  Divider,
  List,
  ListItem,
  ListSubheader,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MusicNote as MusicNoteIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  PlayArrow as PlayArrowIcon,
  Call as CallIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Wallpaper as WallpaperIcon,
  VolumeUp as SoundIcon,
  PlayCircle as PlayCircleIcon,
} from '@mui/icons-material';

// 定义深色主题
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: 'rgba(32, 32, 32, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

// 定义气泡动画
const bubbleAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface Message {
  id: number;
  content?: string;  // 可选，用于用户消息
  narration?: string[];  // 旁白
  dialogue?: string;     // 角色说话
  thoughts?: string;     // 角色心声
  sender: 'user' | 'character';
  timestamp: Date;
  isVoiceLoading?: boolean;
}

interface CharacterInfo {
  id: string;
  name: string;
  avatar: string;
  introduction: string;
  backgroundStory: string;
  height: string;
  age: number;
  connections: number;
  openingMessage: {
    content: string;
    sceneDescription?: string;
    actionDescription?: string;
  };
}

interface VoiceConfig {
  dialogueVoice: string;  // 说话声音配置
  narrationVoice: string; // 旁白声音配置
  thoughtsVolumeReduction: number; // 心声音量降低的分贝数
}

const Chat: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const [showMessages, setShowMessages] = useState(true);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [characterInfo] = useState<CharacterInfo>({
    id: '1',
    name: '罗峻雪',
    avatar: '/images/characters/ceo.jpg',
    introduction: '极为顽劣的财阀小少爷,少年细腰,雪发花眸,有一半的日耳曼血统,小名schlanke Schöne.(细腰美人)',
    backgroundStory: '一度想把自己的名字改为罗素腰,但是被母亲强烈反对...',
    height: '188cm',
    age: 27,
    connections: 794000,
    openingMessage: {
      content: '你这个可爱的小野猫',
      sceneDescription: '（纸醉金迷,素手执杯,纸牌骰子,冰冷的珠宝映着富贵浮华的颜色,水蛇般的身躯慵懒倚靠）',
      actionDescription: '（少年半靠在沙发里，身边簇拥着一群男生，有人喝酒有人递烟，他低着头把玩着长链手机，睫毛颤颤的，樱花色的薄唇被酒液浸润，透着一股无辜的艳色）',
    }
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const characterImageRef = useRef<HTMLImageElement>(null);
  const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout>();
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isBackgroundDialogOpen, setIsBackgroundDialogOpen] = useState(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState(false);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(50);
  const [voiceSettings, setVoiceSettings] = useState({
    dialogue: true,
    thoughts: false,
    narration: false,
  });
  const [nickname, setNickname] = useState<string>('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const [voiceConfig] = useState<VoiceConfig>({
    dialogueVoice: 'voice1',  // 示例声音配置
    narrationVoice: 'voice2',
    thoughtsVolumeReduction: 3, // 降低3分贝
  });

  const checkIfNearBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollHeight, scrollTop, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(distanceFromBottom < 500);
    }
  };

  const handleUserScroll = () => {
    setIsUserScrolling(true);
    
    // Clear any existing timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    
    // Reset the user scrolling state after 150ms of no scroll events
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 150);
    
    checkIfNearBottom();
  };

  const scrollToBottom = () => {
    // 只有在不是播放语音的情况下，且在底部500px范围内时才自动滚动
    if (isNearBottom && !isVoicePlaying) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 监听消息区域的滚动事件
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleUserScroll);
      return () => {
        container.removeEventListener('scroll', handleUserScroll);
        if (userScrollTimeoutRef.current) {
          clearTimeout(userScrollTimeoutRef.current);
        }
      };
    }
  }, []);

  // 监听消息变化
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // 只在新消息（非语音状态更新）时检查是否需要滚动
      if (!lastMessage.isVoiceLoading) {
        scrollToBottom();
      }
    }
  }, [messages, isNearBottom]);

  useEffect(() => {
    // Add opening message and example responses when component mounts
    setMessages([
      {
        id: 1,
        narration: [
          "纸醉金迷，素手执杯，纸牌骰子，冰冷的珠宝映着富贵浮华的颜色，水蛇般的身躯慵懒倚靠",
          "少年半靠在沙发里，身边簇拥着一群男生，有人喝酒有人递烟，他低着头把玩着长链手机，睫毛颤颤的，樱花色的薄唇被酒液浸润，透着一股无辜的艳色"
        ],
        dialogue: "你这个可爱的小野猫",
        sender: 'character',
        timestamp: new Date(),
      },
      {
        id: 2,
        content: "你好呀~",
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: 3,
        narration: ["抬起头来，露出一个慵懒而迷人的微笑，手指轻轻敲击着高脚杯", 
                   "将手机放在一旁，示意身边的人群稍稍退开，为你留出一个位置"],
        dialogue: "哦？这不是我们可爱的小客人吗",
        sender: 'character',
        timestamp: new Date(),
      },
      {
        id: 4,
        content: "我可以坐在这里吗？",
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: 5,
        narration: [
          "水晶吊灯的光芒在他银色的发丝间流转，映照出一片梦幻般的光晕",
          "优雅地挪了挪位置，修长的手指轻拍身边的沙发座位，嘴角勾起一抹意味深长的笑"
        ],
        dialogue: "当然可以，我可爱的小猫咪。这个位置，我可是特意为你留的呢",
        thoughts: "真是个有趣的小家伙",
        sender: 'character',
        timestamp: new Date(),
      }
    ]);
  }, [characterInfo]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const messageContent = inputMessage.trim() || "继续";
    const newMessage = {
      id: Date.now(),
      content: messageContent,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setIsVoicePlaying(false);
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: Date.now(),
        narration: ["轻轻地笑了笑", "优雅地端起酒杯，轻轻摇晃"],
        dialogue: "这是AI的回复消息",
        thoughts: "希望能和你聊得开心",
        sender: 'character' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // 获取要播放的文本内容
  const getVoiceContent = (message: Message): { text: string, voiceType: 'dialogue' | 'narration' | 'thoughts' }[] => {
    const content: { text: string, voiceType: 'dialogue' | 'narration' | 'thoughts' }[] = [];

    if (voiceSettings.dialogue && message.dialogue) {
      content.push({ text: message.dialogue, voiceType: 'dialogue' });
    }

    if (voiceSettings.thoughts && message.thoughts) {
      content.push({ text: message.thoughts, voiceType: 'thoughts' });
    }

    if (voiceSettings.narration && message.narration) {
      message.narration.forEach(text => {
        content.push({ text, voiceType: 'narration' });
      });
    }

    return content;
  };

  // 播放语音的函数
  const playVoiceContent = async (content: { text: string, voiceType: 'dialogue' | 'narration' | 'thoughts' }[]) => {
    for (const item of content) {
      try {
        // 这里是语音合成的模拟，实际实现时需要替换为真实的语音合成API调用
        console.log(`Playing ${item.voiceType}:`, item.text);
        console.log('Voice settings:', {
          voice: item.voiceType === 'dialogue' ? voiceConfig.dialogueVoice :
                item.voiceType === 'narration' ? voiceConfig.narrationVoice :
                voiceConfig.dialogueVoice, // 心声使用对话声音
          volume: item.voiceType === 'thoughts' ? 
                 `Reduced by ${voiceConfig.thoughtsVolumeReduction}db` : 
                 'Normal volume'
        });
        await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟语音播放时间
      } catch (error) {
        console.error('语音合成失败:', error);
      }
    }
  };

  const handlePlayVoice = async (messageId: number) => {
    setIsVoicePlaying(true);

    if (playingMessageId === messageId) {
      setPlayingMessageId(null);
      setIsVoicePlaying(false);
      // TODO: 停止语音播放的逻辑
      return;
    }

    const currentMessage = messages.find(msg => msg.id === messageId);
    if (!currentMessage || currentMessage?.isVoiceLoading) {
      return;
    }

    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId 
          ? { ...msg, isVoiceLoading: true }
          : msg
      )
    );

    try {
      const voiceContent = getVoiceContent(currentMessage);
      if (voiceContent.length === 0) {
        console.log('没有需要播放的语音内容');
        return;
      }

      await playVoiceContent(voiceContent);
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, isVoiceLoading: false }
            : msg
        )
      );
      setPlayingMessageId(messageId);

      // 播放完成后重置状态
      setTimeout(() => {
        setPlayingMessageId(null);
        setIsVoicePlaying(false);
      }, 1000);
    } catch (error) {
      console.error('语音播放失败:', error);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, isVoiceLoading: false }
            : msg
        )
      );
      setPlayingMessageId(null);
      setIsVoicePlaying(false);
    }
  };

  // 自动播放新消息的语音
  useEffect(() => {
    if (autoPlayVoice && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'character' && !lastMessage.isVoiceLoading) {
        handlePlayVoice(lastMessage.id);
      }
    }
  }, [messages, autoPlayVoice]);

  // 截断文本的函数
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackgroundSelect = () => {
    setIsBackgroundDialogOpen(true);
    handleMenuClose();
  };

  const handleBackgroundDialogClose = () => {
    setIsBackgroundDialogOpen(false);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setBackgroundMusicVolume(newValue as number);
  };

  const handleNicknameEdit = () => {
    setIsEditingNickname(true);
    // 在下一个渲染周期后聚焦输入框
    setTimeout(() => {
      nicknameInputRef.current?.focus();
    }, 0);
  };

  const handleNicknameSave = () => {
    setIsEditingNickname(false);
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value.trim());
  };

  const handleNicknameKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleNicknameSave();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: '56px', // 为底部导航栏预留空间
        }}
      >
        {/* 顶部信息栏 */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src={characterInfo.avatar}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
              }}
            />
            <Box>
              <Typography variant="subtitle1">{characterInfo.name}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {(characterInfo.connections / 10000).toFixed(1)}万 连接者
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setShowMessages(!showMessages)}>
              {showMessages ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <IconButton 
              onClick={() => setIsMusicEnabled(!isMusicEnabled)}
              sx={{
                color: isMusicEnabled ? 'primary.main' : 'text.secondary',
              }}
            >
              <MusicNoteIcon />
            </IconButton>
            <IconButton onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>

        {/* 设置菜单 */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <List
            sx={{
              width: '300px',
              bgcolor: 'background.paper',
              p: 0,
            }}
            subheader={<ListSubheader>设置</ListSubheader>}
          >
            <ListItem
              button
              onClick={handleNicknameEdit}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              {isEditingNickname ? (
                <TextField
                  inputRef={nicknameInputRef}
                  value={nickname}
                  onChange={handleNicknameChange}
                  onBlur={handleNicknameSave}
                  onKeyPress={handleNicknameKeyPress}
                  placeholder="输入新的称呼"
                  size="small"
                  fullWidth
                  autoFocus
                  sx={{
                    '& .MuiInputBase-root': {
                      color: 'text.primary',
                    },
                  }}
                />
              ) : (
                <ListItemText 
                  primary="他对我的称呼" 
                  secondary={nickname || <Typography variant="body2" sx={{ color: 'text.disabled' }}>默认</Typography>}
                  sx={{ pr: 2 }}
                />
              )}
            </ListItem>
            
            <Divider />
            
            <ListSubheader>对话设置</ListSubheader>
            <ListItem button onClick={handleBackgroundSelect}>
              <ListItemIcon>
                <WallpaperIcon />
              </ListItemIcon>
              <ListItemText primary="更改背景图片" />
            </ListItem>
            
            <Divider />
            
            <ListSubheader>声音设置</ListSubheader>
            <ListItem>
              <ListItemIcon>
                <PlayCircleIcon />
              </ListItemIcon>
              <ListItemText primary="自动播放对话语音" />
              <Switch
                edge="end"
                checked={autoPlayVoice}
                onChange={(e) => setAutoPlayVoice(e.target.checked)}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <VolumeUpIcon />
              </ListItemIcon>
              <ListItemText primary="对话语音内容" />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="他的说话" />
              <Switch
                edge="end"
                checked={voiceSettings.dialogue}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, dialogue: e.target.checked }))}
              />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="他的心声" />
              <Switch
                edge="end"
                checked={voiceSettings.thoughts}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, thoughts: e.target.checked }))}
              />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="旁白" />
              <Switch
                edge="end"
                checked={voiceSettings.narration}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, narration: e.target.checked }))}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MusicNoteIcon />
              </ListItemIcon>
              <ListItemText 
                primary="背景音乐音量" 
                secondary={
                  <Slider
                    value={backgroundMusicVolume}
                    onChange={handleVolumeChange}
                    aria-labelledby="background-music-volume-slider"
                    sx={{ mt: 2 }}
                  />
                }
              />
            </ListItem>
          </List>
        </Menu>

        {/* 背景图片选择对话框 */}
        <Dialog
          open={isBackgroundDialogOpen}
          onClose={handleBackgroundDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>选择背景图片</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* 这里可以添加背景图片选项 */}
              <Grid item xs={4}>
                <Paper
                  sx={{
                    height: 120,
                    backgroundImage: 'url(/images/backgrounds/bg1.jpg)',
                    backgroundSize: 'cover',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => {
                    // 处理背景图片选择
                    handleBackgroundDialogClose();
                  }}
                />
              </Grid>
              {/* 可以添加更多背景图片选项 */}
            </Grid>
          </DialogContent>
        </Dialog>

        {/* 空白填充区域 */}
        <Box sx={{ flex: 1 }} />

        {/* 消息区域 */}
        <Box
          ref={messagesContainerRef}
          sx={{
            height: '50vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            px: 2,
            py: 1,
          }}
        >
          {/* 消息列表 - 可收起 */}
          <Collapse in={showMessages}>
            <Box
              sx={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                px: 2,
                py: 3,
                gap: 3,
              }}
            >
              {/* 角色简介卡片 */}
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'rgba(32, 32, 32, 0.75)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                  width: '80%',
                  maxWidth: '600px',
                  position: 'relative',
                }}
              >
                <Box 
                  sx={{ 
                    width: '95%',
                    height: isIntroExpanded ? 'auto' : '4.8em',
                    overflow: 'hidden',
                    transition: 'height 0.3s ease',
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1,
                      fontWeight: 'bold',
                      color: 'text.primary',
                    }}
                  >
                    简介
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {characterInfo.introduction}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <MusicNoteIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {characterInfo.backgroundStory}
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  size="small"
                  onClick={() => setIsIntroExpanded(!isIntroExpanded)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.4)',
                    },
                  }}
                >
                  {isIntroExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Paper>

              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 1,
                      ...(message.sender === 'user' 
                        ? {
                            width: 'fit-content',
                            maxWidth: {
                              xs: '70%',
                              sm: '65%',
                            },
                          }
                        : {
                            width: '80%',
                            maxWidth: '600px',
                          }
                      ),
                      ml: message.sender === 'user' ? 'auto' : 0,
                      mr: message.sender === 'user' ? 0 : 'auto',
                    }}
                  >
                    {message.sender === 'character' && (
                      <Box sx={{ position: 'relative' }}>
                        <IconButton
                          size="small"
                          onClick={() => handlePlayVoice(message.id)}
                          sx={{
                            position: 'absolute',
                            left: -40,
                            bottom: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.4)',
                            },
                          }}
                        >
                          <PlayArrowIcon fontSize="small" />
                          {isPlaying === message.id && (
                            <Typography
                              variant="caption"
                              sx={{
                                position: 'absolute',
                                left: -20,
                                color: 'text.secondary',
                              }}
                            >
                              3"
                            </Typography>
                          )}
                        </IconButton>
                      </Box>
                    )}
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: message.sender === 'user' ? 'rgba(245, 235, 224, 0.75)' : 'rgba(32, 32, 32, 0.75)',
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {message.sender === 'character' ? (
                        <Box sx={{ position: 'relative' }}>
                          {message.narration?.map((text, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.85rem',
                                mb: 1,
                                width: '95%',
                                textAlign: 'left',
                              }}
                            >
                              {text}
                            </Typography>
                          ))}
                          {message.dialogue && (
                            <Typography
                              variant="body1"
                              sx={{
                                color: '#FFA500',
                                mb: 1,
                                width: '95%',
                                textAlign: 'left',
                              }}
                            >
                              "{message.dialogue}"
                            </Typography>
                          )}
                          {message.thoughts && (
                            <Typography
                              variant="body1"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontStyle: 'italic',
                                mb: 1,
                                width: '95%',
                                textAlign: 'left',
                              }}
                            >
                              ({message.thoughts})
                            </Typography>
                          )}
                          <Box
                            sx={{
                              position: 'absolute',
                              right: -48,
                              top: '50%',
                              transform: 'translateY(-50%)',
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handlePlayVoice(message.id)}
                              disabled={message.isVoiceLoading}
                              sx={{
                                bgcolor: 'rgba(32, 32, 32, 0.75)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  bgcolor: 'rgba(32, 32, 32, 0.9)',
                                },
                              }}
                            >
                              {message.isVoiceLoading ? (
                                <CircularProgress size={20} thickness={4} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                              ) : (
                                <VolumeUpIcon 
                                  fontSize="small" 
                                  sx={{ 
                                    color: playingMessageId === message.id ? 'primary.main' : 'rgba(255, 255, 255, 0.7)'
                                  }} 
                                />
                              )}
                            </IconButton>
                          </Box>
                        </Box>
                      ) : (
                        <Typography 
                          variant="body1" 
                          sx={{
                            color: '#333333',
                            textAlign: 'left',
                            width: '100%',
                            minWidth: '4em',
                          }}
                        >
                          {message.content}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          </Collapse>
        </Box>

        {/* 底部输入区域 */}
        <Box
          sx={{
            p: 2,
            width: '100%',
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 1200,
          }}
        >
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(32, 32, 32, 0.5)',
              borderRadius: 2,
              p: 1,
            }}
          >
            <IconButton 
              sx={{ color: 'text.secondary' }}
              onClick={() => {/* TODO: 实现语音通话功能 */}}
            >
              <CallIcon />
            </IconButton>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="发送消息给温柔总裁"
              variant="standard"
              sx={{
                '& .MuiInputBase-root': {
                  color: 'text.primary',
                  '&::before, &::after': {
                    display: 'none',
                  },
                },
                '& .MuiInputBase-input': {
                  p: 1,
                },
              }}
            />
            <IconButton 
              sx={{ color: 'text.secondary' }}
              onClick={() => {/* TODO: 实现语音输入功能 */}}
            >
              <MicIcon />
            </IconButton>
            <IconButton 
              sx={{ color: 'text.secondary' }}
              onClick={handleSendMessage}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat; 
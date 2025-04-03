import React from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const scenes = [
  { id: 'workplace', name: '职场', image: '/images/workplace.jpg' },
  { id: 'campus', name: '校园', image: '/images/campus.jpg' },
  { id: 'city', name: '都市', image: '/images/city.jpg' },
  { id: 'ancient', name: '古代', image: '/images/ancient.jpg' },
  { id: 'fantasy', name: '玄幻', image: '/images/fantasy.jpg' },
];

const characters = [
  {
    id: 1,
    name: '温柔总裁',
    scene: 'workplace',
    image: '/images/characters/ceo.jpg',
    description: '事业有成的精英总裁，温柔体贴，善解人意',
  },
  {
    id: 2,
    name: '阳光学长',
    scene: 'campus',
    image: '/images/characters/senior.jpg',
    description: '充满活力的校园学长，阳光开朗，乐于助人',
  },
  // 更多角色数据...
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentScene, setCurrentScene] = React.useState('workplace');

  const handleSceneChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentScene(newValue);
  };

  const filteredCharacters = characters.filter(character =>
    (character.scene === currentScene || !currentScene) &&
    (character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
        选择你的专属陪伴
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="搜索角色..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Tabs
        value={currentScene}
        onChange={handleSceneChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 4,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minWidth: 'auto',
            px: 3,
          },
        }}
      >
        {scenes.map((scene) => (
          <Tab
            key={scene.id}
            label={scene.name}
            value={scene.id}
            sx={{
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        {filteredCharacters.map((character) => (
          <Grid item xs={12} sm={6} md={4} key={character.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => navigate(`/chat/${character.id}`)}
            >
              <CardMedia
                component="img"
                height="300"
                image={character.image}
                alt={character.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {character.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {character.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 
const { useState } = React;
const {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  Box,
  Button,
  TextField,
  Menu,
  MenuItem,
  Grid,
  Container,
  SvgIcon,
  Link,
  Slider,
} = MaterialUI;
function MenuIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
      <path d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
      <path d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
    </SvgIcon>
  );
}
const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
  menuIcon: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
}));
function valuetext(value) {
  return `${value}`;
}
function App() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [trainSize, setTrainSize] = useState(1000);
  const [predSize, setPredSize] = useState(1000);
  const handleTrainSliderChange = (event, newValue) => {
    setTrainSize(newValue);
  };
  const handlePredSliderChange = (event, newValue) => {
    setPredSize(newValue);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div>
            <Button
              aria-controls="docMenu"
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit">
              DOCs
            </Button>
            <Menu
              id="docMenu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem onClick={handleClose}>
                <Link href="/redoc" target="_blank">
                  Redoc
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/docs" target="_blank">
                  Swagger
                </Link>
              </MenuItem>
            </Menu>
          </div>

          <Typography variant="h6" align="center" className={classes.title}>
            API Test
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "40vh" }}>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="center" flexWrap="wrap">
              <Typography>Training Dataset Size {trainSize}</Typography>

              <Slider
                value={trainSize}
                min={1000}
                max={100000}
                onChange={handleTrainSliderChange}
                aria-labelledby="input-slider"
              />
            </Box>
            <Box display="flex" justifyContent="center" flexWrap="wrap">
              <Typography>Prediction Dataset Size {predSize}</Typography>

              <Slider
                value={predSize}
                min={1000}
                max={100000}
                onChange={handlePredSliderChange}
                aria-labelledby="input-slider"
              />
            </Box>
            <Box display="flex" justifyContent="center" flexWrap="wrap">
              <Typography>Amount of Metrics</Typography>

              <Slider
                value={Xsize}
                min={2}
                max={15}
                onChange={handleXSliderChange}
                aria-labelledby="input-slider"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

ReactDOM.render(
  <App />,

  document.querySelector("#root")
);

// const BASE_URL = "https://localhost:8000";
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
  List,
  ListItem,
  MenuItem,
  Grid,
  Container,
  SvgIcon,
  Link,
  Slider,
} = MaterialUI;

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1, textAlign: "center" },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
  menuIcon: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
}));

const postRequest = async (url, payload) => {
  try {
    const response = await axios({
      method: "post",
      url: url,
      data: payload,
    });
    console.log(response);
    const responseData = response.data;
    console.log(responseData);
    return responseData;
  } catch (e) {
    console.error(e);
  }
};

function App() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //  I should probably use objects to handle state here... will change
  const [trainSize, setTrainSize] = useState(1000);
  const [predSize, setPredSize] = useState(1000);
  const [metrics, setMetrics] = useState([
    "hubspot_contact_paid_search",
    "hubspot_contact_direct_traffic",
    "hubspot_contact_paid_social",
    "hubspot_contact_webinar",
    "hubspot_contact_zoom_marketplace",
    "hubspot_contact_organic_search",
    "hubspot_contact_qualified",
    "hubspot_email_open",
    "salesforce_opportunity",
  ]);
  const [target, setTarget] = useState("salesforce_opportunity");

  const getPrediction = async () => {
    const payload = {
      train: trainSize,
      pred: predSize,
      metrics: metrics,
      target: target,
    };
    console.log(payload);
    const resp = await postRequest("/test/prediction", payload);
  };

  // need to make more generic.. same function over again
  const handleTrainSliderChange = (event, newVal) => {
    setTrainSize(newVal);
  };
  const handlePredSliderChange = (event, newVal) => {
    setPredSize(newVal);
  };
  const handleMetrics = (event) => {
    const newArray = event.target.value;
    setMetrics([newArray]);
  };
  const handleTarget = (event) => {
    setTarget(event.target.value);
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
      <Container maxWidth="sm">
        <Grid
          container
          spacing={3}
          direction="row"
          alignItems="center"
          justify="center"
          style={{ minHeight: "40vh", marginTop: "5vh" }}>
          <Grid item sm={12}>
            <Box display="flex" justifyContent="center" flexWrap="wrap">
              <Typography>
                Training Dataset Size ={" "}
                <b style={{ color: "red" }}>{trainSize}</b>
              </Typography>

              <Slider
                value={trainSize}
                min={1000}
                max={100000}
                onChange={handleTrainSliderChange}
                aria-labelledby="input-slider"
              />
            </Box>
            <Box display="flex" justifyContent="center" flexWrap="wrap">
              <Typography>
                Prediction Dataset Size ={" "}
                <b style={{ color: "red" }}>{predSize}</b>
              </Typography>

              <Slider
                value={predSize}
                min={1000}
                max={100000}
                onChange={handlePredSliderChange}
                aria-labelledby="input-slider"
              />
            </Box>
          </Grid>
          <Grid item sm={12} style={{ padding: "20px" }}>
            <Box display="flex" justifyContent="center" flexWrap="wrap">
              <Typography>Metrics</Typography>
              <TextField
                variant="outlined"
                style={{ width: "60vw" }}
                value={metrics}
                onChange={handleMetrics}></TextField>
              {/* <List>
                  metrics
                </List> */}
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              style={{ padding: "20px" }}>
              <TextField
                value={target || ""}
                style={{ width: "30vw" }}
                label="target"
                onChange={handleTarget}></TextField>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              style={{ padding: "20px" }}></Box>
            <Grid item sm={12} style={{ padding: "20px" }}>
              <Box display="flex" justifyContent="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={getPrediction}
                  // href={`test/prediction?train=${trainSize}&pred=${predSize}&metrics=${metrics}&target=${target}&trash=${trash}`}
                >
                  GO
                </Button>
              </Box>
            </Grid>
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

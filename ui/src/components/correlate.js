import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import {
  Typography,
  makeStyles,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Grid,
  Container,
  Slider,
  Slide,
  Modal,
  Backdrop,
  Fade,
} from "@material-ui/core";
import InfoBar from "./infoBar.js";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import NivoBarCorr from "./nivoBar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
    overflowY: "hidden",
    paddingTop: "5%",
  },
  listMetrics: { overflow: "scroll", width: "100%" },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    Width: "100vw",
    Height: "90vh",
  },
  container: {
    maxHeight: "90vh",
  },
  input: {
    display: "none",
  },
  cardRoot: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  cardTitle: {
    fontSize: 14,
  },
  cardPos: {
    marginBottom: 12,
  },
}));
function Explain() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  return (
    <CardContent>
      <Typography variant="h6" component="h2">
        Measure the correlation/importance of relationship between
        <List>
          {" "}
          <ListItemText>
            each metric (<code>X</code>)
          </ListItemText>
          <ListItemText>
            and the target (<code>Y</code>)
          </ListItemText>
        </List>
        for one-hot encoded dataset (0,1)
      </Typography>
      <Typography variant="body2" component="p">
        <List>
          <ListItem>Implements:</ListItem>
          <ListItem>
            {bull}
            <b>Decision Tree classifier feature importance score </b> -AKA gini
            importance
          </ListItem>
          <ListItem>
            {bull}
            <b>Phi coefficient</b> -aka Matthews correlation coefficient
          </ListItem>
          <ListItem>
            {bull}
            <b>Point biserial correlation</b> -same as pearson-r and ultimately
            Phi coefficient
          </ListItem>
          <ListItem>
            {bull}
            <b>P-value</b> -(aka statistical importance)
          </ListItem>
          <ListItem>
            {bull}
            <b>Predictive power score</b>-(pretty much identical to gini
            importance measure)
          </ListItem>
        </List>
      </Typography>
    </CardContent>
  );
}
const postRequest = async (url, payload) => {
  try {
    const response = await axios({
      method: "post",
      url: url,
      data: payload,
    });

    const responseData = response.data;

    return responseData;
  } catch (e) {
    console.error(e);
  }
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Correlate() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [fileObj, setfileObj] = useState(null);
  //  I should probably use objects to handle state here... will change
  const onFileChange = (event) => {
    setfileObj(event.target.file);
  };
  const getCorrelationIO = async () => {
    setSeconds(0);
    setLoading(true);
    const payload = {
      metric: target,
      input_csv: dataSetSize,
    };
    const resp = await postRequest("/dtapi/test/correlation", payload);
    console.log(resp);
    setPredData(resp);
    setLoading(false);
    setOpen(true);
  };
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("input_csv", fileObj);

    // Details of the uploaded file
    console.log(fileObj);
  };
  const [dataSetSize, setTrainSize] = useState(1000);
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
  const [corrData, setPredData] = useState({
    results: {
      correlations: [
        {
          biserial_correlation: 0,
          importance: 0,
          metric: "",
          p_value: 0,
          phi_correlation: 0,
          target: "",
        },
      ],
    },
  });

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((c) => c + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const getCorrelation = async () => {
    setSeconds(0);
    setLoading(true);
    const payload = {
      input_size: dataSetSize,
      metrics: metrics,
      target: target,
    };
    const resp = await postRequest("/dtapi/test/correlation", payload);
    console.log(resp);
    setPredData(resp);
    setLoading(false);
    setOpen(true);
  };
  const [metricInputVal, setMetricInputVal] = useState("");
  // need to make more generic.. same function over again
  const handleTrainSliderChange = (event, newVal) => {
    setTrainSize(newVal);
  };
  const handleMetricInput = (event) => {
    event.preventDefault();
    setMetricInputVal(event.target.value);
  };
  const deleteMetric = (listItem) => {
    setMetrics(metrics.filter((x) => x !== listItem));
  };
  const addMetric = (event) => {
    console.log(event);
    setMetrics([metricInputVal, ...metrics]);
  };

  const handleTarget = (event) => {
    setTarget(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="center"
        justify="center">
        <Grid item>
          {" "}
          <Typography variant="h2">Correlations</Typography>
        </Grid>
        <Grid item>
          <InfoBar icon={<LiveHelpIcon />} content={<Explain />} />
        </Grid>
      </Grid>
      <Container maxWidth="sm">
        <Router>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justify="center">
            <Grid item>
              <Button variant="outlined">
                <Link
                  to="/correlateTest"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}>
                  <Typography variant="h6"> Random</Typography>
                </Link>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">
                <Link
                  to="/correlateTest/file"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}>
                  <Typography variant="h6"> File</Typography>
                </Link>
              </Button>
            </Grid>
          </Grid>
          <Switch>
            <Route path="/correlateTest/file">
              {" "}
              <Grid
                container
                spacing={3}
                direction="row"
                alignItems="center"
                justify="center"
                style={{ minHeight: "40vh", marginTop: "5vh" }}>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  single
                  onChange={onFileChange}
                  type="file"
                />
                <label htmlFor="contained-button-file">
                  <Grid item>
                    <Box display="flex" justifyContent="center" flexWrap="wrap">
                      <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}>
                        Upload CSV
                      </Button>
                    </Box>
                  </Grid>
                </label>{" "}
                <Grid item>
                  {" "}
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={getCorrelation}>
                    GO
                  </Button>
                </Grid>
              </Grid>
            </Route>
            <Route path="/correlateTest">
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
                      Input Dataset Size ={" "}
                      <b style={{ color: "red" }}>{dataSetSize}</b>
                    </Typography>

                    <Slider
                      value={dataSetSize}
                      min={1000}
                      max={100000}
                      onChange={handleTrainSliderChange}
                      aria-labelledby="input-slider"
                    />
                  </Box>
                </Grid>
                <Grid item sm={12}>
                  <Typography>Metrics</Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexWrap="wrap"
                    style={{ width: "100%", paddingTop: "5%" }}>
                    <TextField
                      style={{ width: "70%", paddingRight: "10%" }}
                      variant="standard"
                      label="add a metric (x value)"
                      value={metricInputVal}
                      onChange={handleMetricInput}></TextField>
                    <Box>
                      <Button
                        style={{ width: "100%" }}
                        onClick={addMetric}
                        variant="contained"
                        size="small"
                        color="primary">
                        Add
                      </Button>
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="center" flexWrap="wrap">
                    <List className={classes.listMetrics}>
                      {metrics.map((listItem, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={listItem.replace(
                              /_/g,
                              " "
                            )}></ListItemText>
                          <Button
                            onClick={() => deleteMetric(listItem)}
                            variant="contained"
                            size="small"
                            color="secondary">
                            Delete
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexWrap="wrap"
                    style={{ padding: "20px" }}>
                    <TextField
                      variant="outlined"
                      value={target}
                      style={{ width: "100%" }}
                      label="target"
                      onChange={handleTarget}></TextField>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexWrap="wrap"
                    style={{ padding: "20px" }}></Box>
                  <Grid item sm={12} style={{ padding: "20px" }}>
                    {loading && (
                      <Box>
                        <Typography>{seconds} seconds</Typography>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="center" flexWrap="wrap">
                      <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={getCorrelation}>
                        GO
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Route>
          </Switch>
        </Router>
      </Container>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={open}>
          <div className={classes.paperModal}>
            <Typography variant="h3">
              metric correlations to{" "}
              {corrData.results.correlations[0].target.replace("_", " ")}
            </Typography>
            <NivoBarCorr chartData={corrData} />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
export default Correlate;

import React, { useState, useEffect } from "react";
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
import NivoPredBar from "./nivoPredBar";

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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Predict() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
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
  const [predData, setPredData] = useState({
    model_accuraccy: 0,
    results: [{ action_group: "", prob_yes: "", prob_no: "" }],
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

  const getPrediction = async () => {
    setSeconds(0);
    setLoading(true);
    const payload = {
      train: trainSize,
      pred: predSize,
      metrics: metrics,
      target: target,
    };
    const resp = await postRequest("/dtapi/test/prediction", payload);
    setPredData(resp);
    setLoading(false);
    setOpen(true);
  };
  const [metricInputVal, setMetricInputVal] = useState("");
  // need to make more generic.. same function over again
  const handleTrainSliderChange = (event, newVal) => {
    setTrainSize(newVal);
  };
  const handlePredSliderChange = (event, newVal) => {
    setPredSize(newVal);
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
      <Typography variant="h2"> Predict Action Groups</Typography>
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
                      primary={listItem.replace(/_/g, " ")}></ListItemText>
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
                  onClick={getPrediction}>
                  GO
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>{" "}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 200,
        }}>
        <Fade in={open}>
          <div className={classes.paperModal}>
            <NivoPredBar
              style={{ borderColor: "1px solid red" }}
              predData={predData.results}
              target={target}
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
export default Predict;

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  Menu,
  MenuItem,
  Link,
} from "@material-ui/core";
import MenuBookIcon from "@material-ui/icons/MenuBook";
const useStyles = makeStyles((theme) => ({
  navRoot: { flexGrow: 1, textAlign: "center" },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
}));

function NavBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  return (
    <React.Fragment>
      <div className={classes.navRoot}>
        <AppBar position="fixed">
          <Toolbar>
            <div>
              <Button
                aria-controls="docMenu"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit">
                <MenuBookIcon />
                <Typography style={{ paddingLeft: "20%" }}>Docs</Typography>
              </Button>
              <Menu
                id="docMenu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={handleClose}>
                  <Link href="http://localhost:8000/redoc" target="_blank">
                    Redoc
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="http://localhost:8000/docs" target="_blank">
                    Swagger
                  </Link>
                </MenuItem>
              </Menu>
            </div>
            <div>
              <Button
                aria-controls="featureMenu"
                aria-haspopup="true"
                onClick={handleClick1}
                color="inherit">
                <Typography style={{ paddingLeft: "20%" }}>Features</Typography>
              </Button>
              <Menu
                id="featureMenu"
                anchorEl={anchorEl1}
                keepMounted
                open={Boolean(anchorEl1)}
                onClose={handleClose1}>
                <MenuItem onClick={handleClose}> {props.main}</MenuItem>
                <MenuItem onClick={handleClose}>{props.feature1}</MenuItem>
                <MenuItem onClick={handleClose}> {props.feature2}</MenuItem>
              </Menu>
            </div>

            <Typography variant="h6" align="right" className={classes.title}>
              DealTale API Test
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    </React.Fragment>
  );
}
export default NavBar;

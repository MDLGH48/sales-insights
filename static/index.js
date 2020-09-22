const {
  colors,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  makeStyles,
  createMuiTheme,
  Box,
  SvgIcon,
  Link,
  Button,
  TextField
} = MaterialUI;

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: colors.red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});


function App() {
  return (
    <Container maxWidth="sm">
      <div style={{ marginTop: 24, }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Logged In</Typography>
          <TextField/>
          <Button> Test </Button>
          <Link href="/login"> link</Link>
      </div>
    </Container>
  );
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.querySelector('#root'),
);
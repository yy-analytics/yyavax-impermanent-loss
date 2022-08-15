import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { Card, CardContent, CssBaseline, Paper, Slider } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Legend, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import MathJax from 'react-mathjax';

// This function is used in order to make recharts charts responsive, by detecting the size of
// the component in which they find themselves. Using this because recharts own ResponsiveContainer
// does not work properly for page resizes, only works when the page is refreshed.
const useResize = (myRef) => {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(myRef.current.offsetWidth)
    }

    if (myRef.current) {
      setWidth(myRef.current.offsetWidth);
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [myRef])

  return { width }
};

function App() {
  const [yyAvaxGrowth, setYyAvaxGrowth] = React.useState(0.05);

  const componentRef = React.useRef();
  const { width } = useResize(componentRef);

  const data = [...Array(501).keys()].map(x => ({ k: 0.01 * x })).map(
    ({ k }) => (
      {
        k,
        'AVAX/USDC pool vs. holding AVAX and USDC': 2 * Math.sqrt(k) / (1 + k) - 1,
        'yyAVAX/USDC pool vs. holding yyAVAX and USDC': 2 * Math.sqrt(k * (1 + yyAvaxGrowth)) / (1 + k * (1 + yyAvaxGrowth)) - 1,
        'yyAVAX/USDC pool vs. holding AVAX and USDC': (k * yyAvaxGrowth + 2) * Math.sqrt(k * (1 + yyAvaxGrowth)) / (1 + k * (1 + yyAvaxGrowth)) - 1,
      }
    )
  );

  const handleGrowthChange = (event, newValue) => {
    setYyAvaxGrowth(newValue);
    console.log(data);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{
        height: '100vh',
        padding: "10px",
      }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3">
              Impermanent Loss for yyAVAX deFi farming
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">
                    How it works
                  </Typography>
                  <Typography variant="body1">
                    We show 3 charts in the graph below:
                  </Typography>
                  <Typography variant="body1">
                    1. <span style={{ color: theme.palette.avax.main }}>AVAX/USDC vs. holding AVAX and USDC</span>
                    - this is the "normal" impermanent loss calculation for a given variation in the price of AVAX when depositing into an AVAX/USDC pool.
                  </Typography>
                  <Typography variant="body1">
                    2. <span style={{ color: theme.palette.info.main }}>yyAVAX/USDC vs. holding yyAVAX and USDC</span>
                    - this is also the "normal" impermanent loss calculation, but we have separated out the effect of yyAVAX accruing value against AVAX,
                    and is for depositing into a yyAVAX/USDC pool.
                  </Typography>
                  <Typography variant="body1">
                    3. <span style={{ color: theme.palette.primary.main }}>yyAVAX/USDC vs. holding AVAX and USDC</span>
                    - this is not a normal impermanent loss calculation because we are comparing the pooled yyAVAX/USDC assets against the plain AVAX and USDC assets.
                    The comparison being made in this case is what you stand to lose {"("}or gain{")"} for the case that you hold your AVAX and USDC assets versus
                    converting the AVAX to yyAVAX and then depositing into a yyAVAX/USDC pool.
                  </Typography>
                  <br />
                  <Typography variant="body1">
                    The slider can be used to adjust the expected gains you receive from yyAVAX accruing value against AVAX.
                  </Typography>
                </Grid>
                <Grid item xs={3} md={2}>
                  <Typography variant="body2">
                    yyAvax growth = {`${(100 * yyAvaxGrowth).toFixed(2)}%`}
                  </Typography>
                </Grid>
                <Grid item xs={9} md={10}>
                  <Slider
                    aria-label="yyAvaxGrowth"
                    size="small"
                    value={yyAvaxGrowth}
                    onChange={handleGrowthChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={v => `${(100 * v).toFixed(2)}%`}
                    min={0}
                    max={0.5}
                    step={0.0001}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} ref={componentRef}>
                    <LineChart data={data} margin={{ top: 10, right: 40, left: 10, bottom: 12 }} width={0.99 * width} height={window.innerHeight * 0.7}>
                      <Line type="monotone" dot={false} dataKey="AVAX/USDC pool vs. holding AVAX and USDC" stroke={theme.palette.avax.main} />
                      <Line type="monotone" dot={false} dataKey="yyAVAX/USDC pool vs. holding yyAVAX and USDC" stroke={theme.palette.info.main} />
                      <Line type="monotone" dot={false} dataKey="yyAVAX/USDC pool vs. holding AVAX and USDC" stroke={theme.palette.primary.main} />
                      <ReferenceLine y={0} stroke={theme.palette.text.disabled} strokeDasharray="3 3" />
                      <XAxis dataKey="k" type="number" tickCount={6} label={{ value: "New AVAX price / Old AVAX price", fill: theme.palette.text.primary, dy: 15 }} />
                      <YAxis orientation="left" domain={[-1, 0.5]} ticks={[-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5]} tickFormatter={v => `${100 * v}%`} label={{ value: "Impermanent Loss *", fill: theme.palette.text.primary, angle: -90, dx: -30 }} />
                      <Tooltip formatter={v => `${(100 * v).toFixed(2)}%`} labelFormatter={label => `Price multiple = ${label.toFixed(2)}, e.g. $30 per AVAX => $${(30 * label).toFixed(2)} per AVAX`} contentStyle={{ backgroundColor: theme.palette.background.default, opacity: 0.75 }} labelStyle={{ color: theme.palette.text.primary }} />
                      <Legend verticalAlign="top" iconSize="8" />
                    </LineChart>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">
                The maths
              </Typography>
              <Typography variant="body1">
                Let the change in AVAX price,
                <MathJax.Provider>
                  <MathJax.Node inline formula={`\\enspace k = \\frac{New \\enspace AVAX \\enspace price}{Old \\enspace AVAX \\enspace price}`} />
                </MathJax.Provider>
              </Typography>
              <Typography variant="body1">
                Let the percentage growth in yyAVAX value in terms of AVAX
                <MathJax.Provider>
                  <MathJax.Node inline formula={`\\enspace = g`} />
                </MathJax.Provider>
              </Typography>
              <Typography variant="body1">
                <span style={{ color: theme.palette.avax.main }}>IL (1)</span>
                <MathJax.Provider>
                  <MathJax.Node formula={`IL_{1} = \\frac{2 \\sqrt k}{1 + k} - 1`} />
                </MathJax.Provider>
              </Typography>
              <Typography variant="body1">
                <span style={{ color: theme.palette.info.main }}>IL (2)</span>
                <MathJax.Provider>
                  <MathJax.Node formula={`IL_{2} = \\frac{2 \\sqrt {k(1+g)}}{1 + k(1+g)} - 1`} />
                </MathJax.Provider>
              </Typography>
              <Typography variant="body1">
                <span style={{ color: theme.palette.primary.main }}>IL* (3)</span>
                <MathJax.Provider>
                  <MathJax.Node formula={`IL_{3} = \\frac{(2+kg) \\sqrt {k(1+g)}}{1 + k(1+g)} - 1`} />
                </MathJax.Provider>
              </Typography>
              <Typography variant="subtitle2">
                * Impermanent loss combined with gains from yyAVAX accruing value against AVAX.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;

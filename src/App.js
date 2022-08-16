import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { Avatar, AvatarGroup, Card, CardContent, CssBaseline, InputAdornment, Paper, Slider, Stack, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiInput from '@mui/material/Input';
import { Legend, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import MathJax from 'react-mathjax';

import logoUSDC from './images/USDC.png';
import logoAVAX from './images/Avalanche_AVAX_RedWhite.png';
import logoYyAVAX from './images/yyAVAX.jpg';

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

const TokenSymbols = (props) => {
  const { number, token0, altToken0, token1, altToken1, token2 = token0, altToken2 = altToken0, token3 = token1, altToken3 = altToken1 } = props;
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="h5">
        {number}.
      </Typography>
      <AvatarGroup>
        <Avatar alt={altToken0} src={token0} />
        <Avatar alt={altToken1} src={token1} />
      </AvatarGroup>
      <Typography variant="h5">
        vs.
      </Typography>
      <Avatar alt={altToken2} src={token2} />
      <Typography variant="body1">
        &
      </Typography>
      <Avatar alt={altToken3} src={token3} />
    </Stack>
  )
}

function App() {
  const [yyAvaxGrowth, setYyAvaxGrowth] = React.useState(0.09);
  const [tradingFeeGrowth, setTradingFeeGrowth] = React.useState(0.15);
  const [farmingRewardsGrowth, setFarmingRewardsGrowth] = React.useState(0.08);
  const [avaxPrice, setAvaxPrice] = React.useState(30);

  const componentRef = React.useRef();
  const { width } = useResize(componentRef);

  const data = [...Array(401).keys()].map(x => ({ k: 0.01 * x })).map(
    ({ k }) => (
      {
        k,
        'New AVAX Price': k * avaxPrice,
        'AVAX/USDC pool vs. holding AVAX and USDC': (2 * Math.sqrt(k) / (1 + k)) * (1 + tradingFeeGrowth + farmingRewardsGrowth) - 1,
        'yyAVAX/USDC pool vs. holding yyAVAX and USDC': (2 * Math.sqrt(k * (1 + yyAvaxGrowth)) / (1 + k * (1 + yyAvaxGrowth))) * (1 + tradingFeeGrowth + farmingRewardsGrowth) - 1,
        'yyAVAX/USDC pool vs. holding AVAX and USDC': ((k * yyAvaxGrowth + 2) * Math.sqrt(k * (1 + yyAvaxGrowth)) / (1 + k * (1 + yyAvaxGrowth))) * (1 + tradingFeeGrowth + farmingRewardsGrowth) - 1,
      }
    )
  );

  const handleYyAvaxGrowthChange = (event, newValue) => {
    setYyAvaxGrowth(newValue);
  };

  const handleTradingFeeGrowthChange = (event, newValue) => {
    setTradingFeeGrowth(newValue);
  };

  const handleFarmingRewardsGrowthChange = (event, newValue) => {
    setFarmingRewardsGrowth(newValue);
  };

  const handleInitialPriceChange = (event) => {
    setAvaxPrice(Number(event.target.value));
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
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    We show 3 charts in the graph below:
                  </Typography>
                </Grid>
                <Grid item xs={12} container alignItems="center" spacing={2}>
                  <Grid item xs="auto">
                    <TokenSymbols
                      number={1}
                      token0={logoAVAX}
                      altToken0="AVAX"
                      token1={logoUSDC}
                      altToken1="$"
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body1">
                      <span style={{ color: theme.palette.avax.main }}>AVAX/USDC vs. holding AVAX and USDC</span> - this is the "normal" impermanent
                      loss calculation for a given variation in the price of AVAX when depositing into an AVAX/USDC pool.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} container alignItems="center" spacing={2}>
                  <Grid item xs="auto">
                    <TokenSymbols
                      number={2}
                      token0={logoYyAVAX}
                      altToken0="yyAVAX"
                      token1={logoUSDC}
                      altToken1="$"
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body1">
                      <span style={{ color: theme.palette.info.main }}>yyAVAX/USDC vs. holding yyAVAX and USDC</span> - this is also the "normal" impermanent
                      loss calculation, but we have separated out the effect of yyAVAX accruing value against AVAX, and is for depositing into a yyAVAX/USDC pool.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} container alignItems="center" spacing={2}>
                  <Grid item xs="auto">
                    <TokenSymbols
                      number={3}
                      token0={logoYyAVAX}
                      altToken0="yyAVAX"
                      token1={logoUSDC}
                      altToken1="$"
                      token2={logoAVAX}
                      altToken2="AVAX"
                    />
                  </Grid>
                  <Grid item xs>
                  <Typography variant="body1">
                    <span style={{ color: theme.palette.primary.main }}>yyAVAX/USDC vs. holding AVAX and USDC</span> - this is not a normal impermanent loss
                    calculation because we are comparing the pooled yyAVAX/USDC assets against the plain AVAX and USDC assets. The comparison being made in this
                    case is what you stand to lose {"("}or gain{")"} for the case that you hold your AVAX and USDC assets versus converting the AVAX to yyAVAX
                    and then depositing into a yyAVAX/USDC pool.
                  </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <br />
                  <Typography variant="body1">
                    The slider can be used to adjust the expected gains you receive from yyAVAX accruing value against AVAX.
                  </Typography>
                </Grid>
                <Grid item xs={3} md={2}>
                  <Typography variant="body2">
                    AVAX initial price =
                  </Typography>
                </Grid>
                <Grid item xs={9} md={10}>
                  <TextField
                    size="small"
                    value={avaxPrice}
                    onChange={handleInitialPriceChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      step: 1,
                      min: 0,
                      max: 100,
                      type: 'number',
                    }}
                    sx={{
                      '& .MuiTypography-root': {
                        color: 'white'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={3} md={2}>
                  <Typography variant="body2">
                    yyAVAX: AVAX gains = {`${(100 * yyAvaxGrowth).toFixed(2)}%`}
                  </Typography>
                </Grid>
                <Grid item xs={9} md={10}>
                  <Slider
                    aria-label="yyAvaxGrowth"
                    size="small"
                    value={yyAvaxGrowth}
                    onChange={handleYyAvaxGrowthChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={v => `${(100 * v).toFixed(2)}%`}
                    min={0}
                    max={0.5}
                    step={0.0001}
                  />
                </Grid>
                <Grid item xs={3} md={2}>
                  <Typography variant="body2">
                    Trading fee growth = {`${(100 * tradingFeeGrowth).toFixed(2)}%`}
                  </Typography>
                </Grid>
                <Grid item xs={9} md={10}>
                  <Slider
                    aria-label="yyAvaxGrowth"
                    size="small"
                    value={tradingFeeGrowth}
                    onChange={handleTradingFeeGrowthChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={v => `${(100 * v).toFixed(2)}%`}
                    min={0}
                    max={0.5}
                    step={0.0001}
                  />
                </Grid>
                <Grid item xs={3} md={2}>
                  <Typography variant="body2">
                    Farming rewards growth = {`${(100 * farmingRewardsGrowth).toFixed(2)}%`}
                  </Typography>
                </Grid>
                <Grid item xs={9} md={10}>
                  <Slider
                    aria-label="yyAvaxGrowth"
                    size="small"
                    value={farmingRewardsGrowth}
                    onChange={handleFarmingRewardsGrowthChange}
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
                      <XAxis dataKey="New AVAX Price" type="number" domain={[0, avaxPrice * 4]} tickCount={5} tickFormatter={v => `$${v.toFixed(0)}`} label={{ value: "New AVAX price", fill: theme.palette.text.primary, dy: 15 }} />
                      <YAxis orientation="left" domain={[-1, 0.5]} ticks={[-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5]} tickFormatter={v => `${100 * v}%`} label={{ value: "Net loss/gain from IL & other growth", fill: theme.palette.text.primary, angle: -90, dx: -30 }} />
                      <Tooltip formatter={v => `${(100 * v).toFixed(2)}%`} labelFormatter={label => `New price = $${label.toFixed(2)} per AVAX, (Old price = $${avaxPrice.toFixed(2)})`} contentStyle={{ backgroundColor: theme.palette.background.default, opacity: 0.75 }} labelStyle={{ color: theme.palette.text.primary }} />
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
              <MathJax.Provider>
                <Typography variant="body1">
                  Let the change in AVAX price,
                  <MathJax.Node inline formula={`\\enspace k = \\frac{New \\enspace AVAX \\enspace price}{Old \\enspace AVAX \\enspace price}`} />
                </Typography>
              </MathJax.Provider>
              <MathJax.Provider>
                <Typography variant="body1">
                  Let the percentage growth in yyAVAX value in terms of AVAX
                  <MathJax.Node inline formula={`\\enspace = g`} />
                </Typography>
              </MathJax.Provider>
              <MathJax.Provider>
                <Typography variant="body1">
                  <span style={{ color: theme.palette.avax.main }}>IL (1)</span>
                  <MathJax.Node formula={`IL_{1} = \\frac{2 \\sqrt k}{1 + k} - 1`} />
                </Typography>
              </MathJax.Provider>
              <MathJax.Provider>
                <Typography variant="body1">
                  <span style={{ color: theme.palette.info.main }}>IL (2)</span>
                  <MathJax.Node formula={`IL_{2} = \\frac{2 \\sqrt {k(1+g)}}{1 + k(1+g)} - 1`} />
                </Typography>
              </MathJax.Provider>
              <MathJax.Provider>
                <Typography variant="body1">
                  <span style={{ color: theme.palette.primary.main }}>IL* (3)</span>
                  <MathJax.Node formula={`IL_{3} = \\frac{(2+kg) \\sqrt {k(1+g)}}{1 + k(1+g)} - 1`} />
                </Typography>
              </MathJax.Provider>
              <Typography variant="subtitle2">
                * Impermanent loss combined with gains from yyAVAX accruing value against AVAX.
              </Typography>
              <br />
              <MathJax.Provider>
                <Typography variant="body1">
                  Then the overall net loss/gain once trading fee growth
                  <MathJax.Node inline formula={`\\: (t) \\:`} />
                  and farming rewards growth
                  <MathJax.Node inline formula={`\\: (f) \\:`} />
                  have been taken into account is as follows:
                </Typography>
              </MathJax.Provider>
              <MathJax.Provider>
                <Typography variant="body1">
                  <MathJax.Node formula={`Net \\: loss/gain = (IL + 1) (1 + t + f) - 1`} />
                </Typography>
              </MathJax.Provider>
            </Paper>
          </Grid>
        </Grid>
      </Container >
    </ThemeProvider >
  );
}

export default App;

import React, {ReactNodeArray, useEffect, useState} from 'react';
import Web3 from "web3";
import AmazonPayDonationJson from "./contracts/AmazonPayDonation.json";
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import {
  AppBar,
  Button,
  Container,
  CssBaseline, Divider,
  Grid,
  makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import {AbiItem} from "web3-utils";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
}));


const web3 = new Web3("https://ropsten.infura.io/v3/d19c109a22904d9ba92042f280e0e300");
const donationContract = new web3.eth.Contract(AmazonPayDonationJson.abi as AbiItem[], AmazonPayDonationJson.networks["3"].address);

const DonationDetails: React.FC<{ userId: string, count: number }> = ({count, userId}) => {

  const [details, setDetails] = useState<{ amount: string, oroId: string }>({amount: "0", oroId: "none"});

  useEffect(() => {
    donationContract.methods.donations(userId, count).call().then((result: any) => {
      setDetails({amount: result.amount, oroId: result.oroId});
    });
  }, [count]);


  return <TableRow key={count}>
    <TableCell component="th" scope="row">
      {details.oroId}
    </TableCell>
    <TableCell>
      {details.amount}
    </TableCell>
  </TableRow>;
}


interface DonationInfo {
  donationId: string;
  donationCount: string;
  donationTotal: string;
  details: ReactNodeArray
}

function App() {
  const [userId, setUserId] = useState<string | null>("");
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);
  const classes = useStyles();

  const handleSearchButton = async () => {
    if (userId) {
      const donationCount = await donationContract.methods.countDonation(userId).call();
      if (donationCount > 0) {
        const donationTotal = await donationContract.methods.totalDonation(userId).call();
        let rows: ReactNodeArray = [];
        for (let i = 0; i < donationCount; i++) {
          rows.push(<DonationDetails key={i} userId={userId} count={i}/>);
        }
        setDonationInfo({donationId: userId, donationCount, donationTotal, details: rows});
      } else {
        setDonationInfo({donationId: userId, donationCount, donationTotal: "0", details: []});
      }
    } else {
      setDonationInfo(null);
    }
  }


  return (<>
      <CssBaseline/>
      <AppBar position="relative">
        <Toolbar>
          <AccessibilityNewIcon className={classes.icon}/>
          <Typography variant="h6" color="inherit" noWrap>
            Amazon Pay Donation on Blockchain
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              寄付検索
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              下のテキストにUser Idを入力するといくら寄付をしたのかをブロックチェーンに問い合わせることができます。
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <TextField value={userId}
                             onChange={(event) => setUserId(event.target.value)}
                             label="User Id" fullWidth/>
                  <Button variant="outlined" onClick={handleSearchButton} color="primary" fullWidth
                          className={classes.heroButtons}>
                    検索
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>


          {donationInfo && (<Container maxWidth="sm">
            <Divider className={classes.divider}/>

            <Typography component="h3" variant="h3" align="center" color="textPrimary" gutterBottom>
              {donationInfo.donationId}の寄付金額は
            </Typography>
            <Grid container spacing={4} alignItems={"center"} justifyContent="center">
              <Grid item xs={5}>
                金額: {donationInfo.donationTotal}円<br/>
              </Grid>
              <Grid item xs={5}>
                寄付回数: {donationInfo.donationCount} 回
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Oro Id</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donationInfo.details}
                </TableBody>
              </Table>
            </TableContainer>

          </Container>)}
        </div>
      </main>
    </>
  );
}

export default App;

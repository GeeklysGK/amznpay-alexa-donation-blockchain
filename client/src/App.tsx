import React, {ReactNodeArray, useEffect, useState} from 'react';
import Web3 from "web3";
import AmazonPayDonationJson from "./contracts/AmazonPayDonation.json";
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
    marginBottom: theme.spacing(4),
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
}));


const web3 = new Web3("wss://ropsten.infura.io/ws/v3/d19c109a22904d9ba92042f280e0e300");
const donationContract = new web3.eth.Contract(AmazonPayDonationJson.abi as AbiItem[], AmazonPayDonationJson.networks["3"].address);
const amountToJpy = (amount: number) => {
  return new Intl.NumberFormat("ja-JP", {style: 'currency', currency: 'JPY'}).format(amount);
}

const DonationDetails: React.FC<{ userId: string, count: number }> = ({count, userId}) => {

  const [details, setDetails] = useState<{ amount: string, oroId: string, timestamp?: string }>({
    amount: "0",
    oroId: "none"
  });

  useEffect(() => {
    donationContract.methods.donations(userId, count).call().then((result: any) => {
      const date = new Date(result.timestamp * 1000);
      const timeStr = date.toLocaleTimeString("ja-JP")
      const dateStr = date.toLocaleDateString("ja-JP")
      const jpyTotal = amountToJpy(result.amount);
      setDetails({amount: jpyTotal, oroId: result.oroId, timestamp: `${dateStr} ${timeStr}`});
    });
  }, [count, userId]);


  return <TableRow key={count}>
    <TableCell component="th" scope="row">
      {details.oroId}
    </TableCell>
    <TableCell>
      {details.timestamp}
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
  const [total, setTotal] = useState<string>("0");
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);
  const classes = useStyles();

  const calculateTotal = async () => {
    const total = await donationContract.methods.total().call();
    const jpyTotal = amountToJpy(total);
    setTotal(jpyTotal);
  }

  const handleSearchButton = async () => {
    if (userId) {
      const donationCount = await donationContract.methods.countDonation(userId).call();
      if (donationCount > 0) {
        const donationTotal = await donationContract.methods.totalDonation(userId).call();
        const donationTotalJpy = amountToJpy(donationTotal);
        let rows: ReactNodeArray = [];
        for (let i = 0; i < donationCount; i++) {
          rows.push(<DonationDetails key={i} userId={userId} count={i}/>);
        }
        setDonationInfo({donationId: userId, donationCount, donationTotal: donationTotalJpy, details: rows});
      } else {
        setDonationInfo({donationId: userId, donationCount, donationTotal: "0", details: []});
      }
    } else {
      setDonationInfo(null);
    }
  }

  useEffect(() => {
    donationContract.events.Donated({
      fromBlock: 'latest'
    }, function (error: any, event: any) {
      calculateTotal().then(r => console.log("calculateTotal: Donated event"));
    });
    calculateTotal().then(r => console.log("calculateTotal"));
    return () => {
      web3.eth.clearSubscriptions(() => {
      })
    }
  }, []);


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
          <Container>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              合計金額 <span>{total}</span> 円
            </Typography>

            <Divider className={classes.divider}/>

            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              下のテキストにUser Idを入力するといくら寄付をしたのかをブロックチェーンに問い合わせることができます。
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Typography variant={"body1"}>
                    sample id: amzn1.account.AENQ5PFWRWURAEY4NV2DU5VRFQBQ
                  </Typography>
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


          {donationInfo && (<Container>
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
                    <TableCell>Amazon決済ID</TableCell>
                    <TableCell>日付</TableCell>
                    <TableCell>寄付金額</TableCell>
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

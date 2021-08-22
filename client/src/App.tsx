import React, {ReactNodeArray, useEffect, useState} from 'react';
import Web3 from "web3";
import AmazonPayDonationJson from "./contracts/AmazonPayDonation.json";
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper, Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";

import Skeleton from '@material-ui/lab/Skeleton';
import {AbiItem} from "web3-utils";
import {Alert} from "@material-ui/lab";

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
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.primary.dark,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));


const web3 = new Web3("wss://ropsten.infura.io/ws/v3/d19c109a22904d9ba92042f280e0e300");
const contractAddress = AmazonPayDonationJson.networks["3"].address;
const donationContract = new web3.eth.Contract(AmazonPayDonationJson.abi as AbiItem[], contractAddress);

const ShortId = ({id}: { id: string }) => {
  let showId = id;
  if (id.length > 5) {
    const start = id.slice(0, 10);
    const end = id.slice(-5);
    showId = `${start}...${end}`;
  }
  return (
    <>
      {showId} の寄付金額の検索結果
    </>
  )
}

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


  return (<TableRow key={count}>
    <TableCell component="th" scope="row">
      {details.oroId}
    </TableCell>
    <TableCell>
      {details.timestamp}
    </TableCell>
    <TableCell>
      {details.amount}
    </TableCell>
  </TableRow>);
}


interface DonationInfo {
  donationId: string;
  donationCount: string;
  donationTotal: string;
  details: ReactNodeArray
}

function App() {
  const [userId, setUserId] = useState<string | null>("");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [total, setTotal] = useState<string>("0");
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationText, setNotificationText] = useState<{ message: string, transactionHash?: string }>({message: ""});
  const classes = useStyles();

  const calculateTotal = async () => {
    const total = await donationContract.methods.total().call();
    const jpyTotal = amountToJpy(total);
    setTotal(jpyTotal);
  }

  const handleSearchButton = async () => {
    if (userId) {
      setButtonLoading(true);
      const donationCount = await donationContract.methods.countDonation(userId).call();
      if (donationCount > 0) {
        const donationTotal = await donationContract.methods.totalDonation(userId).call();
        const donationTotalJpy = amountToJpy(donationTotal);
        let rows: ReactNodeArray = [];
        for (let i = donationCount - 1; i >= 0; i--) {
          rows.push(<DonationDetails key={i} userId={userId} count={i}/>);
        }
        setDonationInfo({donationId: userId, donationCount, donationTotal: donationTotalJpy, details: rows});
      } else {
        setDonationInfo({donationId: userId, donationCount, donationTotal: "0", details: []});
      }
      setButtonLoading(false);
    } else {
      setDonationInfo(null);
    }
  }

  const handleCloseNotification = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
  };

  useEffect(() => {
    donationContract.events.Donated({
      fromBlock: 'latest'
    }, function (error: any, event: any) {
      console.log(event);
      setNotificationText({
        message: `今、${amountToJpy(event.returnValues.amount)}の寄付がありました`,
        transactionHash: event.transactionHash
      });
      setNotificationOpen(true);
      calculateTotal().then(r => {
      });
    });
    calculateTotal().then(r => setLoading(false));
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
            <Typography variant={"h3"} align="center" color="textPrimary">合計金額</Typography>
            <Typography component="h1" variant="h1" align="center" color="textPrimary" gutterBottom>
              {loading ? <Skeleton animation="wave"/> : <><span>{total}</span>円</>}
            </Typography>

            <Divider className={classes.divider}/>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={4}>
                <Card>
                  <CardHeader title={"Contract Info"}/>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText
                          secondary={"Ropsten"}
                          primary={"Network"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={<Link href={`https://ropsten.etherscan.io/address/${contractAddress}`}
                                           target={"_blank"}>{contractAddress}</Link>}
                          primary={"Contract Address"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={"Contract Source"}
                          secondary={<Link
                            href={"https://github.com/GeeklysGK/amznpay-alexa-donation-blockchain/blob/master/contracts/AmazonPayDonation.sol"}
                            target={"_blank"}>リポジトリで見る</Link>}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={"Page Source"}
                          secondary={<Link
                            href={"https://github.com/GeeklysGK/amznpay-alexa-donation-blockchain/tree/master/client"}
                            target={"_blank"}>リポジトリで見る</Link>}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={"Document"}
                          secondary={<Link href={"https://johna1203.gitbook.io/amazon-pay-for-alexa"}
                                           target={"_blank"}>Gitbook</Link>}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={8}>
                <Card>
                  <CardHeader title={"寄付検索"}/>
                  <CardContent>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>
                      Amazon PayのUser Idで検索するといくら寄付をしたのかをブロックチェーンに問い合わせることができます
                    </Typography>
                    <div className={classes.heroButtons}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                          <Typography variant={"caption"} gutterBottom>
                            Sample Id1: <span>amzn1.account.AENQ5PFWRWURAEY4NV2DU5VRFQBQ</span>
                          </Typography>
                          <br/>
                          <Typography variant={"caption"} gutterBottom>
                            Sample Id2: <span>amzn1.account.AFYWLLBQXZ32EFHVUCFC47MXQKBA</span>
                          </Typography>
                          <TextField value={userId}
                                     onChange={(event) => setUserId(event.target.value)}
                                     label="Amazon Pay user id" fullWidth/>
                          <div className={classes.wrapper}>
                            <Button variant="outlined"
                                    disabled={buttonLoading || !userId}
                                    onClick={handleSearchButton}
                                    color="primary" fullWidth
                                    className={classes.heroButtons}>
                              検索
                            </Button>
                            {buttonLoading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                          </div>
                        </Grid>
                      </Grid>
                    </div>

                    {donationInfo && (
                      <Container>
                        <Card>
                          <CardHeader title={<ShortId id={donationInfo.donationId}/>}/>

                          <CardContent>
                            <Grid container spacing={4} alignItems={"center"} justifyContent="center">
                              <Grid item xs={6}>
                                <Typography align="center"
                                            variant={"h4"}>合計: {donationInfo.donationTotal}円<br/></Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography align="center"
                                            variant={"h4"}>寄付回数: {donationInfo.donationCount} 回</Typography>
                              </Grid>
                            </Grid>
                            <Divider className={classes.divider}/>
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
                          </CardContent>
                        </Card>
                      </Container>
                    )}

                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </div>
      </main>

      <Snackbar anchorOrigin={{vertical: "top", horizontal: "right"}} open={notificationOpen} autoHideDuration={10000}
                onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity="success">
          {notificationText.message} <br />
          <Typography variant={"caption"}>
            <Link target={"_blank"} href={`https://ropsten.etherscan.io/tx/${notificationText.transactionHash}`}>{notificationText.transactionHash}</Link>
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;

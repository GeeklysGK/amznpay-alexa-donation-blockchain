import React, { useEffect, useState } from 'react';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import { API_SERVER_URL } from "./constant";
import {
  AppBar,
  Box,
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
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";

import Skeleton from '@material-ui/lab/Skeleton';
import { Alert } from "@material-ui/lab";
import axios from "axios";
import { EventData } from "web3-eth-contract";
import donationContract, { contractAddress } from "./utils/donationContract";
import amountToJpy from "./utils/amountToJpy";
import SearchDonation from "./component/SearchDonation";
import TransactionTable from "./component/TransactionTable";

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
  alert: {
    marginBottom: theme.spacing(3),
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {

  const [transactions, setTransactions] = useState<EventData[]>([]);

  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = React.useState(0);

  const [userIdForDonation, setUserIdForDonation] = useState("test");
  const [donationButtonLoading, setDonationButtonLoading] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");

  const [total, setTotal] = useState<string>("0");

  //notification
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationText, setNotificationText] = useState<{ message: string, transactionHash?: string }>({ message: "" });

  const classes = useStyles();

  const calculateTotal = async () => {
    const total = await donationContract.methods.totalAmount().call();
    const jpyTotal = amountToJpy(total);
    setTotal(jpyTotal);
  }

  const handleCloseNotification = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
  };
  const handleDonationButton = () => {
    setDonationButtonLoading(true);
    axios.post(`${API_SERVER_URL}/sqs`, {
      amount: "500",
      accessToken: "dummy",
      oroId: "DONATION-FROM-WEB",
      userId: userIdForDonation || "test1"
    }).then((response) => {
      console.log("response", response.data);
      setDonationMessage("寄付のリクエストを受け取りました、寄付が完了するまでしばらくお待ち下さい。");
      setTimeout(() => setDonationMessage(""), 6000);
    }).catch((error: any) => {
      console.log("error", error);
    }).finally(() => {
      setTimeout(() => {
        setDonationButtonLoading(false)
      }, 6000);

    });
  }
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };


  useEffect(() => {
    donationContract.events.Donated({
      fromBlock: 'latest',
    }, function (error: any, event: EventData) {
      const {userId, amount} = event.returnValues;
      setNotificationText({
        message: `${userId}から${amountToJpy(amount)}の寄付がありました`,
        transactionHash: event.transactionHash
      });
      setNotificationOpen(true);

      setTransactions(t => [event, ...t]);
      calculateTotal().then(r => {});
    });

    donationContract.getPastEvents("Donated", {
      fromBlock: 0,
      toBlock: "latest"
    },).then((events) => {
      setTransactions(events.reverse());
    })

    calculateTotal().then(r => setLoading(false));
  }, []);


  return (<>
      <CssBaseline/>
      <AppBar position="relative">
        <Toolbar>
          <AccessibilityNewIcon className={classes.icon}/>
          <Typography variant="h6" color="inherit" noWrap>
            Amazon Pay Donation on Blockchain | 2021 AWS Dev Day Online Japan
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container>
            <Typography variant={"h4"} align="center" color="textPrimary">合計金額</Typography>
            <Typography component="h2" variant="h2" align="center" color="textPrimary" gutterBottom>
              {loading ? <Skeleton animation="wave"/> : <><span>{total}</span>円</>}
            </Typography>

            <Divider className={classes.divider}/>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title={"Contract Info"}/>
                  <CardContent>
                    <div>
                      <Alert color={"warning"} className={classes.alert}>
                        <Typography variant={"caption"}>実際にお金がかかる事はありません！</Typography>
                      </Alert>

                      {donationMessage && <Alert className={classes.alert}>{donationMessage}</Alert>}

                      <TextField label={"UserId"} value={userIdForDonation}
                                 fullWidth
                                 onChange={(e) => setUserIdForDonation(e.target.value)}/>
                      <div className={classes.wrapper}>
                        <Button onClick={handleDonationButton}
                                className={classes.heroButtons}
                                disabled={donationButtonLoading}
                                fullWidth
                                variant={"contained"}
                                color={"primary"}>５００円寄付してみる</Button>
                        {donationButtonLoading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                      </div>
                    </div>
                    <Divider/>
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
              <Grid item xs={12} md={8}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                  <Tab label="寄付検索" {...a11yProps(0)} />
                  <Tab label="全体の履歴" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                  <SearchDonation/>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <TransactionTable items={transactions} />
                </TabPanel>

              </Grid>
            </Grid>
          </Container>
        </div>
      </main>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={notificationOpen} autoHideDuration={10000}
                onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity="success">
          {notificationText.message} <br/>
          <Typography variant={"caption"}>
            <Link target={"_blank"}
                  href={`https://ropsten.etherscan.io/tx/${notificationText.transactionHash}`}>{notificationText.transactionHash}</Link>
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress, Container, Divider,
  Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import React, { ReactNodeArray, useState } from "react";
import amountToJpy from "../utils/amountToJpy";
import donationContract from "../utils/donationContract";
import DonationDetails from "./DonationDetails";
import ShortId from "./ShortId";

interface DonationInfo {
  donationId: string;
  donationCount: string;
  donationTotal: string;
  details: ReactNodeArray
}

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


const SearchDonation = () => {
  const classes = useStyles();
  const [userId, setUserId] = useState<string | null>("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);

  const handleSearchButton = async () => {
    if (userId) {
      setButtonLoading(true);
      const donationCount = await donationContract.methods.countDonation(userId).call();
      if (donationCount > 0) {
        const donationTotal = await donationContract.methods.totalDonation(userId).call();
        const donationTotalJpy = amountToJpy(donationTotal);
        let rows: ReactNodeArray = [];
        for (let i = donationCount - 1; i >= 0; i--) {
          // rows.push(<DonationDetails key={i} userId={userId} count={i}/>);
        }
        setDonationInfo({ donationId: userId, donationCount, donationTotal: donationTotalJpy, details: rows });
      } else {
        setDonationInfo({ donationId: userId, donationCount, donationTotal: "0", details: [] });
      }
      setButtonLoading(false);
    } else {
      setDonationInfo(null);
    }
  }


  return (
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
  )
}

export default SearchDonation
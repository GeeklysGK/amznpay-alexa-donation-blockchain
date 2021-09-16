import {
  Button,
  Card,
  CardContent,
  CardHeader, Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  makeStyles,
  TextField,
  Typography
} from "@material-ui/core";
import React, { FormEvent, MouseEventHandler, useState } from "react";
import amountToJpy from "../utils/amountToJpy";
import donationContract from "../utils/donationContract";
import ShortId from "./ShortId";
import SearchResultTable from "./SearchResultTable";
import SearchResultTableRow from "./SearchResultTableRow";

interface DonationInfo {
  donationId: string;
  donationCount: string;
  donationTotal: string;
  rows: any[]
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

  const handlerFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearchButton().then(r => console.log("handleSearchButton"))
  }

  const handleSearchButton = async () => {
    if (userId) {
      setButtonLoading(true);
      const donationCount = await donationContract.methods.countDonation(userId).call();
      if (donationCount > 0) {
        const donationTotal = await donationContract.methods.totalDonationAmountByUser(userId).call();
        const donationTotalJpy = amountToJpy(donationTotal);
        let rows: any[] = [];
        for (let i = donationCount - 1; i >= 0; i--) {
          rows.push(<SearchResultTableRow key={i} userId={userId} count={i}/>);
        }
        setDonationInfo({ donationId: userId, donationCount, donationTotal: donationTotalJpy, rows: rows });
      } else {
        setDonationInfo({ donationId: userId, donationCount, donationTotal: "0", rows: [] });
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
              <form onSubmit={handlerFormSubmit}>
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
              </form>
            </Grid>
          </Grid>
        </div>

        {
          donationInfo && (
            <Container>
              <Chip label={<ShortId id={donationInfo.donationId}/>} />

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
              <SearchResultTable rows={donationInfo.rows}/>
            </Container>
          )
        }

      </CardContent>
    </Card>
  )
}

export default SearchDonation
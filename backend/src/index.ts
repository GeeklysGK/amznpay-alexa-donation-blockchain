import dotenv from 'dotenv';
import Twit from "twit";
import axios from "axios";

dotenv.config({path: "../.env"});

const T = new Twit({
  consumer_key: process.env.TWITER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const stream = T.stream('statuses/filter', {track:'#TESTTEST1203'});

stream.on('connect', () => {
  console.log('connect');
});

stream.on('tweet', (tweet) => {
  axios.post(
    `${process.env.API_SERVER_URL}/sqs`,
    {
      "accessToken": "dummy",
      "oroId": "P03-XXXXXXX-XXXXXX",
      "userId": tweet.user.screen_name,
      "amount": 1000
    }
  ).then((result) => console.log(result.data));
});

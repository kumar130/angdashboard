const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
app.use(cors());

const REGION = process.env.AWS_REGION || 'us-east-1';
const ROLE_NAME = 'TagReportReadRole';

const accounts = {
  "111111111111": { bucket: "bucket-a" },
  "222222222222": { bucket: "bucket-b" }
};

async function fetchCsv(accountId) {

  const account = accounts[accountId];
  if (!account) throw new Error("Invalid account");

  const sts = new AWS.STS({ region: REGION });

  const assumed = await sts.assumeRole({
    RoleArn: `arn:aws:iam::${accountId}:role/${ROLE_NAME}`,
    RoleSessionName: 'TagDashboardSession'
  }).promise();

  const s3 = new AWS.S3({
    region: REGION,
    credentials: {
      accessKeyId: assumed.Credentials.AccessKeyId,
      secretAccessKey: assumed.Credentials.SecretAccessKey,
      sessionToken: assumed.Credentials.SessionToken
    }
  });

  const data = await s3.getObject({
    Bucket: account.bucket,
    Key: 'tag-report.csv'
  }).promise();

  return data.Body.toString('utf-8');
}

app.get('/api/accounts', (req, res) => {
  res.json(Object.keys(accounts));
});

app.get('/api/report', async (req, res) => {
  try {
    const accountId = req.query.account;
    const csv = await fetchCsv(accountId);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

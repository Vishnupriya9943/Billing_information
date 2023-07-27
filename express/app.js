const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' });

// Create an AWS service object for interacting with AWS Cost Explorer API
const costExplorer = new AWS.CostExplorer({ apiVersion: '2017-10-25' });

// Route to get AWS billing information
app.get('/billing', async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const params = {
      TimePeriod: {
        Start: startDate.toISOString().split('T')[0],
        End: endDate.toISOString().split('T')[0],
      },
      Granularity: 'MONTHLY',
      Metrics: ['AmortizedCost'],
    };

    const data = await costExplorer.getCostAndUsage(params).promise();

    res.json(data);
  } catch (err) {
    console.error('Error fetching billing information:', err);
    res.status(500).json({ error: 'Failed to fetch billing information' });
  }
});

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

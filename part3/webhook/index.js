const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

app.post('/github-webhook', (req, res) => {
	console.log('Webhook received:', new Date());
	exec('bash ../deploy.sh', (err, stdout, stderr) => {
    		if (err) {
      			console.error(`❌ Deploy failed: ${err}`);
      			return res.status(500).send('Deploy error');
    		}
    	console.log(`✅ Deploy output:\n${stdout}`);
    	res.status(200).send('Deploy done');
  });
});

app.listen(9000, () => {
  console.log('Webhook server running on port 9000');
});


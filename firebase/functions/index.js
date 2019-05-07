const functions = require('firebase-functions');
const admin = require('firebase-admin');
var firebase = admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: true}));

app.post('/heartbeat', (req, res) => {
  db = firebase.database().ref(`/${req.body.machine_id}`)
  db.set({
    'last_heartbeat': Date.now(),
    'online': true
  })
  res.status(200).json({'success': true});
});

exports.api = functions.https.onRequest(app);

exports.scheduled_function = functions.pubsub.schedule('* * * * *').onRun((context) => {
  function find_offline() {
    db = firebase.database()
    ref = db.ref('/')
    current_epoch = Date.now()
    ref.orderByChild('last_heartbeat').endAt(current_epoch-5000).once('value', function(data) {
      var bulk_insert = {}
      Object.keys(data.val()).forEach(function(key) {
        bulk_insert[`${key}/online`] = false
      });
      ref.update(bulk_insert)
    });
    setTimeout(find_offline, 6000)
  }
  find_offline()
  return true
});

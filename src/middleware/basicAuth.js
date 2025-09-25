const auth = require('basic-auth');
const userStore = require('../users/userStore');

module.exports = async function basicAuth(req, res, next) {
  const credentials = auth(req);
  if (!credentials || !credentials.name || !credentials.pass) {
    res.set('WWW-Authenticate', 'Basic realm="User Visible Realm"');
    return res.status(401).send('Authentication required');
  }
  if (!(await userStore.verifyUser(credentials.name, credentials.pass))) {
    res.set('WWW-Authenticate', 'Basic realm="User Visible Realm"');
    return res.status(401).send('Invalid credentials');
  }
  next();
};

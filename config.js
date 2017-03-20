var config = {
  production: {
    db_config:{
      //properties
      host : 'us-cdbr-iron-east-03.cleardb.net',
      user : 'bc5d91c9f9e722',
      password : '30ea785d',
      database : 'heroku_8ca4fc2f56bc78e',
    },
  },
  default: {
    db_config:{
      //properties
      host : 'localhost',
      user : 'root',
      password : 'root',
      database : 'wedding',
      port: '3307'
    },
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}

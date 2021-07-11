module.exports = {
  apps : [{
    name   : "morphin",
    script : "./bin/www",
    env_production: {
      NODE_ENV: "production"
   },
   interpreter_args: "--experimental-wasm-threads --experimental-wasm-bulk-memory"
  }]
}

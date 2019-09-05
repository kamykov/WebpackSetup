/* eslint-disable prefer-template, no-console */
module.exports = (err, stats) => {
  console.log(stats.hasErrors());

  if (err) {
    console.error(err.stack || err);

    if (err.details) {
      console.error(err.details);
    }
  }

  process.stdout.write(stats.toString({colors: {level: 2, hasBasic: true, has256: true}}) + '\n');

  if (stats.hasErrors()) {
    process.on('exit', () => {process.exit(2)});
  }
};

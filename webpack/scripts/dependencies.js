/* eslint-disable import/no-extraneous-dependencies, no-console */
const check = require('check-dependencies');

check(
  {
    checkGitUrls: true,
  },
  (result) => {
    // log errors if dependencies are not ok
    if (!result.depsWereOk && result.error) {
      result.error.forEach((message) => {console.error(message)});
    }

    // status is 0 if successful, 1 otherwise
    process.exit(result.status);
  }
);

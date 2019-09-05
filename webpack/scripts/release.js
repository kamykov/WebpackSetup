/* eslint-disable import/no-extraneous-dependencies, import/no-dynamic-require, no-console */
const fs = require('fs');
const childProcess = require('child_process');
const semver = require('semver');

const ROOT_DIR = process.cwd();
const PACKAGE = require(`${ROOT_DIR}/package.json`);

const {
  v: VERSION,
  p: PROJECT,
} = require('yargs')
  .usage('Usage: $0 -v [semver]')
  .usage('Usage: $1 -p [project]')
  .demand(['v'])
  .argv;

const OPTIONS = {stdio: [0, 1, 2]};
let CURRENT_VERSION = PACKAGE.version;

try {
  if (PROJECT) {
    if (PACKAGE.version.length > 5) {
      CURRENT_VERSION = CURRENT_VERSION.split(`-${PROJECT}.`)[1]; // eslint-disable-line
    } else {
      CURRENT_VERSION = '0.0';
    }

    if (parseInt(CURRENT_VERSION.split('.').join(''), 10) >= parseInt(VERSION.toString().split('.').join(''), 10)) {
      throw new Error(`New version (${VERSION}) must be bigger then old one (${CURRENT_VERSION})!`);
    }
  } else {
    semver.valid(VERSION);
    if (!semver.gt(VERSION, CURRENT_VERSION)) {
      throw new Error(`New version (${VERSION}) must be bigger then old one (${CURRENT_VERSION})!`);
    }
  }

  if (PROJECT) {
    if (PACKAGE.version.length > 5) {
      PACKAGE.version = `${PACKAGE.version.substring(0, 5)}-${PROJECT}.${VERSION}`;
      console.log(PACKAGE.version.substring(0, 5));
    } else {
      PACKAGE.version = `${PACKAGE.version}-${PROJECT}.${VERSION}`;
    }
  } else {
    PACKAGE.version = VERSION;
  }

  fs.writeFileSync(`${ROOT_DIR}/package.json`, JSON.stringify(PACKAGE, null, '  '), 'utf8');

  childProcess.execSync(`git commit -a -m "new release v${PACKAGE.version}"`, OPTIONS);
  childProcess.execSync(`git tag -a v${PACKAGE.version} -m "new release v${PACKAGE.version}"`, OPTIONS);

  console.log('Push changes to finalize new release: git push && git push --tags');
} catch (e) {
  console.error('Release failed!');
  console.error(e.toString());
}

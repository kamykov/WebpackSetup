/* eslint-disable import/no-extraneous-dependencies, import/no-dynamic-require */
const os = require('os');
const git = require('git-rev-sync');

const ROOT_DIR = process.cwd();
const PACKAGE = require(`${ROOT_DIR}/package.json`);

const {EOL} = os;
const REVISION = git.long();
const DATE = new Date();

const {name, version, author} = PACKAGE;

module.exports = `${name}${EOL} v ${version} rev ${REVISION}${EOL}${DATE}${EOL}Copyright ${author}`;

'use strict';
const fs = require('fs');
const path = require('path');

// The stable version should always be <major>.<minor_even_number>.patch
// For pre-release builds, we keep the major, make the minor an odd number with +1,
// and derive the patch from the ADO build number timestamp.
const packageJsonPath = path.resolve(__dirname, '..', 'vscode-extension', 'package.json');
const json = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const stableVersion = json.version.match(/(\d+)\.(\d+)\.(\d+)/);
const major = stableVersion[1];
const minor = stableVersion[2];

// Build Number $(Date:yyyyMMdd)$(Rev:.r) (e.g. 20220219.1)
// For the patch number, remove the "." and if the revision is
// smaller than 10, add a leading 0 (e.g. 2022021901)
const buildNumber = process.argv[process.argv.length - 1];
const dateSegment = buildNumber.split('.')[0];
const revisionSegment = buildNumber.split('.')[1];
const patch = dateSegment.concat(
	revisionSegment.length === 1 ? `0${revisionSegment}` : revisionSegment,
);

const prereleasePackageJson = Object.assign(json, {
	version: `${major}.${Number(minor) + 1}.${patch}`,
});
fs.writeFileSync(packageJsonPath, JSON.stringify(prereleasePackageJson));

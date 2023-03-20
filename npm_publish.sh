#!/bin/bash

echo "Update the version in package.json before publishing"

npm run prepublish

npm run publish:npm

npm publish --access==public


rm -r lib

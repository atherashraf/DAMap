#!/bin/bash

echo "Update the version in package.json before publishing"

npm run prepare

#npm run prepublishOnly

npm publish --access==public


#rm -r lib

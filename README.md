# dam-management-sdk-js

> Javascript SDK for the Amplience DAM API

The management sdk is designed to help build back-office applications such as content automation or web-hook integrations. Please keep in mind the management api is rate limited.

## Installation

Using npm:

```sh
npm install dam-management-sdk-js --save
```

## Usage

This sdk can be used with both typescript running on Node.js or regular Javascript running on Node.js. TypeScript type definition files are bundled with the library along with precompiled Javascript versions of all TypeScript classes.

### TypeScript

```typescript
import { DAM } from 'dam-management-sdk-js';
```

### Node.js

```js
var dam = require('dam-management-sdk-js');
```

### Authentication

The DAM API uses OAuth 2 to authenticate requests.
When creating an API client you can provide your API key and secret
and the client will handle creating authentication tokens.

For assistance creating API credentials and configuring permissions please contact [Amplience Support](https://support.amplience.com/).

```typescript
const client = new DAM({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});
```

OR

```javascript
var client = new dam.DAM({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});
```

### Making requests

All endpoints can be requested directly by calling the appropriate method on the client instance. This will return a native promise that will yield the resource or an error (e.g. if you do not have permission to access the resource).

```javascript
var assets = client.assets.list();
var settings = client.settings.get();
```

Once you have a top-level resource, you can lookup related resources and perform related actions by calling one of the methods under the “related” object. Each resource has a different set of related resources and actions. These are functionally identical to the methods on the client with the resource's id, and are simply provided for your convenience.

```javascript
var asset = await client.assets.get('51e1e563-d098-4482-9ed8-6d4b54763ad1');
var assetVersion = await asset.related.version(1);
var assetDownload = await asset.related.download();
await asset.related.delete();
```

## Getting Help

If you need help using the sdk please reach out using one of the following channels:

- Ask a question on [StackOverflow](https://stackoverflow.com/) using the tag `amplience-dam`
- Open a support ticket with [Amplience Support](https://support.amplience.com/)
- Contact your [Amplience Customer Success](https://amplience.com/customer-success) representative
- If you have found a bug please report it by [opening an issue](https://github.com/amplience/dam-management-sdk-js/issues/new)

## License

This software is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),

Copyright 2021 Amplience

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
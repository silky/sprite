import {IncomingMessage, ServerResponse} from 'http'
import {parse} from 'url'
import getScreenshot from './util/screenshot'

const buildPage = (svg: string): string => {
  return `
<head>
  <style>
    .container {
      display: inline-block;
      padding: 40px;
    }
    .background {
      display: inline-block;
      padding: 30px;
      background-color: white;
      box-shadow: 0 0 30px #333;
    }
    .background svg {
      width: 1000px !important;
      max-width: initial !important;
    }
  </style>
</head>
<body>
  <div id="target" class="container">
    <div class="background mermaid">
      ${svg}
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/8.0.0/mermaid.min.js"></script>
  <script>mermaid.initialize({startOnLoad:true});</script>
</body>
`
}

const getCodeFromPath = (path: string) => {
  let url = path.slice(7)
  return url
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const {pathname = '/', query = {}} = parse(req.url, true)
  // const { type = 'png', quality, fullPage } = query;
  const code = getCodeFromPath(pathname)
  const decoded = Buffer.from(code, 'base64').toString()

  const page = buildPage(decoded)

  const file = await getScreenshot(page, 'target')
  res.statusCode = 200
  res.setHeader('Content-Type', `image/png`)
  res.end(file)
}

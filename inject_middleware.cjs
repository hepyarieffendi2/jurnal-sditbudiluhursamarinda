const fs = require('fs');

const configCode = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const syncAiPlugin = () => ({
  name: 'sync-ai-plugin',
  configureServer(server) {
    server.middlewares.use('/api/sync-ai', (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const payload = JSON.parse(body);
            const { label, data } = payload;
            
            const filePath = path.resolve(__dirname, 'src/data/areaSentraCycle2.js');
            let content = fs.readFileSync(filePath, 'utf8');
            
            let idx = content.indexOf(\`label: '\${label}'\`);
            if (idx === -1) idx = content.indexOf(\`label: "\${label}"\`);
            
            if (idx !== -1) {
              let dataIdx = content.indexOf('data: {', idx);
              if (dataIdx !== -1) {
                let bracketCount = 0;
                let dataEndIdx = -1;
                for (let i = dataIdx + 5; i < content.length; i++) {
                  if (content[i] === '{') bracketCount++;
                  if (content[i] === '}') {
                    bracketCount--;
                    if (bracketCount === 0) {
                      dataEndIdx = i + 1;
                      break;
                    }
                  }
                }
                
                if (dataEndIdx !== -1) {
                  const stringified = JSON.stringify(data, null, 2);
                  // Remove first and last brace so we can insert into data: { ... }
                  const innerContent = stringified.substring(1, stringified.length - 1);
                  const formattedInner = innerContent.split('\\n').map((line) => '              ' + line).join('\\n');
                  
                  const replacement = \`data: {\\n\${formattedInner}\\n            }\`;
                  
                  content = content.substring(0, dataIdx) + replacement + content.substring(dataEndIdx);
                  
                  fs.writeFileSync(filePath, content, 'utf8');
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true }));
                  return;
                }
              }
            }
            
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, message: 'Material not found' }));
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), syncAiPlugin()],
})
`;

fs.writeFileSync('vite.config.js', configCode, 'utf8');
console.log('vite.config.js updated successfully!');

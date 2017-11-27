/**
 * Recursively fires `npm ${command}` in subdirectories containing npm repos
 * @source https://stackoverflow.com/a/38577379
 */

const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

const root = process.cwd()
const command = process.argv[2];

if (!command) {
   console.log('===================================================================')
   console.log(`No npm command issued`)
   console.log('===================================================================')
   
   process.exit(1);
}

npm_install_recursive(root)

// Since this script is intended to be run as a "preinstall" command,
// it will be `npm ${command}` inside root in the end.
console.log('===================================================================')
console.log(`Performing "npm ${command}" inside root folder`)
console.log('===================================================================')

function npm_install_recursive(folder)
{
   const has_package_json = fs.existsSync(path.join(folder, 'package.json'))

   if (!has_package_json && path.basename(folder) !== 'code')
   {
      return
   }

   // Since this script is intended to be run as a "preinstall" command,
   // skip the root folder, because it will be `npm ${command}`ed in the end.
   if (folder !== root && has_package_json)
   {
      console.log('===================================================================')
      console.log(`Performing "npm ${command}" inside ${folder === root ? 'root folder' : './' + path.relative(root, folder)}`)
      console.log('===================================================================')

      npm_install(folder)
   }

   for (let subfolder of subfolders(folder))
   {
      npm_install_recursive(subfolder)
   }
}

function npm_install(where)
{
   child_process.execSync(`npm ${command}`, { cwd: where, env: process.env, stdio: 'inherit' })
}

function subfolders(folder)
{
   return fs.readdirSync(folder)
      .filter(subfolder => fs.statSync(path.join(folder, subfolder)).isDirectory())
      .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
      .map(subfolder => path.join(folder, subfolder))
}

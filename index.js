require('dotenv').config();
const webdav = require('webdav-server').v2;

// console.log(process.env.APP_PORT)
// console.log(process.env.APP_USER)
// console.log(process.env.APP_PASSWORD)
// console.log(process.env.APP_DATA_PATH)

// User manager (tells who are the users)
const userManager = new webdav.SimpleUserManager();
const user = userManager.addUser(
    process.env.APP_USER,
    process.env.APP_PASSWORD,
    false
);

// Privilege manager (tells which users can access which files/folders)
const privilegeManager = new webdav.SimplePathPrivilegeManager();
privilegeManager.setRights(user, '/', ['all']);

const server = new webdav.WebDAVServer({
    // HTTP Digest authentication with the realm 'Default realm'
    httpAuthentication: new webdav.HTTPDigestAuthentication(userManager, 'Default realm'),
    privilegeManager: privilegeManager,
    port: process.env.APP_PORT,
});

server.setFileSystem('/media', new webdav.PhysicalFileSystem(process.env.APP_DATA_PATH), (success) => {
    server.start(() => console.log('READY on port: ' + process.env.APP_PORT));
});
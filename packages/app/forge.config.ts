export default {
  packagerConfig: {
    dir: './dist',
    out: './binaries'
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: '',
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-pkg',
      config: {
        keychan: ''
      }
    },
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          categories: ['Social'],
          mimeType: ['']
        }
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Erik Isidore',
          homepage: 'https://github.com/iErik/Medley#readme'
        }
      }
    },
    {
      name: '@electron-forge/maker-appx',
      config: {
        publisher: 'CN=',
        devCert: 'C:\\',
        certPass: ''
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [ 'darwin', 'linux' ],
      config: { }
    }
  ]
}

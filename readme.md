# vuesch-dl

A powerful command-line tool for downloading courses from Vue School.

![Vue School Downloader](https://img.shields.io/badge/Vue%20School-Downloader-42b883)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

-   📚 Download individual courses or all available courses
-   🔄 Resume interrupted downloads
-   📂 Organize videos by course in a clean directory structure
-   🎯 Selective lesson downloading
-   🛠️ Robust error handling and retry mechanisms

## Requirements

Before using this tool, make sure you have the following installed:

-   **Node.js** (v18 or higher)
-   **yt-dlp** - Download the executable from [yt-dlp's GitHub repository](https://github.com/yt-dlp/yt-dlp/releases) and place it in the `bin` folder

## Installation

### Local Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/yourusername/vuesch-dl.git
cd vuesch-dl
npm install
```

### Global Installation

To install the tool globally and use it from anywhere, run:

```bash
npm install -g ./
```

This will make the `vuesch-dl` command available globally.

## Usage

```bash
vuesch-dl [courseUrl] [options]
```

### Options

-   `-e, --email <email>` - Your Vue School email
-   `-p, --password <password>` - Your Vue School password
-   `-d, --directory <directory>` - Directory to save videos (default: `./downloads`)
-   `-a, --all` - Download all available courses
-   `-f, --force` - Force download even if course exists

## Examples

### Download a specific course

```bash
vuesch-dl https://vueschool.io/courses/vuejs-3-fundamentals -e your@email.com -p yourpassword
```

### Download all courses

```bash
vuesch-dl -a -e your@email.com -p yourpassword
```

### Specify a custom download directory

```bash
vuesch-dl https://vueschool.io/courses/vuejs-3-fundamentals -e your@email.com -p yourpassword -d ./my-courses
```

### Force re-download of a course

```bash
vuesch-dl https://vueschool.io/courses/vuejs-3-fundamentals -e your@email.com -p yourpassword -f
```

## How It Works

This tool uses Puppeteer to authenticate with Vue School and navigate through course pages. It then extracts video URLs and uses yt-dlp to download the videos in 720p (hardcoded for smaller file sizes, but can be modified in the code for different quality settings).

The downloader automatically organizes videos by course and numbers them sequentially. The implementation downloads video and audio streams separately as that's the format in which the content is available. The tool also supports resuming interrupted downloads and will only download missing or incomplete files when restarted.

### Checking for Missing Videos

Due to network issues or temporary failures, some videos might occasionally fail to download. After downloading a course:

1. Check the course folder in your downloads directory
2. Verify that all lessons are present (both video and audio files)
3. If you notice missing lessons, simply run the download command again with the same course URL
    ```bash
    vuesch-dl https://vueschool.io/courses/vuejs-3-fundamentals -e your@email.com -p yourpassword
    ```
4. The tool will only download missing or incomplete files
5. If you want to re-download all lessons in a course (even if they exist), use the `-f` flag
    ```bash
    vuesch-dl https://vueschool.io/courses/vuejs-3-fundamentals -e your@email.com -p yourpassword -f
    ```

## TODO

-   [ ] Fix bug causing incomplete downloads of course videos
-   [ ] Implement automatic joining of audio and video files
-   [ ] Add progress bars for downloads
-   [ ] Support for custom video quality selection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for personal use only. Please respect Vue School's terms of service and only download courses you have access to through a valid subscription or purchase.

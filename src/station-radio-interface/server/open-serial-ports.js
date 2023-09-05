import fs from 'fs'

export default function OpenSerialPorts () {
  console.log('open serial ports function is running')
    let file_object = []
    fs.readdir('../../../../dev/serial/by-path', (err, files) => {
      console.log('save open radios files', files)
      if (err) {
      console.log(err)
      } else {
        console.log("\nCurrent directory filenames:")
        // return files
        files.forEach((file, i) => {
          console.log('radio serial path', file)
          if (file.substring(38,43) === 'port0') {
            console.log('what is this serial path', file, file.substring(38,43))
          } else {
            let file_path = '/dev/serial/by-path/' + file
            let channel = i-3
            let file_obj = {
              channel,
              path: file_path,
            }
            file_object.push(file_obj)
            console.log('serial port array', file_object)
            return file_object
          }
        })

    fs.writeFile("serial-ports.json", JSON.stringify(file_object),
      {
        encoding: "utf8",
        flag: "w",
        mode: 0o666
      },
        (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync("serial-ports.json", "utf8"));
          }
        });
      }
    })
    console.log('watching serial directory')

    // fs.watch('../../../dev/serial/by-path', (eventType, filename) => {
    //   console.log(`event type is: ${eventType}`);
    //   if (filename) {
    //     console.log(`filename provided: ${filename}`);
    //   } else {
    //     console.log('filename not provided');
    //   }
    // });
}
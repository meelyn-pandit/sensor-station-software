import fs from 'fs'

export default function OpenSerialPorts() {
  // console.log('save open radios regular radio config file',  this.config.data.radios)
  let file_object = []

  const radio_map = fs.readFileSync('../../../etc/ctt/radio-map.json', 
    { 
      encoding: 'utf8', 
      flag: 'r',
    }, 
    (err, file) => {
      if (err) {
        console.log(err)
      } else {
        console.log("\nOriginal Radio Map", Array.isArray(file))
      }
  })
  console.log('radio map', JSON.parse(radio_map), typeof radio_map)
      fs.readdir('../../../../../../dev/serial/by-path', (err, files) => {
        console.log('save open radios files', files)
        if (err) {
          console.log('serial port fs error', err)
        } else {
          console.log("\nCurrent directory filenames:")
          // console.log('radio map in read directory scope', radio_map)

          JSON.parse(radio_map).forEach((radio) => {
            // console.log('radio', radio)
            files.forEach((file) => {
              // console.log('radio serial path', file)
              
              let file_path = '/dev/serial/by-path/' + file
              if (file_path === radio.path) {
                file_object.push(radio)
              }
              
              console.log('serial port array', typeof file_object)
              return file_object
            })
          })

        fs.writeFile("./src/station-radio-interface/server/data/serial-ports.json", JSON.stringify(file_object),
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
                console.log(fs.readFileSync("./src/station-radio-interface/server/data/serial-ports.json", "utf8"));
              }
            });
        }
      })

    console.log('watching serial directory')

      fs.watch('../../../dev/serial/by-path', (eventType, filename) => {
        console.log(`event type is: ${eventType}`);
        if (filename) {
          console.log(`filename provided: ${filename}`);
          // OpenSerialPorts()
        } else {
          console.log('filename not provided');
        }
      })
      return file_object
}
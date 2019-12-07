const express = require('express'),
      ping = require('ping'),
      schema = require('../models/pingModel'),
      device = require('../device.json'),
      readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

const app = express.Router();

readline.question(`Do you want to start ping report ? (y / n) `, (answer)=>{
  if (answer == "y" || answer == "Y" || answer == "yes" || answer == "Yes" || answer == "YES") {
    
    console.log("'Ctrl + C' to stop and close the app")
    
    let hosts = [];

    for (let i = 0; i < device.device.length; i++) {
      hosts.push(device.device[i])
    }

    if (hosts.length > 0) {
      setInterval(()=>{
        hosts.map(function (host) {
            if (host.alamatDevice != null) {
              ping.promise.probe(host.alamatDevice)
                .then(function (result) {
                  let time =result.time,
                      deviceStatus = result.alive,
                      IP = host.alamatDevice,
                      deviceName = host.namaDevice;
                  if(deviceStatus == true) {
                    schema.insertMany({time : time + "ms", deviceStatus : "Aktif", IP : IP, deviceName : deviceName})
                      .then(() => {
                        console.log(`Ping Report Sent : {"time" : "${time}ms", "deviceStatus" : "aktif", "IP" : "${IP}", "deviceName" : "${deviceName}"}`);  
                      }).catch((err) => {
                          console.log(err);
                      });
                  } else{
                    schema.insertMany({time : time, deviceStatus : "Tidak aktif", IP : IP, deviceName : deviceName})
                      .then(() => {
                        console.log(`Ping Report Sent : {"time" : "${time}", "deviceStatus" : "Tidak aktif", "IP" : "${IP}", "deviceName" : "${deviceName}"}`);
                      }).catch((err) => {
                          console.log(err);
                      });
                    }
                })
            } else if(host.alamatDevice == null && host.namaDevice != null) {
                ping.promise.probe(host.namaDevice)
                  .then(function (result) {
                    let time =result.time,
                        deviceStatus = result.alive,
                        IP = result.numeric_host,
                        deviceName = host.namaDevice;
                    if(deviceStatus == true) {
                      schema.insertMany({time : time + "ms", deviceStatus : "Aktif", IP : IP, deviceName : deviceName})
                        .then(() => {
                          console.log(`Ping Report Sent : {"time" : "${time}ms", "deviceStatus" : "aktif", "IP" : "${IP}", "deviceName" : "${deviceName}"}`);  
                        }).catch((err) => {
                            console.log(err);
                        });
                    } else{
                      schema.insertMany({time : time, deviceStatus : "Tidak aktif", IP : IP, deviceName : deviceName})
                        .then(() => {
                          console.log(`Ping Report Sent : {"time" : "${time}", "deviceStatus" : "Tidak aktif", "IP" : "${IP}", "deviceName" : "${deviceName}"}`);
                        }).catch((err) => {
                            console.log(err);
                        });
                      }
                  })
            } else {
              console.log("Error report : Invalid data structure")
            }
            });
            readline.close();
        }, 5000)
    } else {
      console.log("No device detected");
      readline.close();
    }
  } else {
    console.log("Ok, 'Ctrl + C' to close the app");
    readline.close();
  }
})

app.delete('/reset', (req,res,next)=>{
  schema.deleteMany().then(()=>{
    res.status(200).json({
      code : 200,
      message : "Berhasil reset collection"
    })
  }).catch((err)=>{
    res.status(500).json({
      err
    })
  })
})

app.get('/', (req,res)=>{
  schema.find()
    .then((data)=>{
      if(data.length == 0) {
        res.status(200).json({
          code : 200,
          message : "Get data succed",
          data : "No data yet"
        })
      } else {
        res.status(200).json({
          code : 200,
          message : "Get data succed",
          data
        })
      }
    }).catch((err)=>{
      res.status(500).json({
        err
      })
    })
})


module.exports = app
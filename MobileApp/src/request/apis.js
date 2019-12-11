
  import request from './request';
  const hostname = "http://192.168.1.5:"
  const portAPI = '8080/'
  const portFezzy = '5000/'
  
  export const getListDevice = (type, onDone, onFailed) => {
    request
      .get(`${hostname}${portAPI}device/?type=${type}`)
      .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
      .finish((err, res) => {
        if (err) {
          console.log('Hoang log get list device error', err)
          onFailed(err)
        } else {
          console.log('Hoang log res', res);
          onDone(res)
        }
      })
  }
  export const addDevice = (type, name, mac, onDone, onFailed) => {
      request
      .post(`${hostname}${portAPI}device/?name=${name}&mac=${mac}&type=${type}`)
      .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
      .finish((err, res) => {
        if (err) {
            console.log('Hoang log add device error', err)
            onFailed(err)
          } else {
            console.log('Hoang log res', res);
            onDone(res)
          }
      })
  }
  export const deleteDevice = (mac, type, onDone, onFailed) => {
    request
      .delete(`${hostname}${portAPI}device/?mac=${mac}&type=${type}`)
      .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
      .finish((err, res) => {
        if (err) {
          console.log('Hoang log delete device error', err)
          onFailed(err)
        } else {
          console.log('Hoang log res', res);
          onDone(res)
        }
      })
  }
  export const getSchedule = (mac, onDone, onFailed) => {
    request
    .get(`${hostname}${portAPI}schedule/?mac=${mac}`)
    .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
    .finish((err, res) => {
      if (err) {
        console.log('Hoang log get schedule error', err)
        onFailed(err)
      } else {
        console.log('Hoang log res', res);
        onDone(res)
      }
    })
  }

  export const addSchedule = (mac, listSchedule, onDone, onFailed) => {
    console.log("Hoang: ", JSON.parse(JSON.stringify(listSchedule)))
    var schedule = new Array()
    for (let index = 0; index < listSchedule.length; index++) {
      const element = listSchedule[index];
      schedule[index] = {
        time: element.time,
        duration: element.duration
      }
    }
    
    console.log('Hoang log list schedule: ',  JSON.parse(JSON.stringify(schedule)))
    request
    .post(`${hostname}${portAPI}schedule/?mac=${mac}`)
    .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
    .set('Content-Type','application/json')
    .send(
      JSON.parse(JSON.stringify(schedule))
    )
    .finish((err, res) => {
      if (err) {
        console.log('Hoang log add schedule error', err)
        onFailed(err)
      } else {
        console.log('Hoang log res', res);
        onDone(res)
      }
    })
  }

  export const getData = (mac, date_from, date_to, time_from, time_to, onDone, onFailed) => {
    request
    .get(`${hostname}${portAPI}data/?mac=${mac}&date_from=${date_from}&date_to=${date_to}&time_from=${time_from}&time_to=${time_to}`)
    .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
    .finish((err, res) => {
      if (err) {
        console.log('Hoang log get data error', err)
        onFailed(err)
      } else {
        console.log('Hoang log res', res);
        onDone(res)
      }
    })
  }
  export const pump = (mac, type, duration, onDone, onFailed) => {
    request
    .get(`${hostname}${portAPI}pump/?mac=${mac}&type=${type}&duration=${duration}`)
    .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
    .finish((err, res) => {
      if (err) {
        console.log('Hoang log get data error', err)
        onFailed(err)
      } else {
        console.log('Hoang log res', res);
        onDone(res)
      }
    })
  }

  export const getLastData = (mac, onDone, onFailed) => {
    request
    .get(`${hostname}${portAPI}last_data?mac=${mac}`)
    .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
    .finish((err, res) => {
      if (err) {
        console.log('Hoang log get data error', err)
        onFailed(err)
      } else {
        console.log('Hoang log res', res);
        onDone(res)
      }
    })
  }

  export const getRecommend = (temperature, moisture, onDone, onFailed) => {
    request 
    .get(`${hostname}${portFezzy}?temperature=${temperature}&moisture=${moisture}`)
    .set('token', '80688431-a98b-4f89-9766-2e49d793f93a')
    .finish((err, res) => {
      if (err) {
        console.log('Hoang log get data error', err)
        onFailed(err)
      } else {
        console.log('Hoang log res', res);
        onDone(res)
      }
    })
  }

  
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert
} from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import DatePicker from 'react-native-datepicker'

import { Color, Styles } from '../../utils'
import { Header } from '../../components/header';
import { getData, getLastData, getRecommend } from '../../request/apis'
import moment from 'moment';

export default class MeasureDetail extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      choose: 0,
      device: {},
      dataDate: [],
      data:[],
      date: "2019-11-27",
      dateTo: "2019-11-28",
      time: "00:00:00",
      timeTo: "23:59:59",
      temperatureNow: 0,
      humidityNow: 0,
      airNow: 0,
      recomend: 0
    }
  }

  componentWillMount(){
    this.setState({
      device: this.props.navigation.getParam('device'),
      date: moment().format('YYYY-MM-DD').toString(),
      dateTo: moment().format('YYYY-MM-DD').toString(),
      time: moment().subtract(30, 'minute').format('HH:mm:ss').toString(),
      timeTo: moment().format('HH:mm:ss').toString(),
    })
  }


  onDone = (res, filter) => {
    if(res.status == 200) {
      this.setState({
        dataDate: res.body
      },()=>{
        var numberOfDate = 0
        var dateTag = []
        const dataRes = res.body
        if (res.body.length > 0){
          dateTag[0] = dataRes[0].date
          for (let index = 0; index < dataRes.length; index++) {
            const element = dataRes[index];
            if (dateTag.indexOf(element.date) == -1) {
              numberOfDate++
              dateTag[numberOfDate] = element.date
            } 
          }

          var tempData = []
         
          for (let index = 0; index < numberOfDate + 1; index++) {
            tempData[index] = {
              date: dateTag[index],
              temperature : [],
              humidity: [],
              air: []
            }
          }
          for (let index = 0; index < dataRes.length; index++) {
            const element = dataRes[index];
            for (let i = 0; i < numberOfDate + 1; i++) {
              if(element.date == dateTag[i]){
                tempData[i].temperature.push(element.temperature)
                tempData[i].humidity.push(element.humidity < 30.0 ? 30.0 : element.humidity > 95.0 ? 95.0 : element.humidity )
                tempData[i].air.push(element.air)
              }
            }
            
          }
          this.setState({data: tempData})
        } else {
          this.setState({data: []})
        }
      })
    }
  }
  componentDidMount(){
    getLastData(this.state.device.mac,
      (res)=>{
        if(res && res.body && res.body.length == 1) {
          this.setState({
            temperatureNow: res.body[0].temperature,
            humidityNow: res.body[0].humidity < 30 ? 30 : res.body[0].humidity > 95 ? 95 : res.body[0].humidity,
            airNow: res.body[0].air,
          },()=>{
              getRecommend(this.state.temperatureNow, this.state.humidityNow,
                (res)=>{
                  if(res.status == 200){
                    this.setState({
                      recomend: parseInt(res.text)
                    })
                  }
                },
                (err)=>{

                })
          })
        }
      },
      (err)=>{

      })
    getData(
      this.state.device.mac,
      this.state.date, 
      this.state.dateTo,
      this.state.time,
      this.state.timeTo,
      (res) => {
        this.onDone(res, false)
      },
      (err) => {
      }
    )
  }
  _renderItem = (item) => {
    const dataTemp = [20,21,22,23,24,25,26,27,28,29,40]
    const dataHumidity = [30,37,44,51,58,65,72,79,88,95,100]
    const dataAir = [0,10,20,30,40,50,60,70,80,90,100]
    return(
      <View style={{paddingBottom: 10}}>
        <Text>Day: {item.date}</Text>
        <View>
          <View style={{flexDirection: 'row', width: '90%', height: 180}}>
            <YAxis
              data={this.state.choose == 0 ? dataTemp : this.state.choose == 1 ? dataHumidity : dataAir}
              contentInset={{top: 20, bottom: 20}}
              svg={{
                  fill: 'grey',
                  fontSize: 6,
              }}
              yMin={0}
              yMax={100}
              numberOfTicks={10}
              formatLabel={(value)=> value}
            />
            <View 
              style={{
                flexDirection: 'column', 
                width: '90%', 
                height: 200, 
                marginLeft: 16
              }}
            >
            <LineChart
              style={{ height: 180 }}
              data={ this.state.choose == 0 ? item.temperature : this.state.choose == 1 ? item.humidity : item.air }
              contentInset={{ top: 20, bottom: 20 }}
              curve={ shape.curveNatural }
              numberOfTicks = {10}
              yMin={this.state.choose == 0 ? dataTemp[0] : this.state.choose == 1 ? dataHumidity[0] : dataAir[0]}
              yMax={this.state.choose == 0 ? dataTemp[10] : this.state.choose == 1 ? dataHumidity[10] : dataAir[10]}
              svg={{ stroke: this.state.choose == 0 ? 'blue' : this.state.choose == 1 ? '#f70020' : 'green' }}
            > 
              <Grid/>
            </LineChart>
            </View>  
          </View> 
        </View>
      </View>
    );
  }
  render() {
    const device = this.props.navigation.getParam('device')
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header
          title={device.name}
          contentColor={Color.mainColor}
          backgroundColor='#bdbdbd'
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <View style={styles.mainView}>
          <Text style={[Styles.textSemiBold, {fontSize: 17, marginVertical: 10}]}> Infomation: </Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10
          }}>
            <TouchableOpacity style={{
              flex: 1, 
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 15,
              borderLeftWidth: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              flexDirection: 'column',
              borderColor: '#bdbdbd'
              }}
              onPress={()=>{
                this.setState({
                  choose : 0
                })
              }}
            >
              <Text>Temperature:</Text>
            <Text style={[styles.detailText,{color: 'blue'}]}>{this.state.temperatureNow}ºC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1, 
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 15,
              borderWidth: 1,
              flexDirection: 'column',
              borderColor: '#bdbdbd'
              }}
              onPress={()=>{
                this.setState({
                  choose : 1
                })
              }}
            >
              <Text>Humidity:</Text>
            <Text style={[styles.detailText,{color: '#f70020'}]}>{this.state.humidityNow}%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1, 
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 15,
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              flexDirection: 'column',
              borderColor: '#bdbdbd'
              }}
              onPress={()=>{
                this.setState({
                  choose : 2
                })
              }}
            >
              <Text>Air:</Text>
            <Text style={[styles.detailText,{color: 'green'}]}>{this.state.airNow}%</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>Recommended watering time: {this.state.recomend} minutes</Text>
          </View>
          <View style={{
            paddingHorizontal: 10,
            backgroundColor: 'white'
          }}>
            <View style={{
              flexDirection: 'row', 
              height: 50, 
              width: '100%',
              marginBottom: 20,
              paddingTop: 20
            }}>
              <View
              style={{
                flex:1,
                alignItems: 'center',
                flexDirection: 'row'
              }}
              >
                <Text>From: </Text>
                <DatePicker
                  style={{width: 130}}
                  date={this.state.date }
                  mode={ "date" }
                  placeholder="Select date"
                  format={"YYYY-MM-DD"}
                  minDate={ "2019-10-27"}
                  maxDate={this.state.dateTo}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                      height: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(date) => {
                    this.setState({date: date})
                }}
                />
              </View>
              <View
              style={{
                flex:1,
                alignItems: 'center',
                flexDirection: 'row'
              }}
              >
                <Text>To: </Text>
                <DatePicker
                  style={{width: 130}}
                  date={this.state.dateTo}
                  mode={"date"}
                  placeholder="select date"
                  format={"YYYY-MM-DD"}
                  minDate={"2019-10-27"}
                  maxDate={moment().format('YYYY-MM-DD')}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      right: 0,
                      top: 4,
                      marginLeft: 0,
                      height: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(date) => {
                    this.setState({dateTo: date})
                }}
                />
              </View>
            </View>

            <View style={{
              flexDirection: 'row', 
              height: 50, 
              width: '100%',
              marginBottom: 20,
              paddingTop: 20
            }}>
              <View
              style={{
                flex:1,
                alignItems: 'center',
                flexDirection: 'row'
              }}
              >
                <Text>From: </Text>
                <DatePicker
                  style={{width: 130}}
                  date={this.state.time}
                  mode='time'
                  placeholder="Select time"
                  format="HH:mm:ss"
                  minDate="00:00:00"
                  // maxDate={this.state.timeTo}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  is24Hour={true}
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                      height: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(time) => {this.setState({time: time})}}
                />
              </View>
              <View
              style={{
                flex:1,
                alignItems: 'center',
                flexDirection: 'row'
              }}
              >
                <Text>To: </Text>
                <DatePicker
                  style={{width: 130}}
                  date={this.state.timeTo}
                  mode='time'
                  placeholder="Select time"
                  format="HH:mm:ss"
                  minDate={this.state.time}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  is24Hour={true}
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                      height: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(time) => {this.setState({timeTo: time})}}
                />
              </View>
            </View> 

            <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 10}}>
              <TouchableOpacity 
                onPress={()=>{
                  getData(
                    device.mac,
                    this.state.date, 
                    this.state.dateTo,
                    this.state.time,
                    this.state.timeTo,
                    (res) => {
                      this.onDone(res, true)
                    },
                    (err) => {
                      Alert.alert(
                        'Get data of measure failed!',
                        'Please try again!',
                        [
                          {text: 'OK', onPress: () => {}},
                        ],
                        {cancelable: false},
                      );
                    }
                  )
                }}
                style = {{
                  backgroundColor: '#266282',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 4
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 17,
                  fontWeight: 'bold'
                }}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data = {this.state.data}
            keyExtractor = {item => item.key}
            renderItem = {({ item }) => this._renderItem(item)}
          />
        </View>
      </SafeAreaView>
      );
  }
};

const styles = StyleSheet.create({
  mainView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
    paddingHorizontal: 10
  },
  body: {
    backgroundColor: "#ffffff00",
    justifyContent: 'flex-end',
    alignItems: "center",
    flex: 1
  }
});

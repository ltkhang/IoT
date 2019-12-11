import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts'

import DatePicker from 'react-native-datepicker'

import { Styles, Color } from '../../utils'
import { Header } from '../../components/header';
import {getSchedule, addSchedule, pump} from '../../request/apis'
import moment from 'moment'

export default class PumpDetail extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      time: '10:00:00',
      duration: 0,
      progress: 0,
      ispumping: false,
      schedule: 
        [],
      isModalVisible: false,
      device: {}
    }
  }

  componentDidMount(){
    getSchedule(this.state.device.mac,
      (res)=>{
        this.setState({schedule: res.body},()=>{
          for (let index = 0; index < this.state.schedule.length; index++) {
            const element = this.state.schedule[index];
            const timeStart = moment(element.time, 'HH:mm:ss')
            const now = moment()
            if (now.unix() - timeStart.unix() < element.duration * 60 && now.unix() > timeStart.unix()) {
      
            console.log('Hoang: ', timeStart)
              this.setState({
                ispumping: true, 
                progress: (now.unix() - timeStart.unix()) / (element.duration * 60)
              })  
              
            } 
          }
        })
    }, (err) => {

    }) 
    
  }
  _renderItem = (item, index) => {
    return(
        <View style={{
          flexDirection: 'row', 
          width: '100%', 
          paddingVertical: 20, 
          paddingHorizontal: 10,
          borderWidth: 0.5,
          borderColor: '#bdbdbd',
          borderRadius: 4, 
          marginVertical: 3,
          justifyContent: 'space-between'
          }}
          >
            <View style={{
              flexDirection: 'column', 
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Color.secondaryColor
              }}>Time start: <Text style={{
                color: Color.textColor
              }}>{item.time}</Text></Text>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Color.secondaryColor
              }}>Duration: <Text style={{
                color: Color.textColor
              }}>{item.duration}</Text> minutes</Text>
              </View>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
                <TouchableOpacity 
                  onPress={()=>{
                    var listScheduletemp = [...this.state.schedule]
                    listScheduletemp.splice(index, 1)
                    console.log('Hoang: log listschdule ', listScheduletemp)
                    addSchedule(this.state.device.mac, listScheduletemp, 
                      (res) => {
                          if (res.status == 200) {
                            this.setState({
                              schedule: listScheduletemp
                            },()=>{
                              if (this.state.schedule.length == 0) {
                                this.setState({
                                  ispumping: false, 
                                  progress: 0
                                }) 
                              }
                              for (let index = 0; index < this.state.schedule.length; index++) {
                                const element = this.state.schedule[index];
                                const timeStart = moment(element.time, 'HH:mm:ss')
                                const now = moment()
                                if (now.unix() - timeStart.unix() < element.duration * 60 && now.unix() > timeStart.unix()) {
                          
                                console.log('Hoang: ', timeStart)
                                  this.setState({
                                    ispumping: true, 
                                    progress: (now.unix() - timeStart.unix()) / (element.duration * 60)
                                  })  
                                } 
                              }
                            })
                          }
                      }, (err) => {
                        Alert.alert(
                          'Delete schedule failed!',
                          'Please try again!',
                          [
                            {text: 'OK', onPress: () => {}},
                          ],
                          {cancelable: false},
                        );
                      })
                  }}
                  style={{
                    padding: 10
                  }}
                >
                  <Text style={{color: 'red'}}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
  }
  toggleModal = () => {
    this.setState({
      duration: 0,
      time: moment().format('HH:mm:ss')
    })
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  componentWillMount(){
    this.setState({
      device: this.props.navigation.getParam('device')
    })
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
          isHaveButtonRight={true}
          onRightPress={() => this.toggleModal()}
        />
        
        <View style={styles.mainView}>
            <Text style={{
               paddingTop: 10,
               fontSize: 20,
               color: Color.mainColor
            }}> Infomation: </Text>   
            <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 10}}>
                <Text style={{fontSize: 25, fontWeight: 'bold', color:  this.state.ispumping? 'green': 'gray'}}>{this.state.ispumping? 'Pumping' : 'Not pump'}</Text>
            </View> 
              <View style={{ height: 80, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                    style={{
                      padding: 10,
                      height: 50,
                      width: Dimensions.get('window').width / 2 - 40,
                      backgroundColor: 'blue',
                      borderRadius: 5,
                      shadowColor: '#bdbdbd',
                      shadowOffset: {
                        width: 0,
                        height: 3
                      },
                      shadowRadius: 5,
                      shadowOpacity: 1.0,
                      opacity: this.state.ispumping ? 0.5 : 1
                    }}
                    disabled={this.state.ispumping}
                    onPress={() => {
                      Keyboard.dismiss()
                      if (this.state.duration <= 0) {
                        Alert.alert(
                          'Duration must be a positive number!',
                          'Please type again!',
                          [
                            {text: 'OK', onPress: () => {}},
                          ],
                          {cancelable: false},
                        );
                      } else {
                        
                        pump(this.state.device.mac,1,this.state.duration,
                          (res) => {
                            this.setState({ispumping: true})
                          }, 
                          (err) => {
                            Alert.alert(
                              'Start pump failed!',
                              'Please try again!',
                              [
                                {text: 'OK', onPress: () => {}},
                              ],
                              {cancelable: false},
                            );
                          })
                      }
                    }}
                >
                  <Text style={{fontSize: 20, color: '#ffffff', textAlign: 'center'}}>START</Text>  
                </TouchableOpacity>
                {this.state.ispumping? 
                <TouchableOpacity
                style={{
                  padding: 10,
                  height: 50,
                  width: Dimensions.get('window').width / 2 - 40,
                  backgroundColor: 'red',
                  borderRadius: 5,
                  shadowColor: '#bdbdbd',
                  shadowOffset: {
                    width: 0,
                    height: 3
                  },
                  opacity: this.state.ispumping ? 1 : 0.5,
                  shadowRadius: 5,
                  shadowOpacity: 1.0
                }}
                disabled={!this.state.ispumping}
                onPress={() => {
                  pump(this.state.device.mac,0,0,
                    (res) => {
                      this.setState({ispumping: false})
                    }, 
                    (err) => {
                      Alert.alert(
                        'Stop pump failed!',
                        'Please try again!',
                        [
                          {text: 'OK', onPress: () => {}},
                        ],
                        {cancelable: false},
                      );
                    })
                  
                }}
            >
              <Text style={{fontSize: 20, color: '#202646', textAlign: 'center'}}>STOP</Text>  
            </TouchableOpacity> : 
            <View
            style={{
              padding: 10,
              height: 50,
              width: Dimensions.get('window').width / 2 - 40,
              backgroundColor: 'white',
              borderRadius: 5,
              shadowColor: '#bdbdbd',
              shadowOffset: {
                width: 0,
                height: 3
              },
              opacity: this.state.ispumping ? 1 : 0.5,
              shadowRadius: 5,
              shadowOpacity: 1.0
            }}
            >
              <TextInput
                  style={{ height: 40, width: Dimensions.get('window').width * 0.6 }}
                  onChangeText={text => this.setState({duration: text})}
                  value={this.state.duration}
                  numberOfLines={1}
                  keyboardType={'numeric'}
                  placeholder='Type duration'
                  //onSubmitEditing={Keyboard.dismiss()}
                  autoCapitalize={false}
                  autoCorrect={false}
              />
            </View>}
            </View>
            {
              this.state.ispumping ? 
              <View>
                <Text style={{
                  marginBottom: 10,
                  fontSize: 20,
                  color: Color.mainColor}}>Pump Progress:</Text>
                <ProgressCircle
                  style={{ height: 100, justifyContent: 'center', alignItems: 'center' } }
                  progress={this.state.progress}
                  progressColor={'rgb(134, 65, 244)'}
                  animate={true} 
                  animateDuration={5000}
                >
                </ProgressCircle>
              </View> : 
              <View/>
            }
              <Text style={{
                paddingVertical: 10,
                fontSize: 20,
                color: Color.mainColor
              }}>Schedule:</Text>
              <FlatList
                data={this.state.schedule}
                keyExtractor={item => item.time}
                renderItem={({item, index})=> this._renderItem(item, index)}
              />
              <Modal 
                visible={this.state.isModalVisible} 
                style={{
                  backgroundColor: 'white'
                }}
                presentationStyle={'pageSheet'}
                animationType={'slide'}
              >
                <TouchableWithoutFeedback
                  onPress={()=>{
                    Keyboard.dismiss()
                  }}
                >
                <View style={{flex: 1}}>
                  <Header
                    title="Add schedule"
                    onLeftPress={()=>{this.toggleModal()}}
                  />
                  <View style={{width: '100%', paddingHorizontal: 15}}>
                  <Text style={{
                    paddingVertical: 10
                  }}>Choose time start: </Text>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <DatePicker
                      style={{width: 200}}
                      date={this.state.time}
                      mode='time'
                      placeholder="Select time"
                      format="HH:mm:ss"
                      minDate="00:00:00"
                      maxDate="23:59:59"
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
                  <Text style={{
                    paddingVertical: 10
                  }}>Duration: (minute)</Text>
                  <View style={{
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 4,
                      borderColor: '#bdbdbd',
                      borderWidth: 0.5
                  }}>
                      <TextInput
                          style={{ height: 40, width: Dimensions.get('window').width * 0.6 }}
                          onChangeText={text => this.setState({duration: text})}
                          value={this.state.duration}
                          numberOfLines={1}
                          keyboardType={'numeric'}
                          //onSubmitEditing={Keyboard.dismiss()}
                          autoCapitalize={false}
                          autoCorrect={false}
                      />
                  </View>
                  <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 300
                  }}>
                      <TouchableOpacity 
                        onPress={()=>{
                          if (this.state.duration <= 0) {
                            Alert.alert(
                              'Duration must be a positive number!',
                              'Please type again!',
                              [
                                {text: 'OK', onPress: () => {}},
                              ],
                              {cancelable: false},
                            );
                          } else {
                              var listSchedule = [...this.state.schedule]
                              listSchedule.push({time: this.state.time,
                                duration: parseInt(this.state.duration)
                              })
                              addSchedule(
                                this.state.device.mac,listSchedule,
                                (res) => {
                                  this.toggleModal()
                                  if (res.status == 200) {
                                    this.setState({
                                      schedule: listSchedule
                                    },()=>{
                                      for (let index = 0; index < this.state.schedule.length; index++) {
                                        const element = this.state.schedule[index];
                                        const timeStart = moment(element.time, 'HH:mm:ss')
                                        const now = moment()
                                        if (now.unix() - timeStart.unix() < element.duration * 60 && now.unix() > timeStart.unix()) {
                                  
                                        console.log('Hoang: ', timeStart)
                                          this.setState({
                                            ispumping: true, 
                                            progress: (now.unix() - timeStart.unix()) / (element.duration * 60)
                                          })  
                                        } 
                                      }
                                    })
                                  }
                                },
                                (err) => {
                                  Alert.alert(
                                    'Add schedule failed!',
                                    'Please try again!',
                                    [
                                      {text: 'OK', onPress: () => {this.toggleModal()}},
                                    ],
                                    {cancelable: false},
                                  );
                                }
                                )
                          }
                        }}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 30,
                            backgroundColor: '#c5e9f3',
                            borderRadius: 5,
                            
                        }}
                      >
                          <Text>Add Schedule</Text>
                      </TouchableOpacity>
                  </View>
                  </View>
                </View>
                </TouchableWithoutFeedback>
            </Modal>
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

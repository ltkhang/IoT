import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Header } from '../../components/header';
import { Color } from '../../utils';
import { getListDevice, addDevice, deleteDevice } from '../../request/apis'

export default class ListMeasure extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        listMeasureDevice : [
        ],
        isModalVisible: false,
        deviceNameInput: '',
        deviceMac: '',
        deviceType: 'measure'
    }
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  _renderItem = (item, index) => {
      return(
          <TouchableOpacity style={{
              flexDirection: 'row', 
              alignItems: 'center',
              padding: 10,
              margin: 5,
              width: Dimensions.get("window").width - 10,
              borderRadius: 5,
              borderWidth: 0.5,
              borderColor: '#bdbdbd',
              backgroundColor: '#ffffff'
            }}
            onPress={()=>{
                this.props.navigation.navigate("MeasureDetail", {device: item})
            }}
            >
                <Image 
                    source={require('../../assets/images/water.png')} 
                    style={{width: 50 , height: 50, resizeMode: 'contain'}}
                />
                <Text style={{width: '70%'}}>{item.name}</Text>
                <TouchableOpacity 
                  onPress={()=>{
                    deleteDevice(item.mac, 'measure',
                      (res) => {
                        if (res.status == 200) {
                          var listDevice = [...this.state.listMeasureDevice]
                          listDevice.splice(index, 1)
                          this.setState({listMeasureDevice: listDevice})
                        }
                      }, (err) => {
                        Alert.alert(
                          'Delete device failed!',
                          'Please try again!',
                          [
                            {text: 'OK', onPress: () => {}},
                          ],
                          {cancelable: false},
                        );
                      })
                  }}
                  style={{
                    padding: 5
                  }}
                >
                  <Text style={{color: 'red'}}>Delete</Text>
                </TouchableOpacity>
          </TouchableOpacity>
      );
  }

  componentDidMount(){
      getListDevice('measure',
      (res) => {
        this.setState({
          listMeasureDevice: res.body
        })
      }, (err) => {

      })
  }

  render() {
    return (
    <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <Header
            title="List Measure"
            contentColor={Color.mainColor}
            backgroundColor='#bdbdbd'
            onLeftPress={() => this.props.navigation.goBack()}
            onRightPress={()=>{this.toggleModal()}}
            isHaveButtonRight={true}
        />
        
        <ImageBackground 
            source={require('../../assets/images/icon.png')}
            style={styles.mainView}
        >
            <View style={{
                position: 'absolute', 
                zIndex: 1, 
                height: '100%', 
                width: '100%', 
                backgroundColor: '#ffffff01'
                }}/>
            <FlatList
                data={this.state.listMeasureDevice}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => this._renderItem(item, index)}
                style={{zIndex: 2}}
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
                    title="Add measure device"
                    onLeftPress={()=>{this.toggleModal()}}
                  />
                  <View 
                    style={{
                      flexDirection: 'row', 
                      justifyContent:'space-between', 
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      paddingVertical: 20
                      }}
                    >
                        <Text>Name:</Text>
                        <View style={{
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 4,
                            borderColor: '#bdbdbd',
                            borderWidth: 0.5
                        }}>
                            <TextInput
                                style={{ height: 40, width: Dimensions.get('window').width * 0.6 }}
                                onChangeText={text => this.setState({deviceNameInput: text})}
                                value={this.state.deviceNameInput}
                                numberOfLines={1}
                                //onSubmitEditing={Keyboard.dismiss()}
                                autoCapitalize={false}
                                autoCorrect={false}
                            />
                        </View>
                  </View>
                  <View 
                    style={{
                      flexDirection: 'row', 
                      justifyContent:'space-between', 
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      paddingVertical: 20
                      }}
                    >
                        <Text>MAC:</Text>
                        <View style={{
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 4,
                            borderColor: '#bdbdbd',
                            borderWidth: 0.5
                        }}>
                            <TextInput
                                style={{ height: 40, width: Dimensions.get('window').width * 0.6 }}
                                onChangeText={text => this.setState({deviceMac: text})}
                                value={this.state.deviceMac}
                                numberOfLines={1}
                                //onSubmitEditing={Keyboard.dismiss()}
                                autoCapitalize={false}
                                autoCorrect={false}
                            />
                        </View>
                  </View>
                  <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 300
                  }}>
                      <TouchableOpacity 
                        onPress={()=>{
                            addDevice('measure',this.state.deviceNameInput, this.state.deviceMac, (res)=>{
                                if (res.status == 200) {
                                  var listDevice = [...this.state.listMeasureDevice]
                                  var newDevice = {
                                    id: -1,
                                    name: this.state.deviceNameInput,
                                    mac: this.state.deviceMac,
                                    type: "measure",
                                    deleted: 0
                                  }
                                  listDevice.push(newDevice)
                                  this.setState({
                                    listMeasureDevice: listDevice,
                                    deviceMac: '',
                                    deviceNameInput: ''
                                  },()=>{
                                    this.toggleModal()
                                  })
                                }
                            }, (err) => {
                              this.setState({
                                deviceMac: '',
                                deviceNameInput: ''
                              },()=>{
                              })
                              Alert.alert(
                                'Add device failed!',
                                'Please try again!',
                                [
                                  {text: 'OK', onPress: () => this.toggleModal()},
                                ],
                                {cancelable: false},
                              );
                            })
                        }}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 30,
                            backgroundColor: '#c5e9f3',
                            borderRadius: 5,
                        }}>
                          <Text>Add Device</Text>
                      </TouchableOpacity>
                  </View>
                </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ImageBackground>
    </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  mainView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  body: {
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 20
  },
  detailText: {
    fontSize: 20,
    paddingTop: 10,
  }
});

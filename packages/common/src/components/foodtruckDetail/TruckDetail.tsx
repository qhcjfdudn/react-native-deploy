import React, { useEffect, useState, useContext } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
} from "react-native";
import MenuList from './MenuList';
import Line from '../Line'
import axios from 'axios'
import { searchResultContext, searchStoreContext } from '../../store/SearchStore';
import { mainStoreContext } from '../../store/MainStore';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    width: '95%',
    margin: 'auto',
  },
  intro: {
    fontSize: 10
  }
})

interface IState {
  id: Number,
  imgURL?: string,
  title: string,
  contents: string,
  menus: []
}

export default () => {
  const mainStore = useContext(mainStoreContext)
  const searchResultStore = useContext(searchResultContext)
  const [data, setData] = useState<IState>({
    id: 0, imgURL: '', title: '', contents: '', menus: []
  });


  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `${mainStore.proxy}/trucks/${searchResultStore.selectedItem}`,
      );
      setData(result.data);
      console.log(JSON.stringify(result.data));
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Line></Line>
      <View style={styles.title}>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: data.imgURL ? data.imgURL : '' }}
          defaultSource={{uri: `https://picsum.photos/id/${data.id}/200`}}
        />
        <Text>푸드트럭 이름</Text>
        <Text>{data.title}</Text>
      </View>
      <Line></Line>
      <View>
        <Text>소개글</Text>
        <Text>{data.contents}</Text>
      </View>
      <Line></Line>
      <MenuList menulist={data.menus}></MenuList>
      <Line></Line>
    </View>
  )
}

export const TruckDetailDummy: React.FC = () => {
  const searchResultStore = useContext(searchResultContext)
  return (searchResultStore.isSelected === true
      ? <View style={{ height: 1000, width: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
        <Text>{searchResultStore.selectedItem} detail - dummy. update when backend is ready.</Text>
      </View>
      : <View></View>)
}
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, FlatList } from "react-native";
import { IReply } from './TruckInterface';
import { CustomText } from '../../static/CustomStyle';
import axios from 'axios';

interface Props {
  replies: IReply[],
  reviewId: number
}

interface ReplyProps {
  item: IReply;
}

export const ReviewReply: React.FC<Props> = ({ replies, reviewId }) => {
  const myEmail = localStorage.getItem('userEmail')
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}년 ${month}월 ${day}일`;
  }
  const DeleteButton = (replyId) => {
    console.log('data : ', replyId)
    const handleDelete = () => {
      axios.delete(`/replies/delete/${replyId.replyId}`)
      .then(response => {
        location.reload();
      })
      .catch(err => console.log(err))
    }
    return <TouchableOpacity
      style={{ alignSelf: 'flex-start', backgroundColor: '#d91e1e', width: 60, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderRightColor: '#c00e0e', borderRightWidth: 2 }}
      onPress={handleDelete}>
      <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }}>삭제하기</Text>
    </TouchableOpacity>
  }

  const [state, setState] = useState({ detail: false })

  const ReplyItem: React.FC<ReplyProps> = ({ item }) => {
    return <View>
      {console.log('item.userEmail : ', item.userEmail)}
      <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
        {myEmail === item.userEmail ? <DeleteButton replyId={item.id} /> : <></>}
        <Text style={{ alignSelf: 'flex-end' }}>{formatDate(new Date(Date.parse(item.createdAt)))} <Text style={CustomText.italic}>{item.userEmail === null ? '' : (item.userEmail).split('@')[0]}</Text></Text>
      </View>
      <Text style={[CustomText.title, { fontSize: 16 }]}>{item.content}</Text>
    </View>
  }

  const ReplyDetail = () => {
    return <View>
      <FlatList<IReply>
        data={replies}
        renderItem={({ item }) => <View style={styles.replyDetail}><ReplyItem item={item} /></View>}
        keyExtractor={item => item.createdAt}
      />
    </View>
  }

  const [edit, setEdit] = useState(false);

  const togleEdit = () => {
    setEdit(!edit);
    console.log('edit : ', edit)
  }

  const [content, setContent] = useState({ content: '', reviewId: 0 });

  const sendReply = () => {
    console.log('reviewId : ', reviewId);
    if (!!content.content) {
      axios.post('/replies/create', { ...content, reviewId: reviewId })
        .then(response => {
          console.log(response)
          setEdit(false);
          window.location.reload()
        })
        .catch(err => console.log(err))
    } else {
      alert('내용을 입력해주세요.')
    }
  }
  return (
    <View>
      <TouchableOpacity
        style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 8 }}
        onPress={togleEdit}>
        <Text style={{ fontSize: 13.5 }}>{edit === true ? '닫기' : '답글 달기'}</Text>
      </TouchableOpacity>
      {edit === true &&
        <View>
          <TextInput onChangeText={(text) => setContent({ content: text, reviewId: 0 })} multiline={true} numberOfLines={5}>
          </TextInput>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 8 }}
            onPress={sendReply} >
            <Text>답글 달기</Text>
          </TouchableOpacity>
        </View>
      }
      {replies.length === 0 ? <></>
        : <View style={styles.reviewContainer}>
          {state.detail === true ? <ReplyDetail /> : <ReplyItem item={replies[0]} />}
          {replies.length === 1 ? <></> : <TouchableOpacity onPress={() => setState({ detail: !state.detail })}><Text>{state.detail === true ? '닫기' : '더 보기'}</Text></TouchableOpacity>}
        </View>
      }
    </View>
  )
}

const localStyle = StyleSheet.create({
  reviewContainer: {
    marginLeft: '5%',
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  replyDetail: {
    paddingVertical: 10,
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
  }
})

const styles = { ...localStyle }
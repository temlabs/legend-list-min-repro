import { loremIpsum } from '@/loremIpsum'
import { LegendList, LegendListRenderItemProps } from '@legendapp/list'
import { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type DataItem = {
    type:'item';
    id:string;
    text:string;
} | {type:'header'; id:string; title:string;}

const generateRandomNumber = (min:number, max:number)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getListData():[DataItem[], number[]]{
    const maxCharLength = 100
    const dataLength = 20
    const data:DataItem[] = [{type:'header', id:'header-initial', title:'Initial Header'}]
    const text = loremIpsum.replace(/\n/g, ' ')
    const headerIndices = [0]
    
    let cursor = 0
let lastHeaderIndex = 0

    for (let i = 0; i < dataLength; i++) {
        const textLength = generateRandomNumber(10, maxCharLength)
        const endSlice = Math.min(cursor + textLength, text.length)
        const dataItem = text.slice(cursor, endSlice)
        data.push({
            type:'item',
            id: i.toString(),
            text: dataItem
        })
        cursor += textLength
    }
    return [data, headerIndices]
}

export default function list() {

    const [listData, headerIndices] = useMemo(()=>{
        return getListData()
    },[])

    const renderItem = useCallback( (props:LegendListRenderItemProps<DataItem, string | undefined>)=>{
if(props.item.type === 'header'){
return (    <View style={styles.headerContainer}>
<Text>{props.item.title}</Text>
    </View>)
}
else if(props.item.type === 'item'){
return (
    <View style={styles.itemContainer}>
        <Text>{props.item.text}</Text>
    </View>
)
}

    },[listData])


    const keyExtractor = useCallback( (item:DataItem)=>{
        return item.id
    },[])



  return (
<LegendList style={styles.list} data={listData} renderItem={renderItem} keyExtractor={keyExtractor} stickyIndices={headerIndices}/>
  )
}

const styles = StyleSheet.create({
    list:{
        flex:1
    },
    itemContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,

    },
    itemText: {
color:'black'
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
  backgroundColor:'black'

    },
    headerText: {
        color:'white'
    }
})
import { loremIpsum } from '@/loremIpsum'
import { LegendList, LegendListRenderItemProps } from '@legendapp/list'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useCallback, useMemo } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type DataItem = {
    type:'item';
    id:string;
    text:string;
} | {type:'header'; id:string; title:string;}

const DATA_LENGTH = 500
const MAX_DATA_ITEM_LENGTH = 200
const MIN_HEADER_INDICES_SPACING = 15
const HEADER_INSERT_PROBABILITY = 0.6
const SCROLL_VIEW_PROBABILITY = 0.2
const SCROLL_VIEW_COLOURS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'black']
const SCREEN_WIDTH = Dimensions.get('window').width

const generateRandomNumber = (min:number, max:number)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getListData():[DataItem[], number[]]{

   
    const data:DataItem[] = [{type:'header', id:'header-initial', title:'Initial Header'}]
    const text = loremIpsum.replace(/\n/g, ' ')
    const headerIndices = [0]
    
    let cursor = 0
let lastHeaderIndex = 0
let headerCount = 1

    let itemsAdded = 0
    while (itemsAdded < DATA_LENGTH && cursor < text.length) {
        const requestedLength = generateRandomNumber(10, MAX_DATA_ITEM_LENGTH)
        const remaining = text.length - cursor
        const sliceLength = Math.min(requestedLength, remaining)
        if (sliceLength <= 0) break
        const endSlice = cursor + sliceLength
        const dataItem = text.slice(cursor, endSlice)
        data.push({
            type:'item',
            id: itemsAdded.toString(),
            text: dataItem
        })
        cursor += sliceLength
        itemsAdded += 1

        // Insert a header randomly once minimum spacing since last header is met
        const gapSinceHeader = data.length - lastHeaderIndex
        if (gapSinceHeader >= MIN_HEADER_INDICES_SPACING && Math.random() < HEADER_INSERT_PROBABILITY) {
            const newHeaderIndex = data.length
            const newHeader = {
                type: 'header' as const,
                id: `header-${headerCount}`,
                title: `Header ${headerCount}`
            }
            data.push(newHeader)
            headerIndices.push(newHeaderIndex)
            lastHeaderIndex = newHeaderIndex
            headerCount += 1
        }
    }
    return [data, headerIndices]
}

export default function index() {
const insets = useSafeAreaInsets()
  const bottomBarHeight = useBottomTabBarHeight()

    const [listData, headerIndices] = useMemo(()=>{
        return getListData()
    },[])

    const renderItem = useCallback( (props:LegendListRenderItemProps<DataItem, string | undefined>)=>{
if(props.item.type === 'header'){
return (    <View style={styles.headerContainer}>
<Text style={styles.headerText}>{props.item.title}</Text>
    </View>)
}
else if(props.item.type === 'item'){
  const renderScrollView = false//Math.random() < SCROLL_VIEW_PROBABILITY
  
return renderScrollView ? <ScrollView horizontal>
  {new Array(5).fill(0).map((_, index)=>(
    <View style={styles.scrollViewItemContainer} key={index}>
      <View key={index} style={{backgroundColor: SCROLL_VIEW_COLOURS[index % SCROLL_VIEW_COLOURS.length],  height:100}}>

    </View>
     
    </View>
  ))}
</ScrollView>  : (
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
    <View style={[styles.container, {paddingBottom: bottomBarHeight}]}>
      <View style={{height: insets.top, backgroundColor:'black', width:'100%'}}/>
<LegendList style={styles.list} data={listData} renderItem={renderItem} keyExtractor={keyExtractor} 
stickyIndices={headerIndices} 
bounces={false} />

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list:{
        flex:1
    },
    itemContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent:'center',
        alignItems:'center'

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
        color:'white',
        fontWeight:'600'
    },
    scrollViewItemContainer: {
      width:SCREEN_WIDTH,
      padding: 16

    }
})
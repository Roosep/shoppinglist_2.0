import { FlatList, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Header, Icon, Input, Button, ListItem } from '@rneui/themed';

const db = SQLite.openDatabase('productdb.db');

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists products (id integer primary key not null, product text, amount text);');
      }, null, updateList);
  }, []);
    
  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into products (product, amount) values (?, ?);',
        [product, amount]);
      }, null, updateList)
    
    setProduct("");
    setAmount("");
  }
  
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from products;', [], (_, { rows }) =>
        setProductList(rows._array)
      );
    }, null, null)
  }    

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from products where id = ?;', [id]);
    }, null, updateList)
  }

  renderItem = ({ item }) => (
    <ListItem bottomDivider style={{height: 75}}>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle style={{color: "#808080"}}>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron
        name='delete'
        color="red"
        onPress={() => deleteItem(item.id)}
      />
    </ListItem>
    )

  return (
    <View style={styles.container}>
      <Header 
      centerComponent={{ text: "Shopping List", style: { color: "#fff"} }}
      />
      <View style={styles.container}>
        <Input
          label="Product"
          containerStyle={{width: 300}}
          placeholder='Product'
          onChangeText={product => setProduct(product)}
          value={product} />
        <Input
          label="Amount"
          containerStyle={{width: 300}}
          placeholder='Amount'
          onChangeText={amount => setAmount(amount)}
          value={amount} />
          <Button raised containerStyle={{width: 150}} icon={{name: "save", color: "#ffff"}} onPress={saveItem} title="Save" />
      </View>
      
      <View style={styles.list}>
        <FlatList
          data={productList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    width: 300,
  },
});

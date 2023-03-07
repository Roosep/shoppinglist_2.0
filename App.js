import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [productList, setProductList] = useState([]);
  const db = SQLite.openDatabase('productdb.db');

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
    

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <TextInput
          style={{width:200, height: 40, borderColor: 'gray', borderWidth:1, marginBottom: 10}}
          placeholder='Product'
          onChangeText={product => setProduct(product)}
          value={product} />
        <TextInput
          style={{width:200, height: 40, borderColor: 'gray', borderWidth:1}}
          placeholder='Amount'
          onChangeText={amount => setAmount(amount)}
          value={amount} />
      </View>
      <Button onPress={saveItem} title="Save" />

      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 20, marginBottom: 5}}>Shopping List</Text>
        <FlatList
          style={{marginLeft : "5%"}}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) =>
            <View style={{flexDirection: "row"}}>
              <Text>{item.product}, {item.amount} </Text>
              <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
            </View>}
          data={productList}
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
  input: {
    marginTop: 250,
    marginBottom: 10,
  }
});

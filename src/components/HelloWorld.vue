<template>
  <div id="app" class="container">
    <div class="page-header">
      <h1>Teneocto demo</h1>
    </div>
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h4>Add product</h4>
      </div>
      <div class="panel-body">
        <form id="form" class="form-horizontal" v-on:submit="addProduct()">
          <div class="form-group">
            <label class="control-label col-sm-2">Id</label>
            <div class="col-sm-8">
              <input type="text" v-model="_id" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Name</label>
            <div class="col-sm-8">
              <input type="text" v-model="_name" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Description</label>
            <div class="col-sm-8">
              <input type="text" v-model="_description" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Price</label>
            <div class="col-sm-8">
              <input type="number" v-model="_price" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Category</label>
            <div class="col-sm-8">
              <select class="form-control" v-model="_category">
                <option>clothes</option>
                <option>food</option>
                <option>household good</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Image</label>
          </div>
          <div class="form-group">
            <input type="submit" class="btn btn-primary" value="Add product">
          </div>
        </form>
      </div>
    </div>
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3>Product's Information</h3>
      </div>
      <div class="panel-body">
        <table class="table table-stripe">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Desciption</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" v-bind:key="book.id">
              <td>{{book.image}}</td>
              <td>{{book.name}}</td>
              <td>{{book.description}}</td>
              <td>{{book.price}}</td>
              <td>{{book.category}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import Vuefire from "vuefire";
import firebase from "firebase";
import "firebase/firestore";
var config = {
  apiKey: "AIzaSyDGu5dDzNB1RbUS-lU6WvL51s8jc1BYjpc",
  authDomain: "vuejs-firebase-425c6.firebaseapp.com",
  databaseURL: "https://vuejs-firebase-425c6.firebaseio.com",
  projectId: "vuejs-firebase-425c6",
  storageBucket: "vuejs-firebase-425c6.appspot.com",
  messagingSenderId: "1062324573032"
};
firebase.initializeApp(config);
const database = firebase.firestore();
database.settings({
  timestampsInSnapshots: true
});

database.enablePersistence();
export default {
  name: "HelloWorld",


  data() {
    return {
      books: [],
      _id:null,
      _name:null,
      _description:null,
      _price:null,
      _category:null,
      _image:null,
 
    };
  },
  created() {
    database.collection("products").get().then(querySnapshot =>{
      querySnapshot.forEach(doc =>{
        console.log(doc.data());
        const data = {
          'id': doc.id,
          'name':doc.data().name,
          'description':doc.data().description,
          'price':doc.data().price,
          'category':doc.data().category,
          'image':doc.data().image
        }
        this.books.push(data);
      })
    })
  },
  methods:{
    addProduct(_id,_name,_description,_price,_category,_image){
    database.collection("products").add({
          'id': this._id,
          'name':this._name,
          'description':this._description,
          'price':this._price,
          'category':this._category,
          // 'image':this._image
    })
  }
  }

};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
th {
  text-align: center;
}
</style>

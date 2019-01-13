<template>
  <div id="app" class="container">
    <div class="page-header">
      <h1>Teneocto demo</h1>
    </div>
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3>Add product</h3>
      </div>
      <div class="panel-body">
        <form id="form" class="form-horizontal">
          <div class="form-group">
            <label class="control-label col-sm-2">Name</label>
            <div class="col-sm-8">
              <input type="text" v-model="Productname" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Description</label>
            <div class="col-sm-8">
              <input type="text" v-model="Productdescription" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Price</label>
            <div class="col-sm-8">
              <input type="number" v-model="Productprice" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Category</label>
            <div class="col-sm-8">
              <select class="form-control" v-model="Productcategory">
                <option>clothes</option>
                <option>food</option>
                <option>household good</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Image</label>
            <input id="fileInput" type="file" @change="selectedFile">
          </div>
          <div class="form-group">
            <button class="btn btn-primary" @click="addProduct()">Add product</button>
            <button class="btn btn-primary" @click="refreshFrom()">Refresh</button>
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
            <tr v-for="product in products" v-bind:key="product.id">
              <td>
                <img v-bind:src="product.image">
                <input type="file" v-if="edit == product.id" @change="selectedFile">
              </td>
              <td>
                <input
                  id="tableInput"
                  type="text"
                  class="form-control"
                  :readonly="(edit==product.id)?false:true"
                  v-model="product.name"
                >
              </td>
              <td>
                <input
                  id="tableInput"
                  type="text"
                  class="form-control"
                  :readonly="(edit == product.id)?false:true"
                  v-model="product.description"
                >
              </td>
              <td>
                <input
                  id="tableInput"
                  type="text"
                  class="form-control"
                  :readonly="(edit == product.id)?false:true"
                  v-model="product.price"
                >
              </td>
              <td>
                <select
                  id="tableInput"
                  class="form-control"
                  :disabled="(edit == product.id)?false:true"
                  v-model="product.category"
                >
                  <option>clothes</option>
                  <option>food</option>
                  <option>household good</option>
                </select>
              </td>
              <td>
                <button
                  class="btn btn-primary"
                  v-if="edit != product.id"
                  @click="editProduct(product.id)"
                >Edit</button>
                <button
                  v-if="edit == product.id"
                  class="btn btn-primary"
                  @click="saveChange(product)"
                >Save</button>
                <button class="btn btn-danger" @click="deleteProduct(product.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { create } from "domain";
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
const storage = firebase.storage();

database.enablePersistence();
export default {
  name: "Product upload",

  data() {
    return {
      products: [],
      Productid: null,
      Productname: null,
      Productdescription: null,
      Productprice: null,
      Productcategory: null,
      Productimage: null,
      file: null,
      url: null,
      edit: null,
      temp: null,
      isLoaded: false
    };
  },
  created() {
    database
      .collection("products")
      .orderBy("name")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
            category: doc.data().category,
            image: doc.data().image
          };
          this.products.push(data);
        });
      });
  },

  methods: {
    refreshFrom() {
      (this.Productid = null),
        (this.Productname = null),
        (this.Productdescription = null),
        (this.Productprice = null),
        (this.Productcategory = null),
        (document.getElementById("fileInput").value = "");
    },
    getData() {
      let array = [];
      database
        .collection("products")
        .orderBy("name")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              name: doc.data().name,
              description: doc.data().description,
              price: doc.data().price,
              category: doc.data().category,
              image: doc.data().image
            };
            array.push(data);
          });
        });
      this.products = array;
      this.refreshFrom();
    },
    selectedFile(event) {
      this.file = event.target.files[0];
    },
    addProduct(
      Productid,
      Productname,
      Productdescription,
      Productprice,
      Productcategory
    ) {
      var that = this;
      var uploadTask = storage.ref("image/" + this.file.name).put(this.file);
      uploadTask.on(
        "state_changed",
        function(snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        function(error) {
          // Handle unsuccessful uploads
        },
        function() {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            database.collection("products").add({
              name: that.Productname,
              description: that.Productdescription,
              price: that.Productprice,
              category: that.Productcategory,
              image: downloadURL
            });
            that.getData();
          });
        }
      );
    },
    editProduct(id) {
      this.edit = id;
    },
    saveChange(product) {
      this.edit = 0;
      var temp = product;
      var that = this;
      console.log(that.name);
      database
        .collection("products")
        .doc(product.id)
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image
        });
      if (this.file != null) {
        var uploadTask = storage.ref("image/" + this.file.name).put(this.file);
        uploadTask.on(
          "state_changed",
          function(snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log("Upload is running");
                break;
            }
          },
          function(error) {
            // Handle unsuccessful uploads
          },
          function() {
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function(downloadURL) {
                console.log("File available at", downloadURL);

                database
                  .collection("products")
                  .doc(temp.id)
                  .update({
                    image: downloadURL
                  });
                that.getData();
              });
          }
        );
      } else {
        this.getData();
      }
    },

    deleteProduct(id) {
      database
        .collection("products")
        .doc(id)
        .delete();
      this.getData();
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
th,
#tableInput,
option {
  text-align: center;
}
img {
  width: 100px;
  height: 100px;
}
button {
  width: 100px;
  height: 50px;
}
</style>

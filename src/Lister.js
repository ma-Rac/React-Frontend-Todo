import React from 'react';
import Todo from './Todo';
import $ from 'jquery';
import AddTodo from './AddTodo'
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

   class Lister extends React.Component {
     constructor(){
       super();

       this.state = {
                   message: "There are no todos yet.",
                   todos: [],
                   loading: true,
                   counts: {
                     todo: 0,
                     done: 0
                   }
             };
   }

      renderTodo(todo){
           return(

                  <Todo
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  completed={todo.completed}
                  createdAt={todo.created_at}
                  updatedAt={todo.updated_at}
                  onDestroy={this.loadTodos.bind(this)}
                  onChange={this.loadTodos.bind(this)}
                  />

               )
       }
    componentDidMount() {
    // window.setTimeout(this.loadTodos.bind(this), 1000);
        this.loadTodos();
    }

    loadTodos() {
        let url = this.props.url;
        let component = this;

        this.serverRequest = $.get(url, function (result) {
         var importtodos = result
         this.setState({
           todos: importtodos,
           loading: false,
           counts: {
             todo: component.todosTodo().length,
             done: component.todosDone().length
           }

         });
         this.reCount();
       }.bind(this));

     }
    // APPARENTLY THIS DOESNT FUCKING WORK FOR REASONS I CANNOT COMPREHEND.
    // $.ajax({
    //    type: "GET",
    //    url: url,
    //    dataType: 'json',
    //    error: function(){
    //      console.log('Unable to load feed, Incorrect path or invalid feed');
    //    },
    //    success: function(json){
    //      component.setState({
    //        message: "Loading succeeded",
    //        todos: json.responseData
    //       //  loading: false
    //      });
    //    }
    //  });


    reCount() {
        let component = this;
        this.setState({
          message: "",
          counts: {
            todo: component.todosTodo().length,
            done: component.todosDone().length
          }
        });
    }

    todosTodo() {
      return this.state.todos.filter(function(todo, i) {
      return todo.completed !== true;
      });
    }

    todosDone() {
        return this.state.todos.filter(function(todo, i) {
        return todo.completed === true;
      });
    }


   onChangeCompleted(title, bool){
   // create a new list of todo by looping over the existing list
   // and replacing the todo we want to change the score for
     var oldTodos = this.state.todos;
     let component = this;
     var newTodos = oldTodos.map(function(todo){
         if(todo.title == title){
             return {
                 title: todo.title,
                 completed: bool,
                 counts: {
                   todo: component.todosTodo().length,
                   done: component.todosDone().length
                 }
             }
         }

         return todo;
         });

         this.setState({
             message: "",
             todos: newTodos
     });

 }

 saveData(newTodo){
   let component = this;
   let url = this.props.url;
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({
            todo: {
              id: null,
              title: newTodo.title,
              completed: false
            }
        }),
        contentType: "application/json",
        dataType: "json"
    });

}

 onAddTodo(todo){
         var newTodo = { title: todo, completed: false };
         let component = this;
         var newTodos = this.state.todos.concat(newTodo);
         this.saveData(newTodo);
         this.setState({
             todos: newTodos,
             counts: {
               todo: component.todosTodo().length,
               done: component.todosDone().length
             }
         });
         this.reCount();
  }


  destroyDone(event){

        event.preventDefault();
        console.log("Destroying all!");

        let component = this;
        console.log(component.todosDone());
        var futureTrash = component.todosDone();
        for (var i = 0; i < futureTrash.length; i++) {
            this.deleteOne(futureTrash[i])
          }
          this.setState({
            todos: this.todosTodo()
            });
          this.reCount();
      }

deleteOne(todie){
  let component = this;
  $.ajax({
    type: "DELETE",
    url: `https://afternoon-taiga-98870.herokuapp.com/todos/${todie.id}.json`,
    contentType: "application/json",
    dataType: "json"
  })
    .done(function(data) {
      console.log(data);
      console.log("Anhialated");
    })

    .fail(function(error) {
      console.log(error);
    })

    .always(function() {
      // todie.onDestroy();
    });
}

renderLoading() {
    return(
      <RefreshIndicator
        top={100}
        left={window.innerWidth / 2 - 50}
        size={100}
        loadingColor={"#FF9800"}
        status="loading" />
    );
  }
       render() {
         if (this.state.loading) {
           return this.renderLoading();
           }
           return (
            //  <div>
            //    <table>
            //       <thead>
            //           {this.state.message}
            //       </thead>
            //       <tbody>
            //         <tr>
            //           <td>{this.state.todos.map(this.renderTodo.bind(this))}</td>
            //         </tr>
            //       </tbody>
            //       <tfoot>
            //         <tr>
            //           <td><AddTodo onSubmit={this.onAddTodo.bind(this)} /></td>
            //         </tr>
            //       </tfoot>
            //    </table>
            //    <p>{this.state.todos.length} total • {this.state.counts.todo} left • {this.state.counts.done} done</p>
            //     <a href="#" onClick={this.destroyDone.bind(this)}>Clear Done</a>
            // </div>
                <div>
                   <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHeaderColumn>Todo</TableHeaderColumn>
                          <TableHeaderColumn></TableHeaderColumn>
                          <TableHeaderColumn>Delete</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                              {this.state.todos.map(this.renderTodo.bind(this))}
                      </TableBody>
                  </Table>
                <p>{this.state.todos.length} total • {this.state.counts.todo} left • {this.state.counts.done} done</p>
                <RaisedButton label="Clear Done" style={style} onClick={this.destroyDone.bind(this)} primary={true} />
                <AddTodo onSubmit={this.onAddTodo.bind(this)} />
              </div>

           );
       }
   }

   export default Lister;

import React from 'react';
import $ from 'jquery';
import EditField from './EditField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

  class Todo extends React.Component {
    constructor() {
      super();

      this.state = {
        loading: true
      };
    }

    componentDidMount() {
      this.setState({
        id: this.props.id,
        title: this.props.title,
        completed: this.props.completed,
        createdAt: this.props.createdAt,
        updatedAt: this.props.updatedAt,
        loading: !!!this.props.id
      });

    }

    updateTitle(newTitle) {
   console.log(newTitle);
   this.syncState({title: newTitle});
 }

 toggleChecked(event) {
   this.syncState({
     completed: this.refs.completed.checked
   });
 }

 syncState(updatedState) {
   console.log("Syncing state!");
   console.log(updatedState);
   this.setState({
     loading: true
   });

   let component = this;

   let newState = $.extend({
     id: this.state.id,
     title: this.state.title,
     completed: this.state.completed
   }, updatedState);

   this.setState(newState);

   console.log(newState);

   $.ajax({
     type: "PUT",
     url: `https://afternoon-taiga-98870.herokuapp.com/todos/${this.props.id}.json`,
     data: JSON.stringify({
         todo: newState
     }),
     contentType: "application/json",
     dataType: "json"
   })
     .done(function(data) {
       console.log(data);

       component.setState({
         id: data.id,
         title: data.title,
         completed: data.completed,
         createdAt: data.created_at,
         updatedAt: data.updated_at
       });
     })

     .fail(function(error) {
       console.log(error);
     })

     .always(function() {
       component.setState({
         loading: false
       });
       component.props.onChange();
     });
    }

    destroyMe(event) {
        event.preventDefault();
        console.log("Destroy clicked!");

        let component = this;
        console.log(this.props.id);
        $.ajax({
          type: "DELETE",
          url: `https://afternoon-taiga-98870.herokuapp.com/todos/${component.props.id}.json`,
          contentType: "application/json",
          dataType: "json"
        })
          .done(function(data) {
            console.log(data);
            console.log("Deleted! :)");
          })

          .fail(function(error) {
            console.log(error);
          })

          .always(function() {
            component.props.onDestroy();
          });
      }

       render() {
           return (

             <TableRow>
               <TableRowColumn>
                  <input className="toggle" id={this.state.id} type="checkbox" ref="completed" checked={this.state.completed ? "checked" : ""} onClick={this.toggleChecked.bind(this)} />
               </TableRowColumn>
               <TableRowColumn>
                 <label for={this.state.id}>
                    <EditField value={this.state.title} onChange={this.updateTitle.bind(this)} isEditable={!this.state.completed} /> {this.state.id}
                 </label>
               </TableRowColumn>
               <TableRowColumn>
                  <a href="#" onClick={this.destroyMe.bind(this)}>x</a>
               </TableRowColumn>
              </TableRow>

              // <div>
              //    <input className="toggle" id={this.state.id} type="checkbox" ref="completed" checked={this.state.completed ? "checked" : ""} onClick={this.toggleChecked.bind(this)} />
              //
              //   <label for={this.state.id}>
              //      <EditField value={this.state.title} onChange={this.updateTitle.bind(this)} isEditable={!this.state.completed} />
              //   </label>
              //
              //   <b>        </b>
              //   <a href="#" onClick={this.destroyMe.bind(this)}>x</a>
              // </div>

           );

        }
  }

export default Todo;

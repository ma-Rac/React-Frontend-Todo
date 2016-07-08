import React from 'react';

   class AddTodo extends React.Component {

       onSubmit(event){
           // if we don't call event.preventDefault, the browser will think we want to submit the form
           event.preventDefault();
           this.props.onSubmit(this.refs.title.value);
       }

       render() {
           return (
               <form onSubmit={this.onSubmit.bind(this)}>
                   <label>New todos!  </label>
                   <input ref="title" />
                   <button>Add Todo</button>
               </form>
           );
       }
   }

   export default AddTodo;

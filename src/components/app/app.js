import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import AppHeader from "../app-header/app-header";
import SearchPanel from "../search-panel/search-panel";
import ItemStatusFilter from "../item-status-filter/item-status-filter";
import TodoList from "../todo-list/todo-list";
import './app.css';
import ItemAddForm from "../item-add-form/item-add-form";


class App extends Component {

   maxId = 100;

   state = {
      todoData: [
         this.createTodoItem('Drink Coffee'),
         this.createTodoItem('Build Awesome App'),
         this.createTodoItem('Go Walk')
      ],
      term: '',
      filter: 'all' // active all done
   };

   createTodoItem(label) {
      return {
         label,
         important: false,
         done: false,
         id: this.maxId++
      }
   }

   deleteIem = (id) => {
      this.setState(({todoData}) => {
         const index = todoData.findIndex((el) => el.id === id);
         const newTodoData = [...todoData];
         newTodoData.splice(index, 1);
         return {
            todoData: newTodoData
         }
      })
   };

   addItem = (text) => {
      const newItem = this.createTodoItem(text);
      this.setState(({todoData}) => {
         const newTodoData = [...todoData];
         newTodoData.push(newItem);
         return {
            todoData: newTodoData
         }
      })
   };

   toggleProperty(arr, id, propName) {
      const index = arr.findIndex((el) => el.id === id);
      const oldItem = arr[index];
      const newItem = {
         ...oldItem,
         [propName]: !oldItem[propName]
      };
      const newArr = [...arr];
      newArr.splice(index, 1, newItem);
      return [...newArr]
   }

   onToggleImportant = (id) => {
      this.setState(({todoData}) => {
         return {
            todoData: this.toggleProperty(todoData, id, 'important')
         }
      })
   };

   onToggleDone = (id) => {
      this.setState(({todoData}) => {
         return {
            todoData: this.toggleProperty(todoData, id, 'done')
         }
      })
   };

   search(items, term) {
      if(term.length === 0) {
         return items;
      }
      return items.filter((item) => {
         return item.label
            .toLowerCase().indexOf(term.toLowerCase()) > -1
      })
   }

   onSearchChange = (term) => {
      this.setState({ term })
   };
   
   filter(items, filter) {
      switch (filter) {
         case 'all':
            return items;
         case 'active':
            return items.filter((item) => !item.done);
         case 'done':
            return items.filter((item) => item.done);
         default:
            return items;
      }
   }

   onFilterChange = (filter) => {
      this.setState({ filter })
   };

   render() {
      const {todoData, term, filter} = this.state;

      const visibleItems = this.filter(
         this.search(todoData, term), filter);

      const doneCount = todoData.filter((el) => el.done).length;
      const todoCount = todoData.length - doneCount;

      return (
         <div className="todo-app">
            <AppHeader toDo={todoCount} done={doneCount}/>
            <div className="top-panel d-flex">
               <SearchPanel onSearchChange={this.onSearchChange}/>
               <ItemStatusFilter filter={filter}
                                 onFilterChange={this.onFilterChange}
               />
            </div>
            <TodoList todos={visibleItems}
                      onDeleted={this.deleteIem}
                      onToggleImportant={this.onToggleImportant}
                      onToggleDone={this.onToggleDone}
            />
            <ItemAddForm onItemAdded={this.addItem}/>
         </div>
      );
   }
}

export default App;
import React from 'react';
import TaskItem, { AddTaskItem } from '../TaskItem/TaskItem';
import taskList from '../../../simulateData/taskList';
import './style.scss'

export default class TaskList extends React.Component{
   constructor (props) { 
      super  ( props ) 
      this.index = taskList.length
      this.state = {
         tempState: {},
         taskList: [...taskList.map(task => ({
            ...task,
            state: {edit: false}
         }))],
      }

      const newAdder = {
         id: 999999,
         completed: false,
         title: '',
         placeholder: 'Добавить пункт',
         newAdder: true,
         state: {edit: false},
      }
      this.state.taskList.push (newAdder)
      this.changeTask = this.changeTask.bind(this)
   }


   changeTask ( action, afterStateUpdateCbk = () => (true) ) {
      const taskState = action.payload
      let newState = {}
      //console.log ( 'changeTask', taskState )
      switch ( action.type ) {
         case "update":
            newState = {
               ...this.state,
               taskList: this.state.taskList.map( task => {
                  return task.id === taskState.id
                     ? {...task, ...taskState}
                     : task 
               } )
            }
         break
         case "remove":
            newState = {
               ...this.state,
               taskList: this.state.taskList.filter ( task => {
                  if ( task.id !== taskState.id ) {
                     return true
                  }
               } )
            }
            break
         case "add":
            const newTaskList = this.state.taskList
            newTaskList.push({
               id : this.index,
               ...taskState,
            })
            newState = {
               ...this.state,
               index: this.index,
               taskList: newTaskList
            }
            this.index++
         break
         case "unsetEditModeAll":
            newState = {
               ...this.state,
               taskList: this.state.taskList.map( task => (
                  {...task, state: {edit:false}}
               ))
            }
         break
      }
      newState.taskList.sort((a, b) => {
         if (a.id > b.id) return 1
         if (a.id < b.id) return -1
      })
      this.setState (newState, afterStateUpdateCbk)
   }

   render () {
      const isEmptyText = this.state.taskList.length <= 0 
         ? <div className="taskList taskList__empty">Список пуст</div>
         : ''
      return (
         <div className="taskList">
            {isEmptyText}
            {this.state.taskList.map( (task) => {
               return <TaskItem 
                         id={task.id} 
                         completed={task.completed}
                         title={task.title}
                         placeholder={task.placeholder}
                         state={task.state}
                         changeTaskHandler={this.changeTask}
                         newAdder={task.newAdder}
                         key={task.id}
                      />
               })
            }
         </div>
      )
   }
}
